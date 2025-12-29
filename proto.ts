import { AAIDef, CIODef } from './ai/definition.ts'
import { GoAI5 } from './ai/models/ipvgo/ipvgo.ts'
import { NeuralNetwork } from './ai/neuralNetwork.ts'
import { Logger } from './logging/index.ts'
import * as ScriptManager from './managers/script/script.ts'
import * as Worm from './hack/worm.ts'

// @ts-ignore:next-line
class ProtoAI extends AAIDef<ProtoAI> {
	public Inputs = {
		i1: CIODef.define('foo', 'bar'),
		// i2: new CIODef('foo', 'bar'),
	} as const

	public Outputs = {
		o1: CIODef.define('on', 'off'),
		// o2: new CIODef('on', 'off'),
		// out3: new CIODef('on', 'off'),
	} as const

	public HiddenLayers: number[] = [1, 1]

	constructor(private log: (...msg) => void) {
		super()
		super.createNeuralNetwork()

		// log(JSON.stringify(this.neuralNetwork, null, 2))
	}
}

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	// // log(ScriptManager.ProcessStartup
	// if (ScriptManager.ProcessStartup.size == 0) {
	// 	await ns.asleep(1100)
	// }
	//
	// for (const [pid, time] of ScriptManager.ProcessStartup.entries()) {
	// 	const script = ns.getRunningScript(pid) || ns.getRecentScripts().find(s => s.pid == pid)
	// 	log(`${pid}: ${(Date.now() - time) / 1000} - ${script?.title}`)
	// }

	let tree: { [key: string]: string[] } = {}
	const f = ns.format.number

	await Worm.ServerWorm(ns, 'home', (server: Server, parent: string) => {
		if (!Object.keys(tree).includes(parent)) {
			tree[parent] = []
		}

		tree[parent].push(server.hostname)
	}, false, false, false)

	log(objStr(tree))

	// ns.cloud.purchaseServer()
	log(ns.cloud.getServerLimit())
	log(ns.cloud.getRamLimit())
	const ram = 2 ** 20
	log(`${ram} = ${ns.format.ram(ram)}: ${f(ns.cloud.getServerCost(ram))}`)

	// log(ns.cloud.purchaseServer('test', ram))
	// log(ns.cloud.deleteServer('test'))
	// for (const child in tree) {
	// 	const server = tree[child]
	// 	log()
	// }

	// await Worm.ServerWorm(ns, 'home', (server: Server, parent: string) => {
	// 	log(`---- ${server.hostname} ${server.organizationName} ----`)
	// 	log(`Money: ${f(server.moneyAvailable!)} / ${f(server.moneyMax!)}`)
	// 	log(`Money: ${f(server.ramUsed!)} / ${f(server.maxRam!)}`)
	//
	// 	log('\n\n')
	// }, false, false, false)


}

function objStr(obj: any): string {
	return JSON.stringify(obj, null, 2)
}
