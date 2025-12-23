import { AAIDef, CIODef } from "../../definition.ts";

// @ts-ignore:next-line
export class AdderAI extends AAIDef<AdderAI> {
	private bit = CIODef.define(0, 1)

	public Inputs = {
		x: this.bit,
		y: this.bit,
		cin: this.bit,
	} as const
	public Outputs = {
		sum: this.bit,
		cout: this.bit,
	} as const

	public HiddenLayers: number[] = [4, 4]

	constructor() {
		super()
		super.createNeuralNetwork()
	}
}
