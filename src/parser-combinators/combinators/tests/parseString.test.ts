import { createParseError, createParseResult } from "../Parser.js";
import { parseString, parseStringCaseInsensitive } from "../parseString.js";
import { testExamples } from "./testExamples.js";

testExamples("parseString", [
	{
		name: "no match",
		parser: parseString("bye"),
		input: "hello world",
		result: createParseError(0, 'Expected string "bye".'),
	},
	{
		name: "match",
		parser: parseString("hello"),
		input: "hello world",
		result: createParseResult(5, "hello"),
	},
	{
		name: "case insensitive",
		parser: parseStringCaseInsensitive("HelLo"),
		input: "hello world",
		result: createParseResult(5, "HelLo"),
	},
]);
