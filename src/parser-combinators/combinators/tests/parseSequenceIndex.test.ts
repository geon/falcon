import { suite, test, expect } from "vitest";
import { parseChar } from "../parseChar.js";
import { parseSequenceIndex } from "../parseSequenceIndex.js";
import { testExamples } from "./testExamples.js";
import { createParseResult } from "../Parser.js";

suite("parseSequenceIndex", () => {
	test("out of bounds", () => {
		expect(() => parseSequenceIndex(1, [])).toThrow();
	});
});

testExamples("parseSequenceIndex", [
	{
		name: "match second",
		parser: parseSequenceIndex(1, [parseChar("a"), parseChar("b")]),
		input: "abc",
		result: createParseResult(2, "b"),
	},
]);
