import { createParseResult, parsingFailed, type Parser } from "./Parser";

export function parseDependent<
	const A,
	const B extends (dependency: A) => Parser<unknown>,
>(parseDeterminant: Parser<A>, getNextParser: B): ReturnType<B> {
	return ((input, fromIndex) => {
		const parsedDeterminant = parseDeterminant(input, fromIndex);
		if (parsingFailed(parsedDeterminant)) {
			return parsedDeterminant;
		}

		const parsedNext = getNextParser(parsedDeterminant.parsed)(
			input,
			fromIndex + parsedDeterminant.consumed,
		);
		if (parsingFailed(parsedNext)) {
			return parsedNext;
		}

		return createParseResult(
			parsedDeterminant.consumed + parsedNext.consumed,
			parsedNext.parsed,
		);
	}) as ReturnType<B>;
}
