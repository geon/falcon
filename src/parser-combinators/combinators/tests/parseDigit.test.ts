import { parseDigit } from "../parseDigit.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseDigit", [
	{
		name: "no match dec",
		parser: parseDigit(10),
		input: "-",
		result: createParseError(0, "Expected a digit in base 10."),
	},
	{
		name: "match low dec",
		parser: parseDigit(10),
		input: "0",
		result: createParseResult(1, "0"),
	},
	{
		name: "match high dec",
		parser: parseDigit(10),
		input: "9",
		result: createParseResult(1, "9"),
	},
	{
		name: "out of range dec",
		parser: parseDigit(10),
		input: "a",
		result: createParseError(0, "Expected a digit in base 10."),
	},
	{
		name: "match high hex",
		parser: parseDigit(16),
		input: "f",
		result: createParseResult(1, "f"),
	},
]);
