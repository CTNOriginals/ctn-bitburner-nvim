import { Logger } from "./logging/index.ts"
import * as Worm from './hack/worm.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	let first = true

	await Worm.ServerWorm(ns, 'home', (server) => {
		const ls = ns.ls(server.hostname, '.cct')

		if (ls.length == 0) {
			return
		}

		logger.log(`---- ${server.hostname} ----`)
		logger.log(ls.join('\n'))

		// ns.scp(ls, 'home', server.hostname)
		// for (const file of ls) {
		// 	ns.rm(file, server.hostname)
		// }

		logger.log(`---- ----\n\n`)
	}, false, false, true)

	for (const file of ns.ls('home', '.cct')) {
		ns.mv('home', file, 'contracts/' + file)
	}
}

type TTestScript = RunningScript | RecentScript | null
function getTestScript(ns: NS): TTestScript {
	let testScript: TTestScript = null
	for (const script of ns.ps()) {
		if (!script.args.includes('--watch')) {
			continue
		}

		return ns.getRunningScript(script.pid)!
	}

	for (const script of ns.getRecentScripts().reverse()) {
		if (!script.args.includes('--watch')) {
			continue
		}
		return script
	}

	return null
}

