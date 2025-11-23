import { parseEof } from "../parseEof.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseEof", [
	{
		name: "no match",
		parser: parseEof,
		input: "-",
		result: createParseError(0, "Expected eof."),
	},
	{
		name: "match",
		parser: parseEof,
		input: "",
		result: createParseResult(0, undefined),
	},
]);
