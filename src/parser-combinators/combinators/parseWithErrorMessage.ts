import { createParseError, parsingFailed, type Parser } from "./Parser.js";

export function parseWithErrorMessage<T>(
	message: string,
	parser: Parser<T>,
): Parser<T> {
	return (...args) => {
		const parsed = parser(...args);
		if (parsingFailed(parsed)) {
			return createParseError(parsed.fromIndex, message);
		}
		return parsed;
	};
}
