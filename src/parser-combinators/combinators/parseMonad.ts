import {
	createParseError,
	createParseResult,
	parsingFailed,
	type Parser,
} from "./Parser.js";

type TransformError = {
	readonly type: "monad error";
	readonly message: string;
};

type TransformSuccess<T> = {
	readonly type: "result";
	readonly value: T;
};

type TransformResult<T> = TransformSuccess<T> | TransformError;

function result<T2>(value: T2): TransformSuccess<T2> {
	return {
		type: "result",
		value,
	};
}

function error(message: string): TransformError {
	return {
		type: "monad error",
		message,
	};
}

export function parseMonad<T, T2>(
	parser: Parser<T>,
	transform: (
		parsed: T,
		constructors: {
			readonly result: <T2>(value: T2) => TransformSuccess<T2>;
			readonly error: (message: string) => TransformError;
		},
	) => TransformResult<T2>,
): Parser<T2> {
	return (input, fromIndex) => {
		const parsed = parser(input, fromIndex);
		if (parsingFailed(parsed)) {
			return parsed;
		}

		const transformed = transform(parsed.parsed, { result, error });
		if (transformed.type === "result") {
			return createParseResult(parsed.consumed, transformed.value);
		}

		return createParseError(fromIndex, transformed.message);
	};
}
