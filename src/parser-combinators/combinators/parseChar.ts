import { parseAnyChar } from "./parseAnyChar.js";
import { parseMonad } from "./parseMonad.js";
import { type Parser } from "./Parser.js";

export function parseChar<Char extends string>(char: Char): Parser<Char> {
	if (char.length !== 1) {
		throw new Error(`Not a char: "${char}"`);
	}

	return parseMonad(parseAnyChar, (parsed, { error, result }) =>
		parsed !== char
			? error(`Expected char ${JSON.stringify(char)}.`)
			: result(char),
	);
}

export function parseCharCaseInsensitive<Char extends string>(
	char: Char,
): Parser<Char> {
	if (char.length !== 1) {
		throw new Error(`Not a char: "${char}"`);
	}

	return parseMonad(parseAnyChar, (parsed, { error, result }) =>
		parsed.toLowerCase() !== char.toLowerCase()
			? error(`Expected char ${JSON.stringify(char)}.`)
			: result(char),
	);
}
