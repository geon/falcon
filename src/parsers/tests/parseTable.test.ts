import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseTable } from "../parseTable.js";

testExamples("parseTable", [
	{
		name: "no match",
		parser: parseTable,
		input: "-\n",
		result: createParseError(0, "Expected table."),
	},
	{
		name: "match",
		parser: parseTable,
		input: "a\tb\nc\td\n",
		result: createParseResult(7, [
			["a", "b"],
			["c", "d"],
		]),
	},
	{
		name: "match and stop",
		parser: parseTable,
		input: "a\tb\n\n",
		result: createParseResult(3, [["a", "b"]]),
	},
]);
