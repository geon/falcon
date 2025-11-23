import {
	createParseError,
	createParseResult,
} from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseIllustration } from "../parsellustration.js";

testExamples("parseIllustration", [
	{
		name: "no match",
		parser: parseIllustration,
		input: "-",
		result: createParseError(0, 'Expected string "image-".'),
	},
	{
		name: "match",
		parser: parseIllustration,
		input: "image-001.png",
		result: createParseResult(13, "image-001.png"),
	},
]);
