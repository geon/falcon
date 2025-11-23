import {
	createParseError,
	type Parser,
} from "../parser-combinators/combinators/Parser.js";

export function parseTextUntil(_endParser: Parser<unknown>): Parser<string> {
	return (_input, fromIndex) => {
		return createParseError(
			fromIndex,
			"Expected endParser to match eventually.",
		);
	};
}
