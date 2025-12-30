import { Logger } from '../../logging/index.ts'

export type TStartupMap = Map<number, number>

let lastUpdate = 0
let ns: NS

export function Init(n: NS) {
	ns = n
	lastUpdate = 0
}

export async function UpdateStartupMap(map: TStartupMap) {
	for (const proc of ns.ps()) {
		const script = ns.getRunningScript(proc.pid)
		if (!script) {
			continue
		}

		validateScript(map, script)
	}

	for (const recent of ns.getRecentScripts()) {
		if (recent.timeOfDeath.getTime() < lastUpdate || recent.server !== ns.getHostname()) {
			break
		}

		validateScript(map, recent)
	}

	lastUpdate = Date.now()
}

function validateScript(map: TStartupMap, script: RunningScript | RecentScript) {
	const pid = script.pid
	const now = Date.now()

	if (map.has(pid)) {
		return
	}

	let time = now

	if ('timeOfDeath' in script) {
		time -= now - script.timeOfDeath.getTime()
	}

	time -= (script.onlineRunningTime + script.offlineRunningTime) * 1000

	ns.print(
		`Startup Script: ${pid} ${script.filename} ${script.args}: ${(now - time) / 1000}s`
	)

	map.set(pid, time)
}
