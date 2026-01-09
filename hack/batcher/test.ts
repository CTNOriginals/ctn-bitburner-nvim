import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'
import { ServerController } from './serverController.ts'
import * as Data from './data.ts'

const testHosts: string[] = [
	// 'phantasy',
	// 'netlink',
	// 'vitalife',
	// 'omnitek',
	// 'rho-construction',
	// 'helios',
	// 'silver-helix',
	// 'lexo-corp',
	// 'fulcrumtech',
	'foodnstuff',
	'harakiri-sushi',
	'sigma-cosmetics',
	'joesguns',
]
const testBlacklist: string[] = [
	// 'foodnstuff',
	// 'sigma-cosmetics',
]


export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.clearLog()
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)


	for (const [_key, ps] of ns.ps().entries()) {
		if (Object.values(Data.BatchScripts).includes(ps.filename)) {
			ns.kill(ps.pid)
		}
	}

	const host = ns.getHostname()
	const controllers: Data.THostMap<ServerController> = {}
	const hostList: string[] = []
	const maxRam = ns.getServerMaxRam(host) * 0.5

	await Worm.ServerWorm(ns, host, (server: Server) => {
		if (testBlacklist.includes(server.hostname)
			|| testHosts.length != 0
			&& !testHosts.includes(server.hostname)
		) {
			return
		}

		controllers[server.hostname] = new ServerController(
			ns,
			server.hostname,
			0.5,
			Data.BatchScripts
		)

		hostList.push(server.hostname)
	}, true, false, true)

	log('\n\n')

	hostList.sort((a, b) => { return controllers[a].GetScore() - controllers[b].GetScore() })

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
		// const server = controller.GetServer()

		if (!score) {
			continue
		}

		const percent = score / totalScore
		controller.SetMaxRam(maxRam * percent)

		log([
			`${controller.GetInfoString()}`,
			` \t(${ns.format.percent(percent)})`,
			` (${ns.format.ram(maxRam * percent)})`,
		].join(''))
	}
	log('\n')
	await ns.asleep(1000)

	for (const host of hostList) {
		if (!serverScores[host]) {
			continue
		}

		const controller = controllers[host]
		controller.Initialize()
		log('\n')
		await ns.asleep(100)
	}

	while (true) {
		await ns.asleep(100)
	}
}
