import { Logger } from './logging/index.ts'
import * as Worm from './hack/worm.ts'
import * as Data from './managers/contract/data.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	await Worm.ServerWorm(ns, 'home', (server: Server) => {
		const files = ns.ls(server.hostname, '.cct')
		log(`${server.hostname}: ${files}`)
	}, false, false, false)
}
