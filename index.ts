import { readFileSync } from "fs";

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

interface ChoicesSection {
	type: "choices";
	options: { choice: string; link: number }[];
}

type Section =
	| { type: "text"; line: string }
	| { type: "header"; line: string }
	| { type: "table"; data: string[][] }
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

// function isDefined<T>(x: T | undefined | null): x is T {
// 	return !!x;
// }

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
	for (const group of optionGroups) {
		const firstSectionIndex =
			group.lastSectionIndex - group.options.length * 2 + 1;
		const options = group.options.map((option, i) => {
			const matchingTextSection = sections[firstSectionIndex + i];
			if (matchingTextSection.type !== "text") {
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

function parseHeaders(sections: Section[]): Section[] {
	return sections.map((section) => {
		if (section.type === "text" && section.line.substring(0, 2) === "# ") {
			return { type: "header", line: section.line.substring(2) };
		}

		return section;
	});
}

function parsePage(rawLines: readonly string[]): Page {
	const lines = [...rawLines];
	const pageNumber = parseInt(lines.shift() || "");

	const content = parseTurnInstructions(
		parseHeaders(rawLines.map((line) => ({ type: "text", line }))),
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
		lastSection.line.match(/You have failed/i)
	) {
		return { pageNumber, sections: content, type: "FailPage" };
	}

	return {
		pageNumber,
		sections: content,
		type: "SingleLinkPage",
		link: 0,
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

console.log(JSON.stringify(pages, null, "\t"));

checkPageNumbers(pages);
checkLineBreaks(pages);
