import { parseEol } from "../parseEol.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseEol", [
	{
		name: "no match",
		parser: parseEol,
		input: "-",
		result: createParseError(
			0,
			"No alternative matched.\n\tExpected newline.\n\tExpected eof.",
		),
	},
	{
		name: "match newline",
		parser: parseEol,
		input: "\nsecond line",
		result: createParseResult(0, "\n"),
	},
	{
		name: "match eof",
		parser: parseEol,
		input: "",
		result: createParseResult(0, undefined),
	},
]);
