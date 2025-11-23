import { createParseError, createParseResult } from "../Parser.js";
import { parseWhitespace } from "../parseWhitespace.js";
import { testExamples } from "./testExamples.js";

testExamples("parseWhitespace", [
	{
		name: "no match",
		parser: parseWhitespace,
		input: "-",
		result: createParseError(0, "Expected whitespace."),
	},
	{
		name: "match space",
		parser: parseWhitespace,
		input: " ",
		result: createParseResult(1, " "),
	},
	{
		name: "match tab",
		parser: parseWhitespace,
		input: "\t",
		result: createParseResult(1, "\t"),
	},
	{
		name: "match multiple",
		parser: parseWhitespace,
		input: " \t",
		result: createParseResult(2, " \t"),
	},
]);
