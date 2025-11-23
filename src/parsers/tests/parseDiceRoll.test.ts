import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseDiceRoll } from "../parseDiceRoll.js";

testExamples("parseDiceRoll", [
	{
		name: "no match",
		parser: parseDiceRoll,
		input: "-",
		result: createParseError(0, "Expected dice roll row."),
	},
]);
