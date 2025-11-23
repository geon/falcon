import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseDiceRoll } from "../parseDiceRoll.js";

testExamples("parseDiceRoll", [
	{
		name: "no match",
		parser: parseDiceRoll,
		input: "-",
		result: createParseError(0, "Expected dice roll row."),
	},
	{
		name: "match",
		parser: parseDiceRoll,
		input: "If you score 1-3, turn to 72\nIf you score 4-6, turn to 91\n",
		result: createParseResult(58, [
			{ scores: [1, 2, 3], link: 72 },
			{ scores: [4, 5, 6], link: 91 },
		]),
	},
]);
