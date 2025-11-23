import { parseWithErrorMessage } from "../parser-combinators/combinators/parseWithErrorMessage.js";
import { parseError } from "../parser-combinators/combinators/parseError.js";

export interface DiceRollRow {
	readonly scores: readonly number[];
	readonly link: number | undefined;
}

export const parseDiceRollRow = parseWithErrorMessage(
	"Expected dice roll row.",
	parseError,
);
