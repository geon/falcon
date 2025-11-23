import {
	checkLineBreaks,
	checkPageNumbers,
	getPages,
	type Page,
	parsePage,
} from "./page.js";
import { getLines } from "./getLines.js";

export function parseBook(fileContent: string): readonly Page[] {
	const lines = getLines(fileContent);
	const pages = [...getPages(lines)].map(parsePage);

	checkPageNumbers(pages);
	checkLineBreaks(pages);

	return pages;
}
