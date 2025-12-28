import { Logger } from '../../logging/index.ts'
import * as Startup from './startup.ts'

/** An object containing each pid of and their startup time code */
export const ProcessStartup: Startup.TStartupMap = new Map<number, number>()

let ns: NS

export async function main(n: NS) {
	ns = n
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	Startup.Init(ns)

	const updateInterval = 1000

	while (true) {
		Startup.UpdateStartupMap(ProcessStartup)
		await ns.asleep(updateInterval)
	}
}

export function GetScriptByPID(pid: number): (RunningScript | RecentScript) | null {
	for (const ps of ns.ps()) {
		if (ps.pid == pid) {
			return ns.getRunningScript(pid)
		}
	}

	for (const recent of ns.getRecentScripts()) {
		if (recent.pid == pid) {
			return recent
		}
	}

	return null
}

export function GetStartupEntriesByFile(file: string): typeof ProcessStartup {
	const entries: ReturnType<typeof GetStartupEntriesByFile> = new Map()

	for (const [pid, time] of ProcessStartup.entries()) {
		const script = GetScriptByPID(pid)

		if (!script) {
			continue
		}

		if (script.filename == file) {
			entries.set(pid, time)
		}
	}

	return entries
}
