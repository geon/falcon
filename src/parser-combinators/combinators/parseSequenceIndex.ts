import { parseMonad } from "./parseMonad";
import type { Parser } from "./Parser";
import { type SequenceResults, parseSequence } from "./parseSequence";

export const parseSequenceIndex = <
	const ValueIndex extends number,
	const Parsers extends readonly Parser<unknown>[],
>(
	valueIndex: ValueIndex,
	parsers: Parsers,
): Parser<SequenceResults<Parsers>[ValueIndex]> => {
	if (valueIndex >= parsers.length) {
		throw new Error("valueIndex out of bounds");
	}

	return parseMonad(parseSequence(parsers), (parsed, { result }) =>
		result(parsed[valueIndex]),
	);
};
