import { NeuralNetwork } from "./neuralNetwork.ts"

type TIO = { [key: string]: CIODef }
type ExtractVariants<T> = T extends CIODef<infer U> ? U : never;
export type IOToVariants<T extends TIO> = {
	[K in keyof T]: ExtractVariants<T[K]>
};

export class CIODef<T = string> {
	/** The variences that the value may represent
	 * key: The name of the varient
	 * Value: The weight of the varient, meaning how much space this varient takes compared to the others.
	 * @example 
	 * // If the value of this IO is < 0.5, the varience would return 'off', otherwise 'on'
	 * ['off', 'on']
	*/
	public Variants: T[]

	constructor(...variants: T[]) {
		this.Variants = variants
	}

	// Static factory method for type inference
	static define<const T extends readonly (string | number)[]>(...variants: T) {
		return new CIODef<T[number]>(...variants)
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

	private inst: AAIDef

	public abstract Train(
		data: any[],
		cycles: number,
		rate: number
	): void

	protected init(inst: AAIDef) {
		this.inst = inst
		this.neuralNetwork = new NeuralNetwork([inst.inputCount, ...inst.hiddenLayers, inst.outputCount])
	}

	public StartTraining(
		data: {
			inputs: number[],
			targets: number[],
		}[],
		cycles: number,
		rate: number
	) {
		const ins: number[][] = []
		const outs: number[][] = []

		for (const d of data) {
			ins.push(d.inputs)
			outs.push(d.targets)
		}

		this.neuralNetwork.train(ins, outs, cycles, rate)
	}

	// Protected helper that does the actual work
	protected trainWithVariants<
		I extends IOToVariants<TIO>,
		O extends IOToVariants<TIO>
	>(
		data: { inputs: I, targets: O }[],
		cycles: number,
		rate: number
	): void {
		const transformedData = data.map(entry => {
			const inputValues = Object.keys(this.inputs).map(key => {
				const ioDef = this.inputs[key];
				const variant = entry.inputs[key as keyof I];
				return ioDef.GetValueFromVarient(variant);
			});

			const targetValues = Object.keys(this.outputs).map(key => {
				const ioDef = this.outputs[key];
				const variant = entry.targets[key as keyof O];
				return ioDef.GetValueFromVarient(variant);
			});

			return {
				inputs: inputValues,
				targets: targetValues,
			};
		});

		this.StartTraining(transformedData, cycles, rate);
	}

}

