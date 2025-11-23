import { parseAnyCharBut } from "../parser-combinators/combinators/parseAnyCharBut.js";
import { parseDigit } from "../parser-combinators/combinators/parseDigit.js";
import { parseMonad } from "../parser-combinators/combinators/parseMonad.js";
import { parseNewline } from "../parser-combinators/combinators/parseNewline.js";
import {
	createParseResult,
	type Parser,
	type ParseResult,
} from "../parser-combinators/combinators/Parser.js";
import { parseSequenceIndex } from "../parser-combinators/combinators/parseSequenceIndex.js";
import { parseOneOrMore } from "../parser-combinators/combinators/parseSome.js";
import { parseString } from "../parser-combinators/combinators/parseString.js";

const parseNumber = parseMonad(
	parseOneOrMore(parseDigit(10)),
	(parsed, { result }) => result(parseInt(parsed.join(""))),
);

const parseTurnInstruction = parseSequenceIndex(1, [
	parseString("Turn to "),
	parseNumber,
]);

interface Option {
	readonly choice: string;
	readonly link: number;
}

const newline = "\n";
export const parseChoices: Parser<readonly Option[]> = (
	input,
	fromIndex,
): ParseResult<readonly Option[]> => {
	let consumed = 0;
	let choices: string[] = [];
	let options: Option[] = [];

	for (;;) {
		const parsed = parseSequenceIndex(0, [parseUntil(newline), parseNewline])(
			input,
			fromIndex + consumed,
		);
		if (parsed.type === "error") {
			return parsed;
		}
		consumed += parsed.consumed;
		choices.push(parsed.parsed);

		if (parseTurnInstruction(input, fromIndex + consumed).type !== "error") {
			break;
		}
	}

	for (const choice of choices) {
		const parsed = parseSequenceIndex(0, [parseTurnInstruction, parseNewline])(
			input,
			fromIndex + consumed,
		);
		if (parsed.type === "error") {
			return parsed;
		}

		consumed += parsed.consumed;

		options.push({
			choice,
			link: parsed.parsed,
		});
	}

	return createParseResult(consumed, options);
};

function parseUntil(endChar: string): Parser<string> {
	return parseMonad(
		parseOneOrMore(parseAnyCharBut(endChar)),
		(parsed, { result }) => result(parsed.join("")),
	);
}
