// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { Layer, NeuralNetwork } from "./neuralNetwork.ts";
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions.ts";
import { AAIDef, CIODef } from "./index.ts";
import { Logger } from "../../logging/index.ts";


class AIAdder extends AAIDef {
	private io = {
		on: 'on',
		off: 'off'
	} as const
	private ioDef = new CIODef<keyof typeof this.io>('on', 'off')

	protected inputs = {
		cin: this.ioDef,
		x: this.ioDef,
		y: this.ioDef,
	} as const
	protected outputs = {
		sum: this.ioDef,
		carry: this.ioDef,
		cout: this.ioDef,
	} as const

	protected hiddenLayers: number[] = [4, 4]

	protected inst: AAIDef = this
	constructor() {
		super()
		this.init(this)
		logger.log(JSON.stringify(this.neuralNetwork, null, '  '))
		logger.log(this.inputs)
	}
}

let logger: Logger

export async function main(ns: NS) {
	ns.disableLog('ALL');
	ns.clearLog()
	console.clear();

	logger = new Logger(ns)

	new AIAdder()
	return

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

