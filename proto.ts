import { Logger } from './logging/index.ts'
import * as Worm from './hack/worm.ts'
import * as Data from './managers/contract/data.ts'

let ns: NS
export async function main(n: NS) {
	ns = n
	ns.disableLog('ALL')
	ns.clearLog()
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	// await Worm.ServerWorm(ns, 'home', (server: Server) => {
	// 	const files = ns.ls(server.hostname, '.cct')
	// 	log(`${server.hostname}: ${files}`)
	// }, false, false, false)

	// log(`${ns.getServerMaxMoney(host)} > ${ns.getServerMoneyAvailable(host)}`)
	// if (ns.getServerMaxMoney(host) == ns.getServerMoneyAvailable(host)) {
	// 	ns.exec('/hack/batcher/scripts/hack.ts', 'home', { threads: 50 }, host)
	// 	const time = ns.getHackTime(host)
	// 	log(ns.format.time(time))
	// 	await ns.sleep(time + 10)
	// }

	const host = 'foodnstuff'
	const server = ns.getServer('home')
	log(ns.getServerGrowth(host))
	log(server.cpuCores)
	log(server.hostname)
	for (let i = 1; i <= 10; i++) {
		const threads = i * 10
		log(ns.formulas.hacking.growAmount(ns.getServer(host), ns.formulas.mockPerson(), threads, server.cpuCores))
		log(ns.growthAnalyzeSecurity(threads, host, ns.getServer().cpuCores))
		log(ns.growthAnalyzeSecurity(threads, host, 1000))
		log(ns.growthAnalyzeSecurity(threads, host, -1))
		log('\n')
	}
}
