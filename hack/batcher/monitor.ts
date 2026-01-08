import { Logger } from '../../logging/index.ts'
import * as Worm from '../worm.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	const nf = (n: number): string => {
		return ns.format.number(n, 2)
	}

	while (true) {
		ns.clearLog()
		await Worm.ServerWorm(ns, ns.getHostname(), (server) => {
			if (server.serverGrowth <= 1 || server.serverGrowth > 100) {
				return
			}

			const host = server.hostname
			const space = 18 - host.length

			// const sec = `${nf(server.hackDifficulty)} / ${nf(server.minDifficulty)}`
			// const mon = `${nf(server.moneyAvailable)} / ${nf(server.moneyMax)}`
			const sec = `${Math.round((server.minDifficulty / server.hackDifficulty) * 100)}%`
			const mon = `${Math.round((server.moneyAvailable / server.moneyMax) * 100)}%`

			// log([
			// 	`${host}:${' '.repeat(space)}`,
			// 	`${sec}${' '.repeat(14 - sec.length)} |`,
			// 	`${' '.repeat(17 - mon.length)}${mon}`,
			// ].join(` `))
			log([
				`${host}:${' '.repeat(space)}`,
				`${sec}${' '.repeat(4 - sec.length)} |`,
				`${' '.repeat(4 - mon.length)}${mon}`,
			].join(` `))
		}, false, false, true)

		await ns.asleep(1000)
	}
}
