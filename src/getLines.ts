export function* getLines(string: string) {
	const lines = string.split("\n");
	for (const line of lines) {
		yield line;
	}
}
