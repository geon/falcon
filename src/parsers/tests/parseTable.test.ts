import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseTable } from "../parseTable.js";

testExamples("parseTable", [
	{
		name: "no match",
		parser: parseTable,
		input: "-",
		result: createParseError(0, "Expected table."),
	},
]);
