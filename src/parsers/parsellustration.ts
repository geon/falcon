import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";
import { parseSequence } from "../parser-combinators/combinators/parseSequence.js";

export const parseIllustration = parseMonad(
	parseSequence([
		parseString("image-"),
		parseOneOrMore(parseDigit(10)),
		parseString(".png"),
		parseEol,
	]),
	(parsed, { result }) => result(parsed.slice(0, -1).flat().join("")),
);
