import { suite, test, expect } from "vitest";
import { parseChar, parseCharCaseInsensitive } from "../parseChar.js";
import { testExamples } from "./testExamples.js";
import { createParseError, createParseResult } from "../Parser.js";

suite("parseChar", () => {
	test("too long", () => {
		expect(() => parseChar("too long")).toThrow();
		expect(() => parseCharCaseInsensitive("too long")).toThrow();
	});
});

testExamples("parseChar", [
	{
		name: "no match",
		parser: parseChar("b"),
		input: "abc",
		result: createParseError(0, 'Expected char "b".'),
	},
	{
		name: "match",
		parser: parseChar("a"),
		input: "abc",
		result: createParseResult(1, "a"),
	},
	{
		name: "no match case insensitive",
		parser: parseCharCaseInsensitive("b"),
		input: "abc",
		result: createParseError(0, 'Expected char "b".'),
	},
	{
		name: "match case insensitive",
		parser: parseCharCaseInsensitive("A"),
		input: "abc",
		result: createParseResult(1, "A"),
	},
]);
