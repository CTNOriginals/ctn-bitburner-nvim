// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { Layer, NeuralNetwork } from "./neuralNetwork.ts";
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions.ts";
import { AAIDef, CIODef, ExtractVariants, IOToVariants } from "./index.ts";

import { Logger } from "../../logging/index.ts";


// @ts-ignore
// The error was that AAIDef<AIXOR> is a circular ref
// which is true and is bad, but it doesnt actually break
// and the payoff for the types functioning like this is way greater
// so shut the fuck up TS
class AIXOR extends AAIDef<AIXOR> {
	private io = CIODef.define(0, 1)

	public inputs = {
		x: this.io,
		y: this.io,
	} as const
	public outputs = {
		out: this.io,
	} as const

	protected hiddenLayers: number[] = [3, 5, 3]

	constructor() {
		super()
		super.createNeuralNetwork()
	}
}

let logger: Logger
let thisNS

export async function main(ns: NS) {
	ns.disableLog('ALL');
	ns.clearLog()
	console.clear();

	thisNS = ns
	logger = new Logger(ns)

	const ai = new AIXOR()

	logger.log(ai.inputs)
	logger.log(ai.outputs)
	ai.Train([
		{
			inputs: { x: 0, y: 0 },
			outputs: { out: 0 }
		},
		{
			inputs: { x: 1, y: 0 },
			outputs: { out: 1 }
		},
		{
			inputs: { x: 0, y: 1 },
			outputs: { out: 1 }
		},
		{
			inputs: { x: 1, y: 1 },
			outputs: { out: 0 }
		},
	], 10000, 0.1)

	logger.log('00: ', ai.Test({ x: 0, y: 0 })['out'])
	logger.log('01: ', ai.Test({ x: 0, y: 1 })['out'])
	logger.log('10: ', ai.Test({ x: 1, y: 0 })['out'])
	logger.log('11: ', ai.Test({ x: 1, y: 1 })['out'])

	logger.log(ai.GetInputValues({ x: 1, y: 0 }))
	logger.log(ai.GetInputVariants([0, 1]))
	logger.log(ai.GetOutputVariants([1]))
	logger.log(ai.inputKeys)
}

function xorSolver(ns: NS) {
	const nn = new NeuralNetwork([2, 4, 4, 1]);
	const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]];
	const targets = [[0], [1], [1], [0]];

	// console.log(targets)
	nn.train(inputs, targets, 10000, 0.1);

	inputs.forEach((input, i) => {
		ns.print(`Input: ${input}, Target: ${targets[i]}, Predicted: ${nn.forward(input)}`)
	})

	ns.write('tmp.json', JSON.stringify(nn.layers, null, 2), 'w');
}

