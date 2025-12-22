// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { Layer, NeuralNetwork } from "./neuralNetwork.ts";
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions.ts";
import { AAIDef, CIODef, ExtractVariants, IOToVariants } from "./index.ts";

import { Logger } from "../../logging/index.ts";

class AIXOR extends AAIDef {
	private io = CIODef.define('0', '1')

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
		this.init(this)
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

	public Test<
		I extends IOToVariants<typeof this.inputs>,
		O extends IOToVariants<typeof this.outputs>
	>(inputs: I): O {
		const keys = Object.keys(this.outputs) as (keyof typeof this.outputs)[]

		const ins: number[] = []
		let results = {}

		for (const key in inputs) {
			const def = this.inputs[key as keyof typeof this.inputs]
			const variant = inputs[key as keyof I]
			ins.push(def.GetValueFromVarient(variant as ExtractVariants<typeof def>))
		}

		const outs: number[] = this.test(ins)

		for (let i = 0; i < outs.length; i++) {
			const key: keyof typeof this.outputs = keys[i]
			const def = this.outputs[key]
			results[key] = def.GetVarientFromValue(outs[i])
		}

		return results as O
	}
}


let logger: Logger

export async function main(ns: NS) {
	ns.disableLog('ALL');
	ns.clearLog()
	console.clear();

	logger = new Logger(ns)

	const ai = new AIXOR()

	// logger.log(JSON.stringify(this.neuralNetwork, null, '  '))
	logger.log(ai.inputs)
	logger.log(ai.outputs)
	// logger.log(ai.inputs.cin.GetValueFromVarient('on'))
	ai.Train([
		{
			inputs: { x: '0', y: '0' },
			targets: { out: '0' }
		},
		{
			inputs: { x: '1', y: '0' },
			targets: { out: '1' }
		},
		{
			inputs: { x: '0', y: '1' },
			targets: { out: '1' }
		},
		{
			inputs: { x: '1', y: '1' },
			targets: { out: '0' }
		},
	], 10000, 0.1)

	logger.log('00: ', ai.Test({ x: '0', y: '0' })['out'])
	logger.log('01: ', ai.Test({ x: '0', y: '1' })['out'])
	logger.log('10: ', ai.Test({ x: '1', y: '0' })['out'])
	logger.log('11: ', ai.Test({ x: '1', y: '1' })['out'])
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

