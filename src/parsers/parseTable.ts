import type { Parser } from "../parser-combinators/combinators/Parser.js";
import { parseError } from "../parser-combinators/combinators/parseError.js";
import { parseWithErrorMessage } from "../parser-combinators/combinators/parseWithErrorMessage.js";

export const parseTable: Parser<readonly (readonly string[])[]> =
	parseWithErrorMessage("Expected table.", parseError);
