import { parseAlternatives } from "./parseAlternatives.js";
import { parseChar } from "./parseChar.js";
import type { Parser } from "./Parser.js";
import { parseWithErrorMessage } from "./parseWithErrorMessage.js";

const alphas = [
	[...Array(26)].map((_, x) => [
		String.fromCharCode("a".charCodeAt(0) + x),
		String.fromCharCode("A".charCodeAt(0) + x),
	]),
].flat();

export const parseAlpha: Parser<string> = parseWithErrorMessage(
	"Expected a-z or A-Z.",
	parseAlternatives(alphas.flat().map(parseChar)),
);
