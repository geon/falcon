import { suite, test, expect } from "vitest";
import {
	countOccurenceOfChar,
	getLineBeginIndex,
	getLineCol,
	getLineEndIndex,
} from "../lineNumber";

suite("lineNumber", () => {
	suite("getLineBeginIndex", () => {
		test("empty", () => {
			expect(getLineBeginIndex("", 0)).toBe(0);
		});

		test("after newline", () => {
			expect(getLineBeginIndex("\n\n\n", 1)).toBe(1);
		});

		test("before newline", () => {
			expect(getLineBeginIndex("\n\n\n", 0)).toBe(0);
		});
	});

	suite("getLineEndIndex", () => {
		test("empty", () => {
			expect(getLineEndIndex("", 0)).toBe(undefined);
		});

		test("newline", () => {
			expect(getLineEndIndex("\n", 0)).toBe(0);
		});
	});

	suite("countOccurenceOfChar", () => {
		test("empty", () => {
			expect(countOccurenceOfChar("o", "", 0)).toBe(0);
		});

		test("hello world", () => {
			expect(countOccurenceOfChar("o", "hello world", 2)).toBe(0);
		});
	});

	suite("getLineCol", () => {
		test("empty", () => {
			expect(getLineCol("", 0)).toStrictEqual({
				lineBeginIndex: 0,
				lineEndIndex: undefined,
				columnNumber: 1,
				lineNumber: 1,
			});
		});

		test("text after newlines", () => {
			expect(getLineCol("\n\ntext\n", 3)).toStrictEqual({
				lineBeginIndex: 2,
				lineEndIndex: 6,
				columnNumber: 2,
				lineNumber: 3,
			});
		});
	});
});
