import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'

class ServerBatcher {

	constructor(private ns: NS, public Host: string) { }

	public GetServer(): Server {
		return this.ns.getServer(this.Host)
	}
}

type TServer = Required<Server>
type THostMap<T> = { [host: string]: T }

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)
	const nf = ns.format.number

	const host = ns.getHostname()

	const servers: THostMap<TServer> = {}
	const hostList: string[] = []

	await Worm.ServerWorm(ns, host, (server: Server) => {
		// servers.push(server as TServer)
		servers[server.hostname] = server as TServer
		hostList.push(server.hostname)
	})

	const totalTime = (server: TServer): number => {
		return ns.getWeakenTime(server.hostname) + ns.getGrowTime(server.hostname) + ns.getHackTime(server.hostname)
	}
	const serverScore = (server: TServer): number => {
		const growth = server.serverGrowth
		const max = server.moneyMax
		const time = totalTime(server)
		// const x = server.hackDifficulty

		return (max / (100 - growth)) / time
	}

	hostList.sort((a, b) => { return serverScore(servers[b]) - serverScore(servers[a]) })

	const maxspace = 18
	let totalScore = 0
	const serverScores: { [host: string]: number } = {}

	for (const host in servers) {
		const server = servers[host]
		const score = serverScore(server)

		if (server.serverGrowth <= 1 || score <= 0) {
			continue
		}

		serverScores[server.hostname] = score
		totalScore += score
	}

	for (const host of hostList) {
		const score = serverScores[host]
		if (!score) {
			continue
		}
		const server = servers[host]
		const space = maxspace - host.length

		log([
			`${host}:${" ".repeat(space)} `,
			`${nf(server.moneyMax)}`,
			`\t${100 - server.serverGrowth}`,
			`\t${Math.round(totalTime(server) / 1000)}`,
			`\t= ${nf(score, 2)}`,
			// ` \t(${Math.round(((score / totalScore) * 100) * 100) / 100})`,
			` \t(${ns.format.percent(((score / totalScore)))})`,
		].join(''))
	}
}
