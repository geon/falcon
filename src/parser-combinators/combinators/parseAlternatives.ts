import { indent } from "../../fp/indent.js";
import {
	createParseError,
	parsingFailed,
	type ParseError,
	type Parser,
} from "./Parser.js";

export function parseAlternatives<TParsers extends readonly Parser<unknown>[]>(
	parsers: TParsers,
): Parser<Exclude<ReturnType<TParsers[number]>, ParseError>["parsed"]> {
	return (...args) => {
		const errors: ParseError[] = [];

		for (const parser of parsers) {
			const parsed = parser(...args);
			if (!parsingFailed(parsed)) {
				return parsed;
			}

			errors.push(parsed);
		}

		return createParseError(
			args[1],
			[
				"No alternative matched.",
				...errors.map((fail) => indent(fail.message)),
			].join("\n"),
		);
	};
}
