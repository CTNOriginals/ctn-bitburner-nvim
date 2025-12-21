//#region source: https://github.com/uhyo/ts-array-length/blob/main/src/types.ts
type IsCertainlyIntegerImpl<Str extends string> =
	Str extends `${infer _}.${infer _}`
	? false
	: Str extends `-${infer _}`
	? false
	: Str extends "Infinity" | "-Infinity" | "NaN"
	? false
	: true;

type IsCertainlyInteger<N extends number> =
	IsCertainlyIntegerImpl<`${N}`>;

type ReadonlyArrayExactLengthRec<
	T,
	L extends number,
	Result extends readonly T[],
> = Result["length"] extends L
	? Result
	: ReadonlyArrayExactLengthRec<T, L, readonly [T, ...Result]>;

export type ReadonlyArrayExactLength<T, N extends number> = N extends number
	? number extends N
	? readonly T[]
	: IsCertainlyInteger<N> extends true
	? ReadonlyArrayExactLengthRec<T, N, readonly []>
	: readonly T[]
	: never;
//#endregion

