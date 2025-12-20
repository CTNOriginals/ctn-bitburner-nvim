import { Logger as _Logger } from './logging';
import type * as NSD from './NetscriptDefinitions';


declare global {
	type NS = NSD.NS
	type ProcessInfo = NSD.ProcessInfo
	type RunningScript = NSD.RunningScript
	type RecentScript = NSD.RecentScript
	type ScriptArg = NSD.ScriptArg
	type FileMetadata = NSD.FileMetadata
	type SpawnOptions = NSD.SpawnOptions

	type Logger = _Logger
}

