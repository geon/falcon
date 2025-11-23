import {
	checkLineBreaks,
	checkPageNumbers,
	getPages,
	Page,
	parsePage,
} from "./page";
import { getLines } from "./getLines";

export function parseBook(fileContent: string): readonly Page[] {
	const lines = getLines(fileContent);
	const pages = [...getPages(lines)].map(parsePage);

	checkPageNumbers(pages);
	checkLineBreaks(pages);

	return pages;
}
