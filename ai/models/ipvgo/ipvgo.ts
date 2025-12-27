import { Logger } from "../../../logging/index.ts";
import { AAIDef, CIODef, ExtractVariants, IOToVariants } from "../../definition.ts";
import * as Data from './data.ts'

// Node Input, very short name because it has to be written atleast 25x
const ni = CIODef.define(...Object.values(Data.NodeState))
// Populate with a lot of moves to make passing unlikely
const actions = CIODef.define('pass', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move',)
const coord = CIODef.define(0, 1, 2, 3, 4)

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
		x: coord,
		y: coord,
	} as const

	public HiddenLayers: number[] = []

	private logger: Logger

	constructor(ns: NS) {
		super()

		const size = 1 + (Math.floor(Math.random() * 4))
		for (let i = 0; i < size; i++) {
			this.HiddenLayers.push(Math.floor(25 + (Math.random() * 75)))
		}
		console.log(this.HiddenLayers)

		super.createNeuralNetwork()
		this.logger = new Logger(ns)
	}

	private get log() {
		return this.logger.log
	}

	public GetInputFromBoard(board: Data.BoardState): Record<keyof typeof this.Inputs, ExtractVariants<typeof ni>> {
		const result = {} as ReturnType<typeof this.GetInputFromBoard>
		const size = board.length

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const i = y + (x * size)
				result[this.InputKeys[i]] = board[x][y] as Data.VNodeState
				// this.log(`${i}: ${board[x][y]}`)
			}
		}

		return result
	}
}
