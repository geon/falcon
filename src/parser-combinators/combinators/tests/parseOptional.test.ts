import { parseOptional } from "../parseOptional.js";
import { parseAnyChar } from "../parseAnyChar.js";
import { testExamples } from "./testExamples.js";
import { createParseResult } from "../Parser.js";
import { parseError } from "../parseError.js";

testExamples("parseOptional", [
	{
		name: "no match",
		parser: parseOptional(parseError),
		input: "",
		result: createParseResult(0, undefined),
	},
	{
		name: "match",
		parser: parseOptional(parseAnyChar),
		input: "abc",
		result: createParseResult(1, "a"),
	},
]);
