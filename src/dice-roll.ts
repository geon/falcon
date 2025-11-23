const diceRollSubtypes = [
	"Thinkstrike" as const,
	"Power of Will" as const,
	"Attack" as const,
	"Evasion" as const,
	"Chance" as const,
];

export type DiceRollSubtype = (typeof diceRollSubtypes)[0];
function isDiceRollSubtype(
	potentiallySubtype: string,
): potentiallySubtype is DiceRollSubtype {
	return diceRollSubtypes.includes(potentiallySubtype as DiceRollSubtype);
}
export function makeDiceRollSubtype(
	potentiallySubtype: string,
): DiceRollSubtype {
	if (!isDiceRollSubtype(potentiallySubtype)) {
		throw new Error("Not a DiceRollSubtype: " + potentiallySubtype);
	}
	return potentiallySubtype as DiceRollSubtype;
}
