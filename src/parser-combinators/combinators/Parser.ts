export type ParseResult<T> =
	| {
			readonly type: "result";
			readonly consumed: number;
			readonly parsed: T;
	  }
	| {
			readonly type: "error";
			readonly fromIndex: number;
			readonly message: string;
	  };

export type ParseError = Extract<ParseResult<unknown>, { type: "error" }>;

export function createParseResult<T>(
	consumed: number,
	parsed: T,
): Extract<ParseResult<T>, { type: "result" }> {
	return { type: "result", consumed, parsed };
}

export function createParseError(
	fromIndex: number,
	message: string,
): ParseError {
	return { type: "error", fromIndex, message };
}

export type ParserArgs = readonly [input: string, fromIndex: number];

export type Parser<T> = (...args: ParserArgs) => ParseResult<T>;

export function parsingFailed(
	parseResult: ParseResult<unknown>,
): parseResult is ParseError {
	return parseResult.type === "error";
}
