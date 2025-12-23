import { NeuralNetwork } from "./neuralNetwork.ts"

type TIO = { [key: string]: CIODef }
export type ExtractVariants<T> = T extends CIODef<infer U> ? U : never;
export type IOToVariants<T extends TIO> = {
	[K in keyof T]: ExtractVariants<T[K]>
};

export class CIODef<T = string | number> {
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

export abstract class AAIDef<
	TInst extends AAIDef<never>,
	TI = IOToVariants<TInst['Inputs']>,
	TO = IOToVariants<TInst['Outputs']>
> {
	public abstract Inputs: TIO
	public abstract Outputs: TIO

	public abstract HiddenLayers: number[]

	protected neuralNetwork: NeuralNetwork

	constructor() { }

	public get InputKeys(): (keyof TInst['Inputs'])[] {
		return Object.keys(this.Inputs)
	}
	public get OutputKeys(): (keyof TInst['Outputs'])[] {
		return Object.keys(this.Outputs)
	}

	public get InputCount(): number {
		return this.InputKeys.length
	}
	public get OutputCount(): number {
		return this.OutputKeys.length
	}

	protected createNeuralNetwork() {
		this.neuralNetwork = new NeuralNetwork([this.InputCount, ...this.HiddenLayers, this.OutputCount])
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

	private getIOAsValues<IO extends TI | TO>(typ: 'i' | 'o', io: IO): number[] {
		const out: number[] = []
		const ioDef = typ == 'i' ? this.Inputs : this.Outputs

		for (const key in io) {
			const variant = io[key]
			out.push(ioDef[key].GetValueFromVarient(variant as ExtractVariants<typeof ioDef>))
		}

		return out
	}
	private getIOAsVariants<IO extends TI | TO>(typ: 'i' | 'o', io: number[]): IO {
		const out = {} as IO
		const ioDef = typ == 'i' ? this.Inputs : this.Outputs
		const keys = Object.keys(ioDef)

		for (let i = 0; i < io.length; i++) {
			const val = io[i]
			const key = keys[i]

			out[key] = ioDef[key].GetVarientFromValue(val)
		}

		return out
	}


	public GetInputValues(io: TI): number[] {
		return this.getIOAsValues('i', io)
	}
	public GetOutputsValues(io: TO): number[] {
		return this.getIOAsValues('o', io)
	}
	public GetInputVariants(io: number[]): TI {
		return this.getIOAsVariants('i', io)
	}
	public GetOutputVariants(io: number[]): TO {
		return this.getIOAsVariants('o', io)
	}

	public Train(
		data: { inputs: TI, outputs: TO }[],
		cycles: number,
		rate: number
	): void {
		const ins: number[][] = []
		const outs: number[][] = []

		for (const d of data) {
			ins.push(this.GetInputValues(d.inputs))
			outs.push(this.GetOutputsValues(d.outputs))
		}

		this.neuralNetwork.train(ins, outs, cycles, rate)
	}

	public Test(inputs: TI): TO {
		const keys = Object.keys(this.Outputs) as (keyof typeof this.Outputs)[]

		const ins: number[] = []
		let results = {} as TO

		for (const key in inputs) {
			const def = this.Inputs[key]
			const variant = inputs[key]
			ins.push(def.GetValueFromVarient(variant as string))
		}

		const outs: number[] = this.neuralNetwork.forward(ins)

		for (let i = 0; i < outs.length; i++) {
			const key: keyof typeof this.Outputs = keys[i]
			const def = this.Outputs[key]
			results[key] = def.GetVarientFromValue(outs[i])
		}

		return results
	}
}

