import { createParseResult, type Parser } from "./Parser";

export const parseNothing =
	<T>(parsed: T): Parser<T> =>
	() =>
		createParseResult(0, parsed);
