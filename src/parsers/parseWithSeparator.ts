import {
	createParseResult,
	type Parser,
} from "../parser-combinators/combinators/Parser.js";

export function parseWithSeparator<T>(
	parser: Parser<T>,
	separator: Parser<unknown>,
): Parser<readonly T[]> {
	return (input, fromIndex) => {
		let consumed = 0;
		const results: T[] = [];

		for (; consumed < input.length - fromIndex; ) {
			const parsed = parser(input, fromIndex + consumed);
			if (parsed.type === "error") {
				return createParseResult(consumed, results);
			}

			consumed += parsed.consumed;
			results.push(parsed.parsed);

			const separatorParsed = separator(input, fromIndex + consumed);
			if (separatorParsed.type === "error") {
				return createParseResult(consumed, results);
			}

			consumed += parsed.consumed;
		}

		return createParseResult(consumed, results);
	};
}
