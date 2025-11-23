import { parseKeyed } from "../parseKeyed.js";
import { testExamples } from "./testExamples.js";
import { parseChar } from "../parseChar.js";
import { createParseError, createParseResult } from "../Parser.js";

const parseA = parseChar("a");
const parseB = parseChar("b");

testExamples<unknown>("parseKeyed", [
	{
		name: "empty",
		parser: parseKeyed({}),
		input: "abc",
		result: createParseError(0, "No alternative matched."),
	},
	{
		name: "no match",
		parser: parseKeyed({ parseA }),
		input: "",
		result: createParseError(
			0,
			"No alternative matched.\n\tparseA: Unexpectedly reached end of file.",
		),
	},
	{
		name: "match first",
		parser: parseKeyed({ parseA, parseB }),
		input: "a",
		result: createParseResult(1, { type: "parseA", value: "a" }),
	},
	{
		name: "match second",
		parser: parseKeyed({ parseA, parseB }),
		input: "b",
		result: createParseResult(1, { type: "parseB", value: "b" }),
	},
]);
