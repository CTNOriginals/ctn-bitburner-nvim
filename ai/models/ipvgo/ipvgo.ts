import { AAIDef, CIODef } from "../../definition.ts";

const NodeState = {
	empty: 'empty',
	black: 'black',
	white: 'white',
	static: 'static',
} as const

// Node Input, very short name because it has to be written atleast 25x
const ni = CIODef.define(...Object.keys(NodeState))
const actions = CIODef.define('place', 'pass')
const position = CIODef.define(
	0, 1, 2, 3, 4,
	5, 6, 7, 8, 9,
	10, 11, 12, 13, 14,
	15, 16, 17, 18, 19,
	20, 21, 22, 23, 24
)

// @ts-ignore:next-line
export class GoAI5 extends AAIDef<GoAI5> {
	public Inputs = {
		x00: ni, x01: ni, x02: ni, x03: ni, x04: ni,
		x05: ni, x06: ni, x07: ni, x08: ni, x09: ni,
		x10: ni, x11: ni, x12: ni, x13: ni, x14: ni,
		x15: ni, x16: ni, x17: ni, x18: ni, x19: ni,
		x20: ni, x21: ni, x22: ni, x23: ni, x24: ni,
	} as const
	public Outputs = {
		action: actions,
		x: position,
		y: position,
	} as const

	public HiddenLayers: number[] = [30, 25, 10, 5];

	constructor() {
		super()
		super.createNeuralNetwork()
	}
}
