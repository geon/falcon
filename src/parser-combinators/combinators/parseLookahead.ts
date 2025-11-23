import { createParseResult, parsingFailed, type Parser } from "./Parser.js";

export const parseLookahead =
	<T>(parser: Parser<T>): Parser<T> =>
	(...args) => {
		const parsed = parser(...args);
		return parsingFailed(parsed) ? parsed : createParseResult(0, parsed.parsed);
	};
