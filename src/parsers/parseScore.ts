import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseAlpha } from "../parser-combinators/combinators/parseAlpha.js";
import { parseChar } from "../parser-combinators/combinators/parseChar.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";

export const parseScore = parseSequenceIndex(1, [
	parseString("[score a "),
	parseAlpha,
	parseChar("]"),
	parseEol,
]);
