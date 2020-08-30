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

function parsePage(rawLines: readonly string[]) {
	const lines = [...rawLines];
	const pageNumber = parseInt(lines.shift() || "");
	return { pageNumber, lines };
}

interface Page {
	pageNumber: number;
	lines: readonly string[];
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
		for (const line of page.lines) {
			const firstChar = line[0] as string | undefined;
			if (firstChar !== undefined && firstChar.match(/[a-z]/)) {
				errors.push(
					page.pageNumber + " Lower case first letter on line: " + line,
				);
			}
			const lastChar = line[line.length - 1] as string | undefined;
			if (lastChar !== undefined && lastChar.match(/[a-z]/)) {
				errors.push(
					page.pageNumber + " Lower case last letter on line: " + line,
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

console.log(pages);
