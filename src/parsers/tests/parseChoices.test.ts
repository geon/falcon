import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseChoices } from "../parseChoices.js";

testExamples("parseChoices", [
	{
		name: "no match",
		parser: parseChoices,
		input: "-",
		result: createParseError(0, "Expected choices."),
	},
]);
