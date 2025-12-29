import { Logger } from '../../logging/index.ts'
import * as Data from './data.ts'
import * as Worm from '../worm.ts'

class ServerController {
	private maxRam: number
	private data = {
		security: new Data.MinMaxSecurity(this.ns, this.Host),
		money: new Data.MinMaxMoney(this.ns, this.Host),
	} as const

	constructor(
		private ns: NS,
		public Host: string,
	) { }

	public GetServer(): Data.TServer {
		return this.ns.getServer(this.Host) as Data.TServer
	}

	public GetTotalTime(): number {
		const server = this.GetServer()
		return this.ns.getWeakenTime(server.hostname)
			+ this.ns.getGrowTime(server.hostname)
			+ this.ns.getHackTime(server.hostname)
	}

	public GetScore(): number {
		const server = this.GetServer()
		const growth = server.serverGrowth
		const max = server.moneyMax
		const time = this.GetTotalTime()

		return (max / (100 - growth)) / time
	}

	public GetInfoString(): string {
		const nf = this.ns.format.number
		return [
			`${this.Host}:${" ".repeat(18 - this.Host.length)} `,
			`${nf(this.GetServer().moneyMax)}`,
			`\t${this.GetServer().serverGrowth}`,
			`\t${Math.round(this.GetTotalTime() / 1000)}`,
			`\t= ${nf(this.GetScore(), 2)}`,
		].join('')
	}

	public SetMaxRam(ram: number) {
		this.maxRam = ram
	}

	/** Ensures that the server is maxed out before launching the first batching sequence */
	public Initialize() {

	}
}

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)
	const nf = ns.format.number

	const host = ns.getHostname()

	const controllers: Data.THostMap<ServerController> = {}
	const hostList: string[] = []

	await Worm.ServerWorm(ns, host, (server: Server) => {
		// servers.push(server as TServer)
		controllers[server.hostname] = new ServerController(ns, server.hostname)
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
