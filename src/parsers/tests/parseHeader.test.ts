import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseHeader } from "../parseHeader.js";

testExamples("parseHeader", [
	{
		name: "no match",
		parser: parseHeader,
		input: "-",
		result: createParseError(0, 'Expected string "# ".'),
	},
]);
