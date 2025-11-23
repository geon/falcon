import { parseAlternatives } from "../parser-combinators/combinators/parseAlternatives.js";
import { parseChar } from "../parser-combinators/combinators/parseChar.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";
import { parseNewline } from "../parser-combinators/combinators/parseNewline.js";
import { type Parser } from "../parser-combinators/combinators/Parser.js";
import { parseWithErrorMessage } from "../parser-combinators/combinators/parseWithErrorMessage.js";
import { parseTextUntil } from "./parseTextUntil.js";
import { parseWithSeparator } from "./parseWithSeparator.js";

const tab = "\t";
export const parseTable: Parser<readonly (readonly string[])[]> =
	parseWithErrorMessage(
		"Expected table.",
		parseWithSeparator(
			parseWithSeparator(
				parseTextUntil(
					parseAlternatives([parseChar(tab), parseNewline, parseEol]),
				),
				parseChar(tab),
			),
			parseAlternatives([parseNewline, parseEol]),
		),
	);
