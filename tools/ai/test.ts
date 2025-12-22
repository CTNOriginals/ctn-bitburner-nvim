// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { Layer, NeuralNetwork } from "./neuralNetwork.ts";
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions.ts";
import { AAIDef, CIODef, IOToVariants } from "./index.ts";

import { Logger } from "../../logging/index.ts";

class AIAdder extends AAIDef {
	private io = CIODef.define('on', 'off')

	protected inputs = {
		cin: this.io,
		x: this.io,
		y: this.io,
	} as const
	protected outputs = {
		sum: this.io,
		carry: this.io,
		cout: this.io,
	} as const

	protected hiddenLayers: number[] = [4, 4]

	constructor() {
		super()
		// this.init(this)
		logger.log(JSON.stringify(this.neuralNetwork, null, '  '))
		logger.log(this.inputs)
		logger.log(this.inputs.cin.GetValueFromVarient('on'))
		this.Train([
			{
				inputs: {
					cin: 'off',
					x: 'on',
					y: 'on',
				},
				targets: {
					sum: 'off',
					carry: 'on',
					cout: 'off',
				}
			}
		], 10000, 0.1)
	}

	public Train<
		I extends IOToVariants<typeof this.inputs>,
		O extends IOToVariants<typeof this.outputs>
	>(
		data: { inputs: I, targets: O }[],
		cycles: number,
		rate: number
	): void {
		this.trainWithVariants(data, cycles, rate);
	}
}


let logger: Logger

export async function main(ns: NS) {
	ns.disableLog('ALL');
	ns.clearLog()
	console.clear();

	logger = new Logger(ns)

	new AIAdder()

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

