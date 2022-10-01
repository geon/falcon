import { readFileSync, writeFileSync, mkdirSync } from "fs";

function* getLines(string: string) {
	const lines = string.split("\n");
	for (const line of lines) {
		yield line;
	}
}

function* skipIntro(lines: Generator<string>) {
	let skipped = false;
	for (const line of lines) {
		if (!skipped) {
			if (line === "THE MISSION") {
				skipped = true;
			}
			continue;
		}

		yield line;
	}
}

function* getPages(lines: Generator<string>) {
	let page: string[] = [];
	for (const line of lines) {
		// Look for numbers alone on a line.
		if (line.match(/^\d+$/)) {
			if (page.length) {
				yield page;
			}
			page = [];
		}

		page.push(line);
	}
	yield page;
}

const diceRollSubtypes = [
	"Thinkstrike" as const,
	"Power of Will" as const,
	"Attack" as const,
	"Evasion" as const,
	"Chance" as const,
];

type DiceRollSubtype = typeof diceRollSubtypes[0];

function isDiceRollSubtype(
	potentiallySubtype: string,
): potentiallySubtype is DiceRollSubtype {
	return diceRollSubtypes.includes(potentiallySubtype as DiceRollSubtype);
}

function makeDiceRollSubtype(potentiallySubtype: string): DiceRollSubtype {
	if (!isDiceRollSubtype(potentiallySubtype)) {
		throw new Error("Not a DiceRollSubtype: " + potentiallySubtype);
	}
	return potentiallySubtype as DiceRollSubtype;
}

interface TextSection {
	type: "text";
	line: string;
}

const scoreLetters = [
	"B" as const,
	"C" as const,
	"D" as const,
	"G" as const,
	"K" as const,
	"T" as const,
	"Q" as const,
];
type ScoreLetter = typeof scoreLetters[0];
interface ScoreSection {
	type: "score";
	letter: ScoreLetter;
}

interface HeaderSection {
	type: "header";
	line: string;
}

interface TableSection {
	type: "table";
	rows: string[][];
}

interface DiceRollSection {
	type: "diceRoll";
	subtype: DiceRollSubtype;
	outcomes: { scores: number[]; link: number | undefined }[];
}

interface ChoicesSection {
	type: "choices";
	options: { choice: string; link: number }[];
}

type Section =
	| TextSection
	| ScoreSection
	| HeaderSection
	| TableSection
	| DiceRollSection
	| ChoicesSection;

interface PageBase {
	pageNumber: number;
	sections: readonly Section[];
}
interface FailPage extends PageBase {
	readonly type: "FailPage";
}
interface SingleLinkPage extends PageBase {
	readonly type: "SingleLinkPage";
	readonly link: number;
}
interface MultipleLinksPage extends PageBase {
	readonly type: "MultipleLinksPage";
	readonly links: readonly {
		readonly choice: string;
		readonly link: number;
	}[];
}

type Page = FailPage | SingleLinkPage | MultipleLinksPage;

function isTruthy<T>(x: T | undefined | null): x is T {
	return !!x;
}

function parseTurnInstructions(sections: Section[]): Section[] {
	const optionGroups: {
		lastSectionIndex: number;
		options: number[];
	}[] = [];
	let options: number[] = [];
	let lastSectionIndex = -2;
	for (let i = 0; i < sections.length; ++i) {
		const section = sections[i];

		const match =
			section.type === "text" && section.line.match(/^Turn to ([\d]+)$/);

		if (!match) {
			continue;
		}

		// Look for continous sections of only turn instructions.
		if (i !== lastSectionIndex + 1 && options.length) {
			optionGroups.push({ lastSectionIndex, options });
			options = [];
		}

		options.push(parseInt(match[1]));
		lastSectionIndex = i;
	}
	if (options.length) {
		optionGroups.push({ lastSectionIndex, options });
	}

	// Insert the option groups in the untouched sections.
	const result = [...sections];
	// Do it in reverse to avoid messing up the unspliced part if the array while splicing it.
	for (const group of optionGroups.reverse()) {
		const firstSectionIndex =
			group.lastSectionIndex - group.options.length * 2 + 1;
		const options = group.options.map((option, i) => {
			const matchingTextSection = sections[firstSectionIndex + i];
			if (!(matchingTextSection && matchingTextSection.type === "text")) {
				console.log(sections);
				throw new Error("No matching text for turn instruction.");
			}
			return {
				choice: matchingTextSection.line,
				link: option,
			};
		});

		result.splice(firstSectionIndex, group.options.length * 2, {
			type: "choices",
			options,
		});
	}

	return result;
}

