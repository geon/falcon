import { createParseResult, parsingFailed, type Parser } from "./Parser.js";

export function parseOptional<T>(parser: Parser<T>): Parser<T | undefined> {
	return (...args) => {
		const parsed = parser(...args);
		return parsingFailed(parsed) ? createParseResult(0, undefined) : parsed;
	};
}
