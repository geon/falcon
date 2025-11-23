import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseChoices } from "../parseChoices.js";

testExamples("parseChoices", [
	{
		name: "no match",
		parser: parseChoices,
		input: "-",
		result: createParseError(1, "Expected newline."),
	},
	{
		name: "match",
		parser: parseChoices,
		input:
			"Duck into a doorway and wait to confront him at close quarters?\nSlip through the Intelfax warehouse and lose your pursuer in the lowlife area, Old Geneva?\nBlast him?\nTurn to 3\nTurn to 10\nTurn to 29\n",
		result: createParseResult(198, [
			{
				choice:
					"Duck into a doorway and wait to confront him at close quarters?",
				link: 3,
			},
			{
				choice:
					"Slip through the Intelfax warehouse and lose your pursuer in the lowlife area, Old Geneva?",
				link: 10,
			},
			{ choice: "Blast him?", link: 29 },
		]),
	},
]);
