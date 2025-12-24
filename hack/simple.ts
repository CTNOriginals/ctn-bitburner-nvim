import { Logger } from "../logging/index.ts"

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	if (!ns.args.includes('--host')) {
		ns.tprint('hack/simple.ts requires "--host <host name>"')
		return
	}

	const host = ns.args[ns.args.indexOf('--host') + 1] as string

	// await ns.asleep(100)
	const instFile = 'hack/simpleInst.ts'
	logger.log('kill: ', ns.kill(instFile, host, host))
	logger.log('scp: ', ns.scp(instFile, host))

	const max = ns.getServerMaxRam(host)
	const used = ns.getServerUsedRam(host)
	const cost = ns.getScriptRam(instFile)
	const free = (max) - used
	const threads = Math.floor(free / cost)

	if (threads <= 0) {
		return
	}

	const pid = ns.exec(instFile, host, threads, host)
	// logger.log(`Max: ${max}, Used: ${used}, Free: ${free}, Threads: ${threads}`)
	logger.log(`max :____${ns.getServerMaxRam(host)}`)
	logger.log(`used:____${ns.getServerUsedRam(host)}`)
	logger.log(`cost:____${ns.getScriptRam(instFile)}`)
	logger.log(`free:____${(max) - used}`)
	logger.log(`threads:_${Math.floor(free / cost)}`)

	// ns.atExit(() => {
	// 	ns.kill(pid)
	// })

	// while (true) {
	// 	await ns.asleep(10000)
	// }
}
