import { Logger } from "./logging/index.ts"

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

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

