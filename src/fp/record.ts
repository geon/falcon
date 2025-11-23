export function mapRecord<TKey extends string, TIn, TOut>(
	record: Readonly<Record<TKey, TIn>>,
	transform: (value: TIn, key: TKey) => TOut,
): Record<TKey, TOut> {
	return Object.fromEntries(
		Object.entries(record).map(([key, value]) => [
			key,
			transform(value as TIn, key as TKey),
		]),
	) as Readonly<Record<TKey, TOut>>;
}

// https://stackoverflow.com/questions/69019873/how-can-i-get-typed-object-entries-and-object-fromentries-in-typescript
export function objectFromEntries<
	const T extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(entries: T): { [K in T[number] as K[0]]: K[1] } {
	return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
}
