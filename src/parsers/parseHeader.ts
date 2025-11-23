import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseAnyCharBut } from "../parser-combinators/combinators/parseAnyCharBut.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import type { Parser } from "../parser-combinators/combinators/Parser.js";

const newline = "\n";

export const parseHeader = parseSequenceIndex(1, [
	parseString("# "),
	parseUntil(newline),
]);

function parseUntil(endChar: string): Parser<string> {
	return parseMonad(
		parseOneOrMore(parseAnyCharBut(endChar)),
		(parsed, { result }) => result(parsed.join("")),
	);
}
