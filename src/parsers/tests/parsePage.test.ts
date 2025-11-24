import type { FailPage } from "../../page.js";
import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parsePage } from "../parsePage.js";

testExamples("parsePage", [
	{
		name: "no match",
		parser: parsePage,
		input: "-",
		result: createParseError(0, "Expected a digit in base 10."),
	},
	{
		name: "match number",
		parser: parsePage,
		input: `123

124
`,
		result: createParseResult<FailPage>(5, {
			type: "FailPage",
			pageNumber: 123,
			sections: [],
		}),
	},
	{
		name: "match score",
		parser: parsePage,
		input: `123
[score a K]

124
`,
		result: createParseResult<FailPage>(17, {
			type: "FailPage",
			pageNumber: 123,
			sections: [
				{
					letter: "K",
					type: "score",
				},
			],
		}),
	},
]);
