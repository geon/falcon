import { createParseError, createParseResult, type Parser } from "./Parser.js";

export const parseAnyChar: Parser<string> = (input, fromIndex) => {
	const parsed = input[fromIndex];
	if (parsed === undefined) {
		return createParseError(fromIndex, "Unexpectedly reached end of file.");
	}

	return createParseResult(1, parsed);
};
