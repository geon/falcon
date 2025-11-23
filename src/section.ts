import { type DiceRollSubtype, makeDiceRollSubtype } from "./dice-roll.js";
import { type ScoreLetter } from "./score.js";

export interface TextSection {
	type: "text";
	line: string;
}

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

interface IllustrationSection {
	type: "illustration";
	fileName: string;
}

export type Section =
	| TextSection
	| ScoreSection
	| HeaderSection
	| TableSection
	| DiceRollSection
	| ChoicesSection
	| IllustrationSection;

export function parseTurnInstructions(sections: Section[]): Section[] {
	const optionGroups: {
		lastSectionIndex: number;
		options: number[];
	}[] = [];
	let options: number[] = [];
	let lastSectionIndex = -2;
	for (let i = 0; i < sections.length; ++i) {
		const section = sections[i]!;

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

		options.push(parseInt(match[1]!));
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

export function parseHeaders(sections: Section[]): Section[] {
	return sections.map((section) => {
		if (section.type === "text" && section.line.substring(0, 2) === "# ") {
			return { type: "header", line: section.line.substring(2) };
		}

		return section;
	});
}

export function parseIllustrations(sections: Section[]): Section[] {
	return sections.map((section) => {
		if (section.type === "text" && /image-\d{3}.png/.test(section.line)) {
			return { type: "illustration", fileName: section.line };
		}

		return section;
	});
}

export function parseTables(sections: Section[]): Section[] {
	const tables: {
		lastSectionIndex: number;
		rows: string[][];
	}[] = [];
	let rows: string[][] = [];
	let lastSectionIndex = -2;
	for (let i = 0; i < sections.length; ++i) {
		const section = sections[i]!;
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

export function parseDiceRollInstructions(sections: Section[]): Section[] {
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

	const subtype = makeDiceRollSubtype(match[1]!);

	const outcomes = sections
		.map(
			(
				section,
				sectionIndex,
			):
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
					/^If you scored? (a )?(([\d]+)|(([\d]+)(-|( or ))([\d]+))|(([\d]+), ([\d]+) or ([\d]+))), ((turn to ([\d]+))|(roll again\.))$/,
				);
				if (!match) {
					return undefined;
				}

				let scores: number[] = [];
				if (match[10] && match[11] && match[12]) {
					const a = parseInt(match[10]);
					const b = parseInt(match[11]);
					const c = parseInt(match[12]);
					scores = [a, b, c];
				} else if (match[5] && match[8]) {
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

				const link = match[15] ? parseInt(match[15]) : undefined;

				return { sectionIndex, scores, link };
			},
		)
		.filter(isTruthy);

	if (!outcomes.length) {
		console.log(sections);
		throw new Error("Found no roll instructions. ");
	}
	// TODO: Verify that the scores section indices are consecutive.

	// Insert the dice rolls in the untouched sections.
	const result = sections.slice();
	const firstSectionIndex = outcomes[0]!.sectionIndex;
	result.splice(firstSectionIndex, outcomes.length, {
		type: "diceRoll",
		subtype,
		outcomes,
	});

	return result;
}

function isTruthy<T>(x: T | undefined | null): x is T {
	return !!x;
}

export function renderSection(section: Section): string {
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

		case "illustration":
			return renderIllustrationSection(section);

		default:
			const bad: never = section;
			throw new Error("No handled: " + bad);
	}
}

function renderTableSection(section: TableSection): string {
	return `<table>
			${section.rows
				.map(
					(row) =>
						`<tr>${row.map((field) => `<td>${field}</td>`).join("")}</tr>`,
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
			<table class="choices">
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
			<table class="choices">
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

function renderIllustrationSection(section: IllustrationSection): string {
	return `<img src="${section.fileName}" />`;
}
