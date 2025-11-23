import { Section } from "./section";

export const scoreLetters = [
	"B" as const,
	"C" as const,
	"D" as const,
	"G" as const,
	"K" as const,
	"T" as const,
	"Q" as const,
];

export type ScoreLetter = (typeof scoreLetters)[0];

export function parseScores(sections: Section[]): Section[] {
	const regExpString = "\\[score a ([" + scoreLetters.join("") + "])\\]";
	const regExp = new RegExp(regExpString);
	return sections.map((section) => {
		if (section.type === "text") {
			const match = section.line.match(regExp);
			if (match) {
				return { type: "score", letter: match[1] as ScoreLetter };
			}
		}

		return section;
	});
}
