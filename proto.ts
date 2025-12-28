import { AAIDef, CIODef } from './ai/definition.ts'
import { GoAI5 } from './ai/models/ipvgo/ipvgo.ts'
import { NeuralNetwork } from './ai/neuralNetwork.ts'
import { Logger } from './logging/index.ts'
import * as ScriptManager from './managers/script/script.ts'

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

	// log(ScriptManager.ProcessStartup)
	if (ScriptManager.ProcessStartup.size == 0) {
		await ns.asleep(1100)
	}

	for (const [pid, time] of ScriptManager.ProcessStartup.entries()) {
		const script = ns.getRunningScript(pid) || ns.getRecentScripts().find(s => s.pid == pid)
		log(`${pid}: ${(Date.now() - time) / 1000} - ${script?.title}`)
	}
}

function objStr(obj: any): string {
	return JSON.stringify(obj, null, 2)
}
