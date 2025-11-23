import { parseAlpha } from "../../parser-combinators/combinators/parseAlpha.js";
import { parseChar } from "../../parser-combinators/combinators/parseChar.js";
import { createParseResult } from "../../parser-combinators/combinators/Parser.js";
import { testExamples } from "../../parser-combinators/combinators/tests/testExamples.js";
import { parseWithSeparator } from "../parseWithSeparator.js";

testExamples("parseWithSeparator", [
	{
		name: "no match",
		parser: parseWithSeparator(parseAlpha, parseChar(",")),
		input: "-",
		result: createParseResult(0, []),
	},
	{
		name: "match",
		parser: parseWithSeparator(parseAlpha, parseChar(",")),
		input: "a,b,c",
		result: createParseResult(5, ["a", "b", "c"]),
	},
]);
