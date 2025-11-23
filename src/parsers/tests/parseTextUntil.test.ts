import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { parseString } from "../../parser-combinators/combinators/parseString.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseTextUntil } from "../parseTextUntil.js";

testExamples("parseTextUntil", [
	{
		name: "no match",
		parser: parseTextUntil(parseString("end")),
		input: "-",
		result: createParseError(0, "Expected endParser to match eventually."),
	},
	{
		name: "match",
		parser: parseTextUntil(parseString("end")),
		input: "the end",
		result: createParseResult(4, "the "),
	},
]);
