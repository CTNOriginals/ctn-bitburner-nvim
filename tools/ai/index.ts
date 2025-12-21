import { NeuralNetwork } from "./neuralNetwork.ts"

type TArrayItem<T extends any[]> = T[number]

export class CIODef<T = string> {
	/** The variences that the value may represent
	 * key: The name of the varient
	 * Value: The weight of the varient, meaning how much space this varient takes compared to the others.
	 * @example 
	 * // If the value of this IO is < 0.5, the varience would return 'off', otherwise 'on'
	 * ['off', 'on']
	*/
	public Variants: T[]

	/**
	 * @param variants The variences that the value may represent
	 * key: The name of the varient
	 * Value: The weight of the varient, meaning how much space this varient takes compared to the others.
	 * @example 
	 * // If the value of this IO is < 0.5, the varience would return 'off', otherwise 'on'
	 * ['off', 'on']
	*/
	constructor(...variants: T[]) {
		this.Variants = variants
	}

	public GetVarientFromValue(val: number): T {
		return this.Variants[Math.round(val * (this.Variants.length - 1))]
	}

	public GetValueFromVarient(variant: T): number {
		if (!this.Variants.includes(variant)) {
			throw `Variant does not include key: ${variant}`
		}

		return (1 / (this.Variants.length - 1)) * this.Variants.indexOf(variant)
	}
}

type TIO = { [key: string]: CIODef }

export abstract class AAIDef {
	protected abstract inputs: TIO
	protected abstract outputs: TIO

	protected abstract hiddenLayers: number[]

	protected get inputCount(): number {
		return Object.keys(this.inputs).length
	}
	protected get outputCount(): number {
		return Object.keys(this.outputs).length
	}

	protected neuralNetwork: NeuralNetwork

	protected init(inst: AAIDef) {
		// let layers: number[] = def.hiddenLayers ?? [this.inputCount + 1, this.outputCount + 1]
		this.neuralNetwork = new NeuralNetwork([inst.inputCount, ...inst.hiddenLayers, inst.outputCount])
	}

	public MakeTrainingData(
		inputs: { [key: keyof typeof this.inputs]: this['inputs'][] }
	)

	public Train(
		inputs: { [key: keyof typeof this.inputs]: number }[],
		targets: { [key: keyof typeof this.outputs]: number }[],
		cycles: number,
		rate: number
	) {
		let ins: number[][] = [[]]
		let outs: number[][] = [[]]

		for (const key in inputs) {

		}

		this.neuralNetwork.train(ins, outs, cycles, rate)
	}

}






