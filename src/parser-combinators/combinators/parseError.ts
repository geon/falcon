import { createParseError, type Parser } from "./Parser";

export const parseError: Parser<any> = (_, fromIndex) =>
	createParseError(fromIndex, "forced error");
