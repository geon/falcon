import { createParseError } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseIllustration } from "../parsellustration.js";

testExamples("parseIllustration", [
	{
		name: "no match",
		parser: parseIllustration,
		input: "-",
		result: createParseError(0, 'Expected string "image-".'),
	},
]);
