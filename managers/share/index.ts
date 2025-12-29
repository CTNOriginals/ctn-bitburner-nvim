import { Logger } from "../../logging/index.ts"

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	// await ns.asleep(100)
	const instFile = 'managers/share/shareInst.ts'
	const host = ns.getHostname()

	const max = ns.getServerMaxRam(host)
	const used = ns.getServerUsedRam(host)
	const cost = ns.getScriptRam(instFile)
	const free = (max - 100) - used
	const threads = Math.floor(free / cost)

	if (threads <= 0) {
		return
	}

	const pid = ns.run(instFile, threads)
	logger.log(`Max: ${max}, Used: ${used}, Free: ${free}, Threads: ${threads}`)
	ns.atExit(() => {
		ns.kill(pid)
	})

	while (true) {
		await ns.asleep(10000)
	}
}
