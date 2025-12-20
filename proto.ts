import { Logger } from "./logging/index.ts"

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	while (true) {
		await ns.asleep(100)

		const max = ns.getServerMaxRam('home')
		const used = ns.getServerUsedRam('home')
		const cost = ns.getScriptRam('share.ts')
		const free = (max - 100) - used
		const threads = Math.floor(free / cost)

		if (threads <= 0) {
			continue
		}

		ns.run('share.ts', threads)
		logger.log(`Max: ${max}, Used: ${used}, Free: ${free}, Threads: ${threads}`)

		await ns.asleep(10000)
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

