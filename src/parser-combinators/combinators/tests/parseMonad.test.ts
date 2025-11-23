import { parseAnyChar } from "../parseAnyChar.js";
import { parseError } from "../parseError.js";
import { parseMonad } from "../parseMonad.js";
import { createParseError, createParseResult } from "../Parser.js";
import { testExamples } from "./testExamples.js";

testExamples("parseMonad", [
	{
		name: "no match",
		parser: parseMonad(parseError, (_, { result }) => result("")),
		input: "",
		result: createParseError(0, "forced error"),
	},
	{
		name: "match",
		parser: parseMonad(parseAnyChar, (parsed, { result }) =>
			result(parsed.toUpperCase()),
		),
		input: "abc",
		result: createParseResult(1, "A"),
	},
	{
		name: "refused",
		parser: parseMonad(parseAnyChar, (_, { error }) => error("custom error")),
		input: "abc",
		result: createParseError(0, "custom error"),
	},
]);
