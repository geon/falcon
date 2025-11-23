import { parseAlternatives } from "../parseAlternatives.js";
import { parseAnyChar } from "../parseAnyChar.js";
import { parseError } from "../parseError.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseAlternatives", [
	{
		name: "empty",
		parser: parseAlternatives([]),
		input: "abc",
		// TODO: Throw instead. The problem is invalid input.
		result: createParseError(0, "No alternative matched."),
	},
	{
		name: "no match",
		parser: parseAlternatives([parseError]),
		input: "",
		result: createParseError(0, "No alternative matched.\n\tforced error"),
	},
	{
		name: "match first",
		parser: parseAlternatives([parseAnyChar, parseAnyChar]),
		input: "abc",
		result: createParseResult(1, "a"),
	},
	{
		name: "match second",
		parser: parseAlternatives([parseAnyChar, parseAnyChar]),
		input: "abc",
		result: createParseResult(1, "a"),
	},
]);
