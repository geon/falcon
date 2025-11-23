import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	copyFileSync,
	existsSync,
} from "fs";
import { join } from "path";
import { parseIntroPage, renderPage } from "./page.js";
import { parseBook } from "./book.js";
import { getLines } from "./getLines.js";

const outputMainDirName = "dist";

function processBook(bookNumber: number) {
	const bookFilePath = join("books", bookNumber.toString(), "book.txt");
	const imageFolderPath = join("books", bookNumber.toString(), "images");

	const fileContent = readFileSync(bookFilePath).toString("utf8");
	const pages = parseBook(fileContent);

	if (!existsSync(outputMainDirName)) {
		mkdirSync(outputMainDirName);
	}
	const outputBookDirName = join(outputMainDirName, bookNumber.toString());
	mkdirSync(outputBookDirName);
	for (const page of pages) {
		writeFileSync(
			join(outputBookDirName, page.pageNumber + ".html"),
			renderPage(page),
		);

		// Copy illustrations to dist.
		for (const section of page.sections) {
			if (section.type === "illustration") {
				copyFileSync(
					join(imageFolderPath, section.fileName),
					join(outputBookDirName, section.fileName),
				);
			}
		}
	}

	{
		const introFilePath = join("books", bookNumber.toString(), "intro.md");
		const fileContent = readFileSync(introFilePath);
		const lines = getLines(fileContent.toString("utf8"));
		const page = parseIntroPage([...lines]);
		writeFileSync(join(outputBookDirName, "index.html"), renderPage(page));
		// Copy illustrations to dist.
		for (const section of page.sections) {
			if (section.type === "illustration") {
				copyFileSync(
					join(imageFolderPath, section.fileName),
					join(outputBookDirName, section.fileName),
				);
			}
		}
	}
}

for (const bookNumber of [1, 2, 3]) {
	processBook(bookNumber);
}

// Copy CSS.
const styleFilePathName = "books";
for (const fileName of [
	"style.css",
	"cssreset-min.css",
	"sensible-defaults-for-text.css",
]) {
	copyFileSync(
		join(styleFilePathName, fileName),
		join(outputMainDirName, fileName),
	);
}
