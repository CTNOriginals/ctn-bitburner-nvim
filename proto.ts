import { AAIDef, CIODef } from './ai/definition.ts'
import { GoAI5 } from './ai/models/ipvgo/ipvgo.ts'
import { NeuralNetwork } from './ai/neuralNetwork.ts'
import { Logger } from './logging/index.ts'

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

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	log(ns.ls('home', 'ai/models/ipvgo/export'))


	const ai = new ProtoAI(log)
	ai.Import(ns, 'tmp/ai.json')
	const nn = ai.neuralNetwork
	log(objStr(nn))
	log(ai.Test({ i1: 'foo' }))

	// nn.layers[0].neurons[0].weights = [1]
	// nn.layers[0].neurons[0].bias = 0
	//
	// nn.layers[1].neurons[0].weights = [1]
	// nn.layers[1].neurons[0].bias = 0

	// nn.layers[1].neurons[1].weights = [1]
	// nn.layers[1].neurons[1].bias = 1
	// log(objStr(nn))
	// ai.Export(ns, 'tmp/ai.json')

	// log('00: ', nn.forward([0, 0]))
	// log('01: ', nn.forward([0, 1]))
	// log('10: ', nn.forward([1, 0]))
	// log('11: ', nn.forward([1, 1]))

	// log(objStr(nn.layers.pop()?.neurons))
}

function objStr(obj: any): string {
	return JSON.stringify(obj, null, 2)
}
