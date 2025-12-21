import { Logger } from "../../logging/index.ts"
import { getAllImportPaths } from "./tmp.ts"

type TScriptMap = { [pid: number]: RunningScript }


export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.clearLog()
	const logger = new Logger(ns)

	const updateInterval = 1000

	while (true) {
		await ns.sleep(updateInterval)
		const ScriptMap = getWatchMap(ns)

		for (const pid in ScriptMap) {
			const script = ScriptMap[pid]

			const pathList: string[] = [script.filename]
			pathList.push(...getAllImportPaths(ns, script.filename))

			for (const path of pathList) {
				const modTime = ns.getFileMetadata(path).mtime
				// logger.log(`${path}: ${modTime}`)

				if (script.startTime < modTime) {
					restartScript(ns, script)
					break
				}
			}
			// logger.log('\n')
		}
	}
}

function getWatchMap(ns: NS): TScriptMap {
	const WatchMap: TScriptMap = {}
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

	return WatchMap
}

function restartScript(ns: NS, script: RunningScript) {
	ns.print(`Restarting script: ${script.pid} ${script.filename} ${script.args}`)

	if (ns.isRunning(script.pid)) {
		if (script.pid == ns.pid) {
			restartSelf(ns, script)
			return
		}

		ns.kill(script.pid)
	}

	const pid = ns.run(script.filename, undefined, ...script.args)
	if (pid == 0) {
		ns.print(`Failed to run script: ${script.filename} ${script.args}`)
		return
	}

	if (script.tailProperties === null) {
		return
	}

	ns.ui.closeTail(script.pid)
	ns.ui.openTail(pid)
	ns.ui.resizeTail(script.tailProperties.width, script.tailProperties.height, pid)
	ns.ui.moveTail(script.tailProperties.x, script.tailProperties.y, pid)
}

//! Will spawn multiple if the watchers tail window is open
function restartSelf(ns: NS, script: RunningScript) {
	ns.tprint(`Killing self: ${ns.pid} ${script.filename} ${script.args}`)
	// if (script.tailProperties === null) {
	// 	// script.args.push('--tail')
	// 	// ns.ui.closeTail()
	// }

	ns.spawn(script.filename, { spawnDelay: 0, preventDuplicates: true }, ...script.args)
}


