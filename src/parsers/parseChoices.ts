import { parseError } from "../parser-combinators/combinators/parseError.js";
import { parseWithErrorMessage } from "../parser-combinators/combinators/parseWithErrorMessage.js";

export const parseChoices = parseWithErrorMessage(
	"Expected choices.",
	parseError,
);
