import { parseAnyChar } from "../parseAnyChar.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseAnyChar", [
	{
		name: "no match",
		parser: parseAnyChar,
		input: "",
		result: createParseError(0, "Unexpectedly reached end of file."),
	},
	{
		name: "match",
		parser: parseAnyChar,
		input: "abc",
		fromIndex: 1,
		result: createParseResult(1, "b"),
	},
]);
