import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parsePage } from "../parsePage.js";

testExamples("parsePage", [
	{
		name: "no match",
		parser: parsePage,
		input: "-",
		result: createParseError(0, "Expected a digit in base 10."),
	},
]);