function parseScores(sections: Section[]): Section[] {
	const regExpString = "\\[score a ([" + scoreLetters.join("") + "])\\]";
	const regExp = new RegExp(regExpString);
	return sections.map((section) => {
		if (section.type === "text") {
			const match = section.line.match(regExp);
			if (match) {
				return { type: "score", letter: match[1] as ScoreLetter };
			}
		}

		return section;
	});
}

function parseHeaders(sections: Section[]): Section[] {
	return sections.map((section) => {
		if (section.type === "text" && section.line.substring(0, 2) === "# ") {
			return { type: "header", line: section.line.substring(2) };
		}

		return section;
	});
}

function parseTables(sections: Section[]): Section[] {
	const tables: {
		lastSectionIndex: number;
		rows: string[][];
	}[] = [];
	let rows: string[][] = [];
	let lastSectionIndex = -2;
	for (let i = 0; i < sections.length; ++i) {
		const section = sections[i];
		if (section.type !== "text") {
			continue;
		}

		const fields = section.line.split("\t");
		if (fields.length <= 1) {
			continue;
		}

		// Look for continous sections of only table rows.
		if (i !== lastSectionIndex + 1 && rows.length) {
			tables.push({ lastSectionIndex, rows });
			rows = [];
		}

		rows.push(fields);
		lastSectionIndex = i;
	}
	if (rows.length) {
		tables.push({ lastSectionIndex, rows });
	}

	// Insert the tables in the untouched sections.
	const result = [...sections];
	// Do it in reverse to avoid messing up the unspliced part if the array while splicing it.
	for (const table of tables.reverse()) {
		const firstSectionIndex = table.lastSectionIndex - table.rows.length + 1;
		result.splice(firstSectionIndex, table.rows.length, {
			type: "table",
			rows: table.rows,
		});
	}

	return result;
}

function parseDiceRollInstructions(sections: Section[]): Section[] {
	const match = sections
		.map(
			(section) =>
				section.type === "text" &&
				section.line.match(
					/Make an? ((Evasion)|(Attack)|(Chance)|(Thinkstrike)|(Power of Will)) Roll/,
				),
		)
		.find((x) => !!x);

	if (!match) {
		return sections;
	}

	const subtype = makeDiceRollSubtype(match[1]);

	const outcomes = sections
		.map((section, sectionIndex):
			| {
					sectionIndex: number;
					scores: number[];
					link: number | undefined;
			  }
			| undefined => {
			if (section.type !== "text") {
				return undefined;
			}

			const match = section.line.match(
				/^If you scored? (a )?(([\d]+)|(([\d]+)(-|( or ))([\d]+))), ((turn to ([\d]+))|(roll again\.))$/,
			);
			if (!match) {
				return undefined;
			}

			let scores: number[] = [];
			if (match[5] && match[8]) {
				const from = parseInt(match[5]);
				const to = parseInt(match[8]);
				scores = Array(to - from + 1)
					.fill(0)
					.map((_, i) => from + i);
			} else if (match[3]) {
				scores = [parseInt(match[3])];
			}

			if (!scores.length) {
				throw new Error("No scores found: " + section.line);
			}

			const link = match[11] ? parseInt(match[11]) : undefined;

			return { sectionIndex, scores, link };
		})
		.filter(isTruthy);

	if (!outcomes.length) {
		console.log(sections);
		throw new Error("Found no roll instructions. ");
	}
	// TODO: Verify that the scores section indices are consecutive.

	// Insert the dice rolls in the untouched sections.
	const result = [...sections];
	const firstSectionIndex = outcomes[0].sectionIndex;
	result.splice(firstSectionIndex, outcomes.length, {
		type: "diceRoll",
		subtype,
		outcomes,
	});

	return result;
}

