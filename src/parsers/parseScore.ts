import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseChar } from "../parser-combinators/combinators/parseChar.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";
import { parseAlternatives } from "../parser-combinators/combinators/parseAlternatives.js";
import { scoreLetters } from "../score.js";

export const parseScore = parseSequenceIndex(1, [
	parseString("[score a "),
	parseAlternatives(scoreLetters.map(parseChar)),
	parseChar("]"),
	parseEol,
]);
