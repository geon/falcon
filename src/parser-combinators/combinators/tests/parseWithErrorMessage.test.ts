import { parseError } from "../parseError.js";
import { parseNothing } from "../parseNothing.js";
import { createParseError, createParseResult } from "../Parser.js";
import { parseWithErrorMessage } from "../parseWithErrorMessage.js";
import { testExamples } from "./testExamples.js";

testExamples("parseWithErrorMessage", [
	{
		name: "no match",
		parser: parseWithErrorMessage("custom error", parseError),
		input: "",
		result: createParseError(0, "custom error"),
	},
	{
		name: "match",
		parser: parseWithErrorMessage("custom error", parseNothing("match")),
		input: "",
		result: createParseResult(0, "match"),
	},
]);
