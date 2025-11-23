import { parseAlternatives } from "./parseAlternatives.js";
import { parseEof } from "./parseEof.js";
import { parseLookahead } from "./parseLookahead.js";
import { parseNewline } from "./parseNewline.js";

export const parseEol = parseAlternatives([
	parseLookahead(parseNewline),
	parseEof,
]);
