import { assert, expect, suite, test } from "vitest";
import {
	parsingFailed,
	type ParseError,
	type Parser,
	type ParseResult,
} from "../Parser.js";
import { getLineCol } from "../../../fp/lineNumber.js";

export type Example<T> = Readonly<{
	name?: string;
	parser: Parser<T>;
	input: string;
	fromIndex?: number;
	result: ParseResult<T>;
}>;

export function testExamples<T>(
	suiteName: string,
	examples: Readonly<Example<T>[]>,
) {
	suite(suiteName, () => {
		for (const example of examples) {
			test(example.name ?? example.input, () => {
				const parsed = example.parser(example.input, example.fromIndex ?? 0);

				if (parsingFailed(parsed) && example.result.type !== "error") {
					assert.fail(formatError(parsed, example.input));
				} else {
					expect(parsed).toStrictEqual(example.result);
				}
			});
		}
	});
}

function formatError(parsed: ParseError, input: string): string {
	const { lineBeginIndex, lineEndIndex, columnNumber, lineNumber } = getLineCol(
		input,
		parsed.fromIndex,
	);

	const line = input.slice(lineBeginIndex, lineEndIndex);
	const columnIndex = columnNumber - 1;
	const arrow =
		Array.from(
			{
				length: columnIndex,
			},
			() => " ",
		).join("") + "^";

	return `Parse Error on line ${lineNumber}:${columnNumber}\n${parsed.message}\n${line}\n${arrow}`;
}
