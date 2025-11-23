const indentChar = "\t";
const newlineChar = "\n";

export function indent(text: string): string {
	return text
		.split(newlineChar)
		.map((line) => indentChar + line)
		.join(newlineChar);
}
