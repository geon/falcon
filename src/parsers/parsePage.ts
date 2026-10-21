import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseSequence } from "../parser-combinators/combinators/parseSequence.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseNewline } from "../parser-combinators/combinators/parseNewline.js";
import { parseLookahead } from "../parser-combinators/combinators/parseLookahead.js";
import { parseOptional } from "../parser-combinators/combinators/parseOptional.js";
import { parseScore } from "./parseScore.js";
import type { FailPage } from "../page.js";
import type { ScoreSection } from "../section.js";
import { parseKeyed } from "../parser-combinators/combinators/parseKeyed.js";
import { parseTable } from "./parseTable.js";
import { parseDiceRoll } from "./parseDiceRoll.js";
import { parseChoices } from "./parseChoices.js";

const parseNumber = parseMonad(
	parseOneOrMore(parseDigit(10)),
	(parsed, { result }) => result(parseInt(parsed.join(""))),
);

const parsePageNumber = parseSequenceIndex(0, [parseNumber, parseNewline]);

export const parsePage = parseMonad(
	parseSequence([
		parsePageNumber,
		parseOptional(
			parseSequenceIndex(0, [
				parseMonad(parseScore, (letter, { result }) =>
					result<ScoreSection>({ type: "score" as const, letter }),
				),
				parseNewline,
			]),
		),
		parseOptional(
			parseSequenceIndex(0, [
				parseKeyed({
					table: parseTable,
					diceRoll: parseDiceRoll,
					choices: parseChoices,
				}),
				parseNewline,
			]),
		),
		parseNewline,
		parseLookahead(parsePageNumber),
	]),
	([pageNumber, scoreSection, tableSection], { result }) =>
		result<FailPage>({
			type: "FailPage",
			pageNumber,
			sections: [
				...(scoreSection === undefined ? [] : [scoreSection]),
				...(tableSection === undefined
					? []
					: [{ type: tableSection.type, rows: tableSection.value }]),
			],
		}),
);
