import { parseError } from "../parseError";
import { createParseError } from "../Parser";
import { testExamples } from "./testExamples";

testExamples("parseError", [
	{
		name: "no match",
		parser: parseError,
		input: "abc",
		result: createParseError(0, "forced error"),
	},
]);
