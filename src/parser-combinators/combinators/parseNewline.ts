import { parseChar } from "./parseChar.js";
import { parseWithErrorMessage } from "./parseWithErrorMessage.js";

export const parseNewline = parseWithErrorMessage(
	"Expected newline.",
	parseChar("\n"),
);
