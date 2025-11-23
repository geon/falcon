import { parseLineNumber } from "../parseLineNumber.js";
import { createParseResult } from "../Parser.js";
import { parseSequence } from "../parseSequence.js";
import { parseString } from "../parseString.js";
import { testExamples } from "./testExamples.js";

testExamples<any>("parseLineNumber", [
	{
		name: "text",
		parser: parseSequence([
			parseLineNumber,
			parseString("0123"),
			parseLineNumber,
			parseString("\n"),
			parseLineNumber,
			parseString("abcd"),
			parseLineNumber,
		]),
		fromIndex: 0,
		input: "0123\nabcd\n",
		result: createParseResult(9, [
			{
				columnNumber: 1,
				lineNumber: 1,
				lineBeginIndex: 0,
				lineEndIndex: 4,
			},
			"0123",
			{
				columnNumber: 5,
				lineNumber: 1,
				lineBeginIndex: 0,
				lineEndIndex: 4,
			},
			"\n",
			{
				columnNumber: 1,
				lineNumber: 2,
				lineBeginIndex: 5,
				lineEndIndex: 9,
			},
			"abcd",
			{
				columnNumber: 5,
				lineNumber: 2,
				lineBeginIndex: 5,
				lineEndIndex: 9,
			},
		]),
	},
]);
