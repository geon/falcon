import { expect, suite, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { renderPage } from "./page.js";
import { parseBook } from "./book.js";

suite("book", () => {
	[1, 2, 3].forEach((bookNumber) => {
		const bookFilePath = join("books", bookNumber.toString(), "book.txt");
		const fileContent = readFileSync(bookFilePath).toString("utf8");
		const pages = parseBook(fileContent);
		suite("book-" + bookNumber.toString(), () => {
			pages.forEach((page) => {
				test(page.pageNumber.toString(), () => {
					expect(renderPage(page)).toMatchSnapshot();
				});
			});
		});
	});
});
