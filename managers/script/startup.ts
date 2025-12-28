import { Logger } from '../../logging/index.ts'

export type TStartupMap = Map<number, number>

let lastUpdate = 0
let ns: NS

export function Init(n: NS) {
	lastUpdate = 0
	ns = n
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

	map.set(pid, time)
}
