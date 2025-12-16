type TScriptMap = { [pid: number]: RunningScript }

const updateInterval = 1000

interface IHasPid {
	pid: number,
	args: ScriptArg[]
}

export function main(ns: NS) {
	ns.disableLog('ALL')
	const WatchMap: TScriptMap = {}
	const scripts: IHasPid[] = [...ns.ps(), ...ns.getRecentScripts()]

	for (const ps of ns.ps()) {
		if (!ps.args.includes('--watch')) {
			continue
		}

		let script = ns.getRunningScript(ps.pid)
		if (!script) {
			continue
		}

		WatchMap[script.pid] = script
	}

	for (const recent of ns.getRecentScripts()) {
		if (
			!recent.args.includes('--watch')
			|| recent.tailProperties === null
		) {
			continue
		}

		WatchMap[recent.pid] = recent
	}

	for (const pid in WatchMap) {
		const script = WatchMap[pid]
		ns.print(`${pid}: ${script.filename} ${script.args} = ${script.tailProperties !== null}`)
	}
}

async function update(ns: NS) {
	// ns.getRecentScripts


}

