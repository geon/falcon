import { parseNewline } from "../parseNewline.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseNewline", [
	{
		name: "no match",
		parser: parseNewline,
		input: "-",
		result: createParseError(0, "Expected newline."),
	},
	{
		name: "match",
		parser: parseNewline,
		input: "\n",
		result: createParseResult(1, "\n"),
	},
]);
