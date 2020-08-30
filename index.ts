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

interface PageBase {
	pageNumber: number;
	content: readonly string[];
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

function isDefined<T>(x: T | undefined | null): x is T {
	return !!x;
}

interface MultipleChoiceTurnInstuctionLine {
	readonly index: number;
	readonly line: string;
	readonly number: number;
}

function parsePage(rawLines: readonly string[]): Page {
	const lines = [...rawLines];
	const pageNumber = parseInt(lines.shift() || "");




	

	if (lines[lines.length - 1].match(/You have failed/i)) {
		return { pageNumber, content: lines, type: "FailPage" };
	}

	const multipleChoiceTurnInstuctions = lines
		.map((line, index): MultipleChoiceTurnInstuctionLine | null => {
			const match = line.match(/^Turn to ([\d]+)$/);
			return (
				match && {
					index,
					line,
					number: parseInt(match[1]),
				}
			);
		})
		.filter(isDefined);

	if (multipleChoiceTurnInstuctions.length) {
		// Group the choices into groups. There may be more than one group.
		let lastIndex = -2;
		const groups = multipleChoiceTurnInstuctions.reduce<
			MultipleChoiceTurnInstuctionLine[][]
		>((soFar, current) => {
			if (current.index !== lastIndex + 1) {
				soFar.push([]);
			}
			lastIndex = current.index;

			const lastGroup = soFar[soFar.length - 1];
			lastGroup.push(current);

			return soFar;
		}, []);

		const choiceGroups = groups.map((group) => {
			return group.map((choice) => ({
				choice: lines[choice.index - group.length],
				link: choice.number,
			}));
		});

		// Erase the choices from the regular lines.
		for (const group of groups) {
			const backwardsGroup = [...group].reverse();
			for (const choice of backwardsGroup) {
				lines.splice(choice.index);
			}
			for (const choice of backwardsGroup) {
				lines.splice(choice.index - group.length);
			}
		}

		return {
			pageNumber,
			content: lines,
			type: "MultipleLinksPage",
			links: choiceGroups.reduce(
				(soFar, current) => [...soFar, ...current],
				[],
			),
		};
	}

	return {
		pageNumber,
		content: lines,
		type: "SingleLinkPage",
		link: 0,
	};

	// throw new Error("Failed to parse page " + pageNumber);
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
		for (const line of page.content) {
			const firstChar = line[0] as string | undefined;
			if (firstChar !== undefined && firstChar.match(/[a-z]/)) {
				errors.push(
					page.pageNumber + " Lower case first letter on line: " + line,
				);
			}
			// const lastChar = line[line.length - 1] as string | undefined;
			// if (lastChar !== undefined && lastChar.match(/[a-z]/)) {
			// 	errors.push(
			// 		page.pageNumber + " Lower case last letter on line: " + line,
			// 	);
			// }
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

console.log(pages);

checkPageNumbers(pages);
checkLineBreaks(pages);

