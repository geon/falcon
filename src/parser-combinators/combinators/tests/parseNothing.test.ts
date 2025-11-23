import { parseNothing } from "../parseNothing";
import { createParseResult } from "../Parser";
import { testExamples } from "./testExamples";

testExamples("parseNothing", [
	{
		name: "match",
		parser: parseNothing("match"),
		input: "",
		result: createParseResult(0, "match"),
	},
]);
