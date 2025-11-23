import { parseAnyChar } from "../parseAnyChar.js";
import { parseError } from "../parseError.js";
import { createParseError, createParseResult } from "../Parser.js";
import { parseSequence } from "../parseSequence.js";
import { testExamples } from "./testExamples.js";

testExamples<readonly string[]>("parseSequence", [
	{
		name: "empty",
		parser: parseSequence([]),
		input: "abc",
		result: createParseResult(0, []),
	},
	{
		name: "no match",
		parser: parseSequence([parseError]),
		input: "",
		result: createParseError(0, "forced error"),
	},
	{
		name: "match",
		parser: parseSequence([parseAnyChar]),
		input: "abc",
		result: createParseResult(1, ["a"]),
	},
	{
		name: "matches",
		parser: parseSequence([parseAnyChar, parseAnyChar, parseAnyChar]),
		input: "abc",
		result: createParseResult(3, ["a", "b", "c"]),
	},
]);
