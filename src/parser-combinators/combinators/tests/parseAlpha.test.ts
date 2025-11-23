import { parseAlpha } from "../parseAlpha.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseAlpha", [
	{
		name: "no match",
		parser: parseAlpha,
		input: "-",
		result: createParseError(0, "Expected a-z or A-Z."),
	},
	{
		name: "match low lowercase",
		parser: parseAlpha,
		input: "a",
		result: createParseResult(1, "a"),
	},
	{
		name: "match high lowercase",
		parser: parseAlpha,
		input: "z",
		result: createParseResult(1, "z"),
	},
	{
		name: "match low uppercase",
		parser: parseAlpha,
		input: "A",
		result: createParseResult(1, "A"),
	},
	{
		name: "match high uppercase",
		parser: parseAlpha,
		input: "Z",
		result: createParseResult(1, "Z"),
	},
]);
