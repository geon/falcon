import { parseAnyChar } from "./parseAnyChar.js";
import { parseMonad } from "./parseMonad.js";
import { parseOneOrMore } from "./parseSome.js";

const whitespaces = [" ", "\t"];

export const parseWhitespace = parseMonad(
	parseOneOrMore(
		parseMonad(parseAnyChar, (parsed, { error, result }) =>
			whitespaces.includes(parsed)
				? result(parsed)
				: error("Expected whitespace."),
		),
	),
	(parsed, { result }) => result(parsed.join("")),
);
