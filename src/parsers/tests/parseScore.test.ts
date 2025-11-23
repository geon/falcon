import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseScore } from "../parseScore.js";

testExamples("parseScore", [
	{
		name: "no match",
		parser: parseScore,
		input: "-",
		result: createParseError(0, 'Expected string "[score a ".'),
	},
	{
		name: "match",
		parser: parseScore,
		input: "[score a K]\n",
		result: createParseResult(11, "K"),
	},
]);
