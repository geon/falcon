import { parseLookahead } from "../parser-combinators/combinators/parseLookahead.js";
import {
	createParseError,
	createParseResult,
	type Parser,
} from "../parser-combinators/combinators/Parser.js";

export function parseTextUntil(endParser: Parser<unknown>): Parser<string> {
	return (input, fromIndex) => {
		for (let consumed = 0; consumed < input.length - fromIndex; ++consumed) {
			const endParsed = parseLookahead(endParser)(input, fromIndex + consumed);
			if (endParsed.type !== "error") {
				return createParseResult(
					consumed,
					input.slice(fromIndex, fromIndex + consumed),
				);
			}
		}

		return createParseError(
			fromIndex,
			"Expected endParser to match eventually.",
		);
	};
}
