import { createParseError, createParseResult } from "../Parser";
import { testExamples } from "./testExamples";

testExamples("testExamples", [
	{
		name: "no match",
		parser: () => createParseError(0, "no match"),
		input: "",
		result: createParseError(0, "no match"),
	},
	{
		name: "match",
		parser: () => createParseResult(0, "match"),
		input: "",
		result: createParseResult(0, "match"),
	},
]);
