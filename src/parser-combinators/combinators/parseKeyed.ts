import { indent } from "../../fp/indent.js";
import {
	createParseError,
	createParseResult,
	parsingFailed,
	type ParseError,
	type Parser,
} from "./Parser.js";

type KeyedParsers = Record<string, Parser<unknown>>;

type KeyedResult<TParsers extends KeyedParsers> = {
	[Key in keyof TParsers]: {
		readonly type: Key;
		readonly value: TParsers[Key] extends Parser<infer P> ? P : never;
	};
}[keyof TParsers];

export function parseKeyed<TParsers extends KeyedParsers>(
	parsers: TParsers,
): Parser<KeyedResult<TParsers>> {
	return (...args) => {
		const errors: ParseError[] = [];

		for (const [key, parser] of Object.entries(parsers)) {
			const parsed = parser(...args);
			if (!parsingFailed(parsed)) {
				return createParseResult(parsed.consumed, {
					type: key,
					value: parsed.parsed,
				} as KeyedResult<TParsers>);
			}

			errors.push(parsed);
		}

		return createParseError(
			args[1],

			[
				"No alternative matched.",
				...errors.map((fail, index) =>
					indent(`${Object.keys(parsers)[index]}: ${fail.message}`),
				),
			].join("\n"),
		);
	};
}
