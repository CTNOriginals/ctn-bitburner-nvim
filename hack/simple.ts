import { Logger } from "../logging/index.ts"
import * as Worm from './worm.ts'

let logger: Logger
const instFile = 'hack/simpleInst.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	logger = new Logger(ns)
	const player = ns.getPlayer()

	if (ns.args.includes('--worm')) {
		await Worm.ServerWorm(ns, ns.getHostname(), async (server: Server) => {
			if (server.requiredHackingSkill! > player.skills.hacking) {
				return
			}

			await startHackOnServer(ns, server.hostname)
		})
	} else {
		if (!ns.args.includes('--host')) {
			ns.tprint('hack/simple.ts requires "--host <host name>"')
			return
		}
		const host = ns.args[ns.args.indexOf('--host') + 1] as string
		startHackOnServer(ns, host)
	}

}

async function startHackOnServer(ns: NS, host: string) {
	// await ns.asleep(100)
	logger.log(`---- ${host} ----`)
	logger.log(`kill: `, ns.kill(instFile, host, host))
	await ns.sleep(100)
	logger.log(`scp : `, ns.scp(instFile, host))

	const max = ns.getServerMaxRam(host)
	const used = ns.getServerUsedRam(host)
	const cost = ns.getScriptRam(instFile)
	const free = (max) - used
	const threads = Math.floor(free / cost)

	if (threads <= 0) {
		logger.log(`Not enough free space to start`)
		logger.log('---- ----\n\n')
		return
	}

	logger.log(`max :____${ns.getServerMaxRam(host)}`)
	logger.log(`used:____${ns.getServerUsedRam(host)}`)
	logger.log(`cost:____${ns.getScriptRam(instFile)}`)
	logger.log(`free:____${(max) - used}`)
	logger.log(`threads:_${Math.floor(free / cost)}`)

	const pid = ns.exec(instFile, host, threads, host)
	logger.log(`started:_${pid}`)

	logger.log('---- ----\n\n')
}
