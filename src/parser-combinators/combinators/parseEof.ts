import { createParseError, createParseResult, type Parser } from "./Parser.js";

export const parseEof: Parser<undefined> = (input, fromIndex) =>
	input.length === fromIndex
		? createParseResult(0, undefined)
		: createParseError(fromIndex, "Expected eof.");
