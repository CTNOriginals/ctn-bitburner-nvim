//* Source/Guide: https://medium.com/@pat_metzdorf/building-a-basic-neural-net-using-javascript-1f554780dc60
import { MSE, ReLU, ReLUDeriv, Sigmoid, SigmoidDeriv } from "./functions";

type ActivationFunction = (x: number) => number;


export class Neuron {
	public lastInput: number[] = undefined!;
	public lastOutput: number = undefined!;
	public lastActivation: number = undefined!;

	constructor(
		public weights: number[],
		public bias: number,
		public activation: ActivationFunction = Sigmoid,
		public activationDerivative: ActivationFunction = SigmoidDeriv,
	) { }

	public activate(inputs: number[]): number {
		const weightedSum = this.weights.reduce((sum, weight, i) => sum + weight * inputs[i], 0) + this.bias;

		this.lastInput = inputs;
		this.lastActivation = weightedSum;
		this.lastOutput = this.activation(weightedSum);

		return this.lastOutput;
	}

	public updateWeights(learningRate: number, delta: number) {
		this.weights = this.weights.map((weight, i) => {
			return weight - learningRate * delta * this.lastInput[i];
		});

		this.bias -= learningRate * delta;
	}
}

export class Layer {
	public neurons: Neuron[];

	constructor(
		inputCount: number,
		neuronCount: number,
		activation: ActivationFunction = Sigmoid,
		activationDerivative: ActivationFunction = SigmoidDeriv,
	) {
		this.neurons = Array.from({ length: neuronCount }, () => {
			const weights = Array.from({ length: inputCount }, () => Math.random() * 2 - 1);
			return new Neuron(weights, Math.random() * 2 - 1, activation, activationDerivative);
		});
	}

	public forward(inputs: number[]): number[] {
		return this.neurons.map(n => n.activate(inputs));
	}

	public backward(nextLayerDeltas: number[], learningRate: number) {
		// return this.neurons.map((neuron, i) => {
		// 	const delta = neuron.activationDerivative(neuron.lastActivation) * nextLayerDeltas[i];
		// 	neuron.updateWeights(learningRate, delta);
		// 	return neuron.weights.map(weight => weight * delta);
		// });

		//? Initialize an array to hold the accumulated deltas for each input node in the previous layer
		const prevLayerDeltas = Array(this.neurons[0].weights.length).fill(0);

		this.neurons.forEach((neuron, i) => {
			const delta = neuron.activationDerivative(neuron.lastActivation) * nextLayerDeltas[i];
			neuron.updateWeights(learningRate, delta);

			neuron.weights.forEach((weight, j) => {
				prevLayerDeltas[j] += weight * delta;
			});
		})

		return prevLayerDeltas;
	}
}

export class NeuralNetwork {
	public layers: Layer[] = [];

	constructor(
		layerSizes: number[],
		activations: ActivationFunction[] = [ReLU, Sigmoid],
		activationDerivatives: ActivationFunction[] = [ReLUDeriv, SigmoidDeriv],
	) {
		for (let i = 1; i < layerSizes.length; i++) {
			this.layers.push(new Layer(layerSizes[i - 1], layerSizes[i], activations[i - 1], activationDerivatives[i - 1]));
		}
	}

	public forward(inputs: number[]): number[] {
		return this.layers.reduce((layerInputs, layer) => {
			return layer.forward(layerInputs)
		}, inputs)
	}

	public backward(target: number[], learningRate: number): void {
		let deltas = this.layers[this.layers.length - 1].neurons.map((neuron, i) => {
			return (neuron.lastOutput - target[i]) * neuron.activationDerivative(neuron.lastActivation);
		});
		for (let i = this.layers.length - 1; i >= 0; i--) {
			deltas = this.layers[i].backward(deltas, learningRate);
		}
	}

	public train(inputs: number[][], targets: number[][], epochs: number, learningRate: number) {
		for (let epoch = 0; epoch < epochs; epoch++) {
			let totalLoss = 0;
			for (let i = 0; i < inputs.length; i++) {
				const output = this.forward(inputs[i]);
				this.backward(targets[i], learningRate);
				totalLoss += MSE(output, targets[i]);
			}
			if (epoch % 100 === 0) {
				console.log(`Epoch ${epoch}, Average Loss: ${totalLoss / inputs.length}`);
			}
		}
	}
}
