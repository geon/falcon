import { parseScores } from "./score.js";
import {
	parseDiceRollInstructions,
	parseHeaders,
	parseIllustrations,
	parseTables,
	parseTurnInstructions,
	renderSection,
	type Section,
} from "./section.js";

interface PageBase {
	pageNumber: number;
	sections: readonly Section[];
}
export interface FailPage extends PageBase {
	readonly type: "FailPage";
}
export interface SingleLinkPage extends PageBase {
	readonly type: "SingleLinkPage";
	readonly link: number;
}
export interface MultipleLinksPage extends PageBase {
	readonly type: "MultipleLinksPage";
	readonly links: readonly {
		readonly choice: string;
		readonly link: number;
	}[];
}

export type Page = FailPage | SingleLinkPage | MultipleLinksPage;

export function* getPages(lines: Generator<string>) {
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

export function parsePage(rawLines: readonly string[]): Page {
	const lines = [...rawLines];
	const pageNumberString = lines.shift();
	const pageNumber = parseInt(pageNumberString || "");

	const content = parseDiceRollInstructions(
		parseTurnInstructions(
			parseTables(
				parseHeaders(
					parseIllustrations(
						parseScores(rawLines.map((line) => ({ type: "text", line }))),
					),
				),
			),
		),
	)
		// Remove empty lines.
		.filter((x) => x.type !== "text" || x.line.length);

	if (
		content.some(
			(section) => section.type === "choices" || section.type === "diceRoll",
		)
	) {
		return {
			pageNumber,
			sections: content,
			type: "MultipleLinksPage",
			links: [],
		};
	}

	const lastSection = content[content.length - 1]!;

	if (
		lastSection.type === "text" &&
		[
			/You have failed/i,
			/Your failure is spectacular/i,
			/You are just a memory/i,
		].some((deathPhrase) => lastSection.line.match(deathPhrase))
	) {
		return { pageNumber, sections: content, type: "FailPage" };
	}

	if (lastSection.type === "text") {
		const match = lastSection.line.match(/Turn to ([\d]+)/i);
		if (match) {
			const link = parseInt(match[1]!);

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

export function parseIntroPage(rawLines: readonly string[]): Page {
	const content = parseTurnInstructions(
		parseTables(
			parseHeaders(
				parseIllustrations(
					parseScores(rawLines.map((line) => ({ type: "text", line }))),
				),
			),
		),
	)
		// Remove empty lines.
		.filter((x) => x.type !== "text" || x.line.length);

	return {
		pageNumber: 0,
		sections: content,
		type: "SingleLinkPage",
		link: 1,
	};
}

export function checkPageNumbers(pages: readonly Page[]) {
	let lastPageNumber = undefined;
	for (const page of pages) {
		if (Number.isNaN(page.pageNumber)) {
			throw new Error("Not a valid page number after page: " + lastPageNumber);
		}

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

export function checkLineBreaks(pages: readonly Page[]) {
	const errors = [];
	for (const page of pages) {
		for (const section of page.sections) {
			if (section.type !== "text") {
				continue;
			}

			const firstChar = section.line[0] as string | undefined;
			if (firstChar !== undefined && firstChar.match(/[a-z]/)) {
				errors.push(
					`Page ${
						page.pageNumber
					}: Lower case first letter on line: ${section.line.substring(0, 40)}`,
				);
			}
			if (firstChar !== undefined && firstChar === " ") {
				errors.push(
					`Page ${
						page.pageNumber
					}: Space on first letter on line: ${section.line.substring(0, 40)}`,
				);
			}
		}
	}

	if (errors.length) {
		throw new Error(errors.join("\n"));
	}
}

export function renderPage(page: Page): string {
	return `
		<html>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="stylesheet" href="../style.css" />
			<body>
				${page.sections.map(renderSection).join("\n")}
				${
					page.type === "SingleLinkPage"
						? `<p><a href="${page.link}.html">Turn to ${page.link}</a></p>`
						: ""
				}
			</body>
		</html>
	`;
}
