import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseDiceRollRow } from "../parseDicerollRow.js";

testExamples("parseDiceRollRow", [
	{
		name: "no match",
		parser: parseDiceRollRow,
		input: "-",
		result: createParseError(0, "Expected dice roll row."),
	},
	{
		name: "match",
		parser: parseDiceRollRow,
		input: "If you score 1-3, turn to 72\n",
		result: createParseResult(28, { scores: [1, 2, 3], link: 72 }),
	},
]);
