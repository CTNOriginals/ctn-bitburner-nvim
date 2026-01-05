import type * as NSD from './NetscriptDefinitions';

import { Logger as _Logger } from './logging';
import * as _types from './types/index.ts'

declare global {
	type NS = NSD.NS
	type ProcessInfo = NSD.ProcessInfo
	type RunningScript = NSD.RunningScript
	type RecentScript = NSD.RecentScript
	type ScriptArg = NSD.ScriptArg
	type FileMetadata = NSD.FileMetadata
	type SpawnOptions = NSD.SpawnOptions
	type Server = NSD.Server

	type GoOpponent = NSD.GoOpponent

	type CodingContractNameEnumType = NSD.CodingContractNameEnumType
	type CodingContractName = NSD.CodingContractName
	type CodingContractObject = NSD.CodingContractObject

	type Logger = _Logger

	type ArrayN<T, N extends number> = _types.ReadonlyArrayExactLength<T, N>

	type MethodsOf<T> = {
		[K in keyof T]: T[K] extends Function ? K : never;
	}[keyof T];

	type MethodParams<T, M extends MethodsOf<T>> =
		T[M] extends (...args: infer P) => any ? P : never;

	type MethodReturn<T, M extends MethodsOf<T>> =
		T[M] extends (...args: any[]) => infer R ? R : never;
}

