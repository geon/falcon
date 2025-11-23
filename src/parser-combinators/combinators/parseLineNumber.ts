import { getLineCol } from "../../fp/lineNumber.js";
import { createParseResult, type Parser } from "./Parser.js";

export const parseLineNumber: Parser<ReturnType<typeof getLineCol>> = (
	...args
) => createParseResult(0, getLineCol(...args));
