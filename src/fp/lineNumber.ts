export function getLineBeginIndex(input: string, fromIndex: number) {
	if (fromIndex === 0) {
		return 0;
	}

	const lastIndex = input.lastIndexOf("\n", fromIndex - 1);

	return lastIndex + 1;
}

export function getLineEndIndex(input: string, fromIndex: number) {
	const index = input.indexOf("\n", fromIndex);
	if (index === -1) {
		return undefined;
	}

	return index;
}

export function countOccurenceOfChar(
	char: string,
	input: string,
	toIndex: number,
): number {
	return input.slice(0, toIndex).split(char).length - 1;
}

export function getLineCol(input: string, fromIndex: number) {
	const lineBeginIndex = getLineBeginIndex(input, fromIndex);
	const lineEndIndex = getLineEndIndex(input, fromIndex);
	const columnNumber = fromIndex - lineBeginIndex + 1;
	const lineNumber = countOccurenceOfChar("\n", input, fromIndex) + 1;
	return { lineBeginIndex, lineEndIndex, columnNumber, lineNumber };
}
