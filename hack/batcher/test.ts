import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'
import { ServerController } from './serverController.ts'
import * as Data from './data.ts'

const testHosts: string[] = [
	'phantasy'
]

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	const host = ns.getHostname()
	const controllers: Data.THostMap<ServerController> = {}
	const hostList: string[] = []

	await Worm.ServerWorm(ns, host, (server: Server) => {
		if (testHosts.length != 0 && !testHosts.includes(server.hostname)) {
			return
		}

		controllers[server.hostname] = new ServerController(
			ns,
			server.hostname,
			0.5,
			Data.BatchScripts
		)

		hostList.push(server.hostname)
	})

	hostList.sort((a, b) => { return controllers[b].GetScore() - controllers[a].GetScore() })

	let totalScore = 0
	const serverScores: { [host: string]: number } = {}

	for (const host in controllers) {
		const controller = controllers[host]
		const score = controller.GetScore()

		if (controller.GetServer().serverGrowth <= 1 || score <= 0) {
			continue
		}

		serverScores[controller.Target] = score
		totalScore += score
	}

	for (const host of hostList) {
		const controller = controllers[host]
		const score = serverScores[host]
		const server = controller.GetServer()

		if (!score) {
			continue
		}

		log([
			`${controller.GetInfoString()}`,
			` \t(${ns.format.percent(((score / totalScore)))})`,
		].join(''))

		// await ns.hack(server.hostname)

		controller.Initialize()
	}

	while (true) {
		await ns.asleep(100)
	}
}
