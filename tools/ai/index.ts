// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { Layer, NeuralNetwork } from "./neuralNetwork.ts";
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions.ts";

export async function main(ns: NS) {
	ns.disableLog('ALL');

	// console.clear();

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

