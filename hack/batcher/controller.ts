import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'

import { ServerController } from './serverController.ts'
import * as Data from './data.ts'

let ns: NS

export async function main(n: NS) {
	ns = n
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	const host = ns.getHostname()
	const controllers: Data.THostMap<ServerController> = {}
	const hostList: string[] = []

	await Worm.ServerWorm(ns, host, (server: Server) => {
		controllers[server.hostname] = new ServerController(
			ns,
			server.hostname,
			0.5,
			Data.BatchScripts,
		)
		hostList.push(server.hostname)
	})
}

