import { parseChar, parseCharCaseInsensitive } from "./parseChar.js";
import { parseMonad } from "./parseMonad.js";
import type { Parser } from "./Parser.js";
import { parseSequence } from "./parseSequence.js";
import { parseWithErrorMessage } from "./parseWithErrorMessage.js";

export function parseString<TString extends string>(
	string: TString,
): Parser<TString> {
	return parseWithErrorMessage(
		`Expected string ${JSON.stringify(string)}.`,
		parseMonad(
			parseSequence(string.split("").map(parseChar)),
			(_, { result }) => result(string),
		),
	);
}

export function parseStringCaseInsensitive<TString extends string>(
	string: TString,
): Parser<TString> {
	return parseMonad(
		parseSequence(string.split("").map(parseCharCaseInsensitive)),
		(_, { result }) => result(string),
	);
}