function parsePage(rawLines: readonly string[]): Page {
	const lines = [...rawLines];
	const pageNumberString = lines.shift();
	const pageNumber = parseInt(pageNumberString || "");

	if (Number.isNaN(pageNumber)) {
		throw new Error("Not a valid page number: " + pageNumberString);
	}

	const content = parseDiceRollInstructions(
		parseTurnInstructions(
			parseTables(
				parseHeaders(
					parseScores(rawLines.map((line) => ({ type: "text", line }))),
				),
			),
		),
	)
		// Remove empty lines.
		.filter((x) => x.type !== "text" || x.line.length);

	if (content.some((section) => section.type === "choices")) {
		return {
			pageNumber,
			sections: content,
			type: "MultipleLinksPage",
			links: [],
		};
	}

	const lastSection = content[content.length - 1];

	if (
		lastSection.type === "text" &&
		(lastSection.line.match(/You have failed/i) ||
			lastSection.line.match(/Your failure is spectacular/i))
	) {
		return { pageNumber, sections: content, type: "FailPage" };
	}

	if (lastSection.type === "text") {
		const match = lastSection.line.match(/Turn to ([\d]+)/i);
		if (match) {
			const link = parseInt(match[1]);

			return {
				pageNumber,
				sections: content,
				type: "SingleLinkPage",
				link,
			};
		}
	}

	return {
		pageNumber,
		sections: content,
		type: "SingleLinkPage",
		link: 1,
	};
}

function checkPageNumbers(pages: readonly Page[]) {
	let lastPageNumber = undefined;
	for (const page of pages) {
		if (
			lastPageNumber !== undefined &&
			page.pageNumber !== lastPageNumber + 1
		) {
			throw new Error(
				"Pages in wrong order. last Good page: " + lastPageNumber,
			);
		}
		lastPageNumber = page.pageNumber;
	}
}

function checkLineBreaks(pages: readonly Page[]) {
	const errors = [];
	for (const page of pages) {
		for (const section of page.sections) {
			if (section.type !== "text") {
				continue;
			}

			const firstChar = section.line[0] as string | undefined;
			if (firstChar !== undefined && firstChar.match(/[a-z]/)) {
				errors.push(
					page.pageNumber + " Lower case first letter on line: " + section.line,
				);
			}
		}
	}

	if (errors.length) {
		throw new Error(errors.join("\n"));
	}
}

const fileContent = readFileSync("falcon1.txt");
const lines = getLines(fileContent.toString("utf8"));
const linesAfterIntro = skipIntro(lines);
const pages = [...getPages(linesAfterIntro)].map(parsePage);

checkPageNumbers(pages);
checkLineBreaks(pages);

// console.log(JSON.stringify(pages, null, "\t"));

function renderPage(page: Page): string {
	return `
		<html>
			<body>
				${page.sections.map(renderSection).join("\n")}
				${
					page.type === "SingleLinkPage"
						? `<a href="${page.link}.html">Turn to ${page.link}</a>`
						: ""
				}
			</body>
		</html>
	`;
}

function renderSection(section: Section): string {
	switch (section.type) {
		case "table":
			return renderTableSection(section);

		case "text":
			return renderTextSection(section);

		case "score":
			return renderScoreSection(section);

		case "header":
			return renderHeaderSection(section);

		case "diceRoll":
			return renderDiceRollSection(section);

		case "choices":
			return renderChoicesSection(section);

		default:
			const bad: never = section;
			throw new Error("No handled: " + bad);
	}
}

function renderTableSection(section: TableSection): string {
	return `<table>
		${section.rows
			.map(
				(row) => `<tr>${row.map((field) => `<td>${field}</td>`).join("")}</tr>`,
			)
			.join("\n")}
		</table>`;
}
function renderTextSection(section: TextSection): string {
	return "<p>" + section.line + "</p>";
}
function renderScoreSection(section: ScoreSection): string {
	return "<p><b>[Score a " + section.letter + "]</b></p>";
}
function renderHeaderSection(section: HeaderSection): string {
	return "<h2>" + section.line + "</h2>";
}
function renderDiceRollSection(section: DiceRollSection): string {
	return `
		<table>
			${section.outcomes
				.map(
					(outcome) => `
						<tr>
							<td>${outcome.scores.join()}</td>
							<td>${
								outcome.link
									? `<a href="${outcome.link}.html">Turn to ${outcome.link}</a>`
									: "Roll Again"
							}</td>
						</tr>`,
				)
				.join("\n")}
		</table>
	`;
}
function renderChoicesSection(section: ChoicesSection): string {
	return `
		<table>
			${section.options
				.map(
					(option) => `
						<tr>
							<td>${option.choice}</td>
							<td><a href="${option.link}.html">Turn to ${option.link}</a></td>
						</tr>`,
				)
				.join("\n")}
		</table>
	`;
}

const outputDirName = "dist";
mkdirSync(outputDirName);
for (const page of pages) {
	writeFileSync(
		outputDirName + "/" + page.pageNumber + ".html",
		renderPage(page),
	);
}
