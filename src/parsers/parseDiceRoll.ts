import { parseWithSeparator } from "./parseWithSeparator.js";
import { parseNewline } from "../parser-combinators/combinators/parseNewline.js";
import { parseDiceRollRow } from "./parseDicerollRow.js";

export const parseDiceRoll = parseWithSeparator(parseDiceRollRow, parseNewline);
