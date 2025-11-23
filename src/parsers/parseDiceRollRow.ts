import { parseWithErrorMessage } from "../parser-combinators/combinators/parseWithErrorMessage.js";
import { parseSequence } from "../parser-combinators/combinators/parseSequence.js";
import { parseEol } from "../parser-combinators/combinators/parseEol.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";
import { parseOptional } from "../parser-combinators/combinators/parseOptional.js";
import { parseChar } from "../parser-combinators/combinators/parseChar.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";

const parseNumber = parseMonad(
	parseOneOrMore(parseDigit(10)),
	(parsed, { result }) => result(parseInt(parsed.join(""))),
);

export interface DiceRollRow {
	readonly scores: readonly number[];
	readonly link: number | undefined;
}

export const parseDiceRollRow = parseWithErrorMessage(
	"Expected dice roll row.",
	parseMonad(
		parseSequence([
			parseString("If you score"),
			parseOptional(parseChar("d")),
			parseChar(" "),
			parseMonad(
				parseSequence([parseNumber, parseChar("-"), parseNumber]),
				([from, , to], { result }) => result({ from, to }),
			),
			parseString(", turn to "),
			parseNumber,
			parseEol,
		]),
		([, , , dice, , link], { result }) =>
			result<DiceRollRow>({
				scores: Array(dice.to - dice.from + 1)
					.fill(0)
					.map((_, i) => dice.from + i),
				link,
			}),
	),
);
