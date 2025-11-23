import { parseAlternatives } from "./parseAlternatives.js";
import { parseChar } from "./parseChar.js";
import type { Parser } from "./Parser.js";
import { parseWithErrorMessage } from "./parseWithErrorMessage.js";

const digits = [
	[...Array(10)].map((_, x) => [String.fromCharCode("0".charCodeAt(0) + x)]),
	[...Array(26)].map((_, x) => [
		String.fromCharCode("a".charCodeAt(0) + x),
		String.fromCharCode("A".charCodeAt(0) + x),
	]),
].flat();

export function parseDigit(base: number): Parser<string> {
	return parseWithErrorMessage(
		`Expected a digit in base ${base}.`,
		parseAlternatives(digits.slice(0, base).flat().map(parseChar)),
	);
}
