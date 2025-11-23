import { parseChar } from "../parseChar.js";
import { parseLookahead } from "../parseLookahead.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseLookahead", [
	{
		name: "no match",
		parser: parseLookahead(parseChar("b")),
		input: "abc",
		result: createParseError(0, 'Expected char "b".'),
	},
	{
		name: "match",
		parser: parseLookahead(parseChar("a")),
		input: "abc",
		result: createParseResult(0, "a"),
	},
]);
