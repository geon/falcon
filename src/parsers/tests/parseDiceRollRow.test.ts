import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseDiceRollRow } from "../parseDicerollRow.js";

testExamples("parseDiceRollRow", [
	{
		name: "no match",
		parser: parseDiceRollRow,
		input: "-",
		result: createParseError(0, "Expected dice roll row."),
	},
]);
