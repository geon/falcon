import { expect, suite, test } from "vitest";
import { indent } from "../indent";

suite("indent", () => {
	test("empty", () => {
		expect(indent("")).toBe("\t");
	});
	test("one line", () => {
		expect(indent("one line")).toBe("\tone line");
	});
	test("two\\nlines", () => {
		expect(indent("two\nlines")).toBe("\ttwo\n\tlines");
	});
});
