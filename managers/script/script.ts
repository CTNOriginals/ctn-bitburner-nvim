import { Logger } from '../../logging/index.ts'

/** An object containing each pid of and their startup time code */
export const ProcessStartup: Map<number, number> = new Map<number, number>()

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	const updateInterval = 1000

	while (true) {
		await ns.asleep(updateInterval)

		for (const proc of ns.ps()) {
			const script = ns.getRunningScript(proc.pid)
			if (!script) {
				continue
			}
			validateScript(script)
		}

		for (const recent of ns.getRecentScripts()) {
			if (recent.timeOfDeath.getTime() < Date.now() - updateInterval + (updateInterval * 0.1)) {
				break
			}

			validateScript(recent)
		}
	}
}

function validateScript(script: RunningScript | RecentScript) {
	const pid = script.pid
	const now = Date.now()

	if (ProcessStartup.has(pid)) {
		return
	}

	let time = now

	if ('timeOfDeath' in script) {
		time -= now - script.timeOfDeath.getTime()
	}

	time -= (script.onlineRunningTime + script.offlineRunningTime) * 1000

	ProcessStartup.set(pid, time)
}
