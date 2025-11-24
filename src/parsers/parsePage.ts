import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseSequence } from "../parser-combinators/combinators/parseSequence.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseNewline } from "../parser-combinators/combinators/parseNewline.js";
import { parseLookahead } from "../parser-combinators/combinators/parseLookahead.js";
import type { FailPage } from "../page.js";

const parseNumber = parseMonad(
	parseOneOrMore(parseDigit(10)),
	(parsed, { result }) => result(parseInt(parsed.join(""))),
);

const parsePageNumber = parseSequenceIndex(0, [parseNumber, parseNewline]);

export const parsePage = parseMonad(
	parseSequence([parsePageNumber, parseLookahead(parsePageNumber)]),
	([pageNumber], { result }) =>
		result<FailPage>({
			type: "FailPage",
			pageNumber,
			sections: [],
		}),
);
