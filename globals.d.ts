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

	type Logger = _Logger

	type ArrayN<T, N extends number> = _types.ReadonlyArrayExactLength<T, N>
}

