import { parseAnyCharBut } from "../parseAnyCharBut.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseAnyCharBut", [
	{
		name: "no match",
		parser: parseAnyCharBut("a"),
		input: "abc",
		result: createParseError(0, 'Expected any char but "a".'),
	},
	{
		name: "match",
		parser: parseAnyCharBut("b"),
		input: "abc",
		result: createParseResult(1, "a"),
	},
]);
