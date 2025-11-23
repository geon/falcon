import { parseOneOrMore, parseZeroOrMore } from "../parseSome.js";
import { parseChar } from "../parseChar.js";
import { testExamples } from "./testExamples.js";
import { createParseError, createParseResult } from "../Parser.js";
import { parseEof } from "../parseEof.js";

testExamples<readonly string[] | readonly undefined[]>("parseSome", [
	{
		name: "parseOneOrMore > match",
		parser: parseOneOrMore(parseChar("a")),
		input: "aabc",
		result: createParseResult(2, ["a", "a"]),
	},
	{
		name: "parseZeroOrMore > match",
		parser: parseZeroOrMore(parseChar("a")),
		input: "aabc",
		result: createParseResult(2, ["a", "a"]),
	},
	{
		name: "parseOneOrMore no match",
		parser: parseOneOrMore(parseChar("b")),
		input: "abc",
		result: createParseError(0, 'Expected char "b".'),
	},
	{
		name: "parseZeroOrMore no match",
		parser: parseZeroOrMore(parseChar("b")),
		input: "abc",
		result: createParseResult(0, []),
	},
	{
		name: "zero-width",
		parser: parseOneOrMore(parseEof),
		input: "",
		result: createParseResult(0, [undefined]),
	},
]);
