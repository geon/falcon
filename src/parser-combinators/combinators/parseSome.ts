import { indent } from "../../fp/indent.js";
import {
	createParseError,
	createParseResult,
	parsingFailed,
	type Parser,
} from "./Parser.js";

export function parseOneOrMore<T>(parser: Parser<T>): Parser<readonly T[]> {
	return parseSome(parser, 1);
}

export function parseZeroOrMore<T>(parser: Parser<T>): Parser<readonly T[]> {
	return parseSome(parser, 0);
}

function parseSome<T>(parser: Parser<T>, min: number): Parser<readonly T[]> {
	return (input, fromIndex) => {
		let consumed = 0;
		const parsed = [];
		let errorMessage;
		for (;;) {
			const parseResult = parser(input, fromIndex + consumed);
			if (parsingFailed(parseResult)) {
				errorMessage = parseResult.message;
				break;
			}

			consumed += parseResult.consumed;
			parsed.push(parseResult.parsed);

			// Prevent infinite loop on zero-width parsers.
			// When nothing is consumed, the same input would match again, inifinitely.
			if (!parseResult.consumed) {
				errorMessage = "Stopped after zero-width match.";
				break;
			}
		}

		if (parsed.length < min) {
			return createParseError(
				fromIndex,
				min === 1
					? errorMessage
					: `Found only ${parsed.length} of ${min} repeated matches.\n${indent(errorMessage)}`,
			);
		}

		return createParseResult(consumed, parsed);
	};
}
