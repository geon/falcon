import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";

export const parseIllustration = parseSequenceIndex(1, [
	parseString("image-"),
	parseMonad(parseOneOrMore(parseDigit(10)), (parsed, { result }) =>
		result(parsed.join("")),
	),
	parseString(".png"),
	parseEol,
]);
