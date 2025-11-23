import {
	createParseError,
	createParseResult,
	type ParseError,
	type Parser,
	type ParseResult,
} from "../parser-combinators/combinators/Parser.js";

export function parseWithSeparator<T>(
	parser: Parser<T>,
	separator: Parser<unknown>,
): Parser<readonly T[]> {
	return (input, fromIndex) => {
		let consumed = 0;
		const results: T[] = [];
		function done(error: ParseError): ParseResult<readonly T[]> {
			return results.length ? createParseResult(consumed, results) : error;
		}

		for (; consumed < input.length - fromIndex; ) {
			const parsed = parser(input, fromIndex + consumed);
			if (parsed.type === "error") {
				return done(parsed);
			}

			consumed += parsed.consumed;
			results.push(parsed.parsed);

			const separatorParsed = separator(input, fromIndex + consumed);
			if (separatorParsed.type === "error") {
				return done(separatorParsed);
			}

			consumed += separatorParsed.consumed;
		}

		return done(
			createParseError(
				fromIndex,
				"Reached eof without matching separated elements.",
			),
		);
	};
}
