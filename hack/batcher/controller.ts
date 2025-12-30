import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'

import { ServerController } from './serverController.ts'
import * as Data from './data.ts'


const batchScripts: Data.TBatchScript = {
	weaken: 'hack/batcher/scripts/weaken.ts',
	grow: 'hack/batcher/scripts/grow.ts',
	hack: 'hack/batcher/scripts/hack.ts',
}

let ns: NS

export async function main(n: NS) {
	ns = n
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)
	const nf = ns.format.number

	const host = ns.getHostname()

	const controllers: Data.THostMap<ServerController> = {}
	const hostList: string[] = []

	await Worm.ServerWorm(ns, host, (server: Server) => {
		// servers.push(server as TServer)
		controllers[server.hostname] = new ServerController(
			ns,
			server.hostname,
			batchScripts,
		)
		hostList.push(server.hostname)
	})

	hostList.sort((a, b) => { return controllers[b].GetScore() - controllers[a].GetScore() })

	const maxspace = 18
	let totalScore = 0
	const serverScores: { [host: string]: number } = {}

	for (const host in controllers) {
		const server = controllers[host]
		const score = server.GetScore()

		if (server.GetServer().serverGrowth <= 1 || score <= 0) {
			continue
		}

		serverScores[server.GetServer().hostname] = score
		totalScore += score
	}

	for (const host of hostList) {
		const server = controllers[host]
		const score = serverScores[host]

		if (!score) {
			continue
		}

		log([
			`${server.GetInfoString()}`,
			` \t(${ns.format.percent(((score / totalScore)))})`,
		].join(''))
	}
}

