import { Logger } from '../../../logging/index.ts'
import * as Data from './data.ts'
import { GameMaster } from './gameMaster.ts'

export class GoPlayer {
	constructor(
		private ns: NS,
		public Typ: Data.KStone,
		private gameMaster: GameMaster
	) {

	}

	public get Opponent(): Data.KStone {
		return this.Typ == 'black' ? 'white' : 'black'
	}

	public GetRandomMove(): [number, number] | [] {
		const valid = this.ns.go.analysis.getValidMoves()
		const coords: [number, number][] = []

		for (let x = 0; x < this.gameMaster.BoardSize; x++) {
			for (let y = 0; y < this.gameMaster.BoardSize; y++) {
				if (valid[x][y]) {
					coords.push([x, y])
				}
			}
		}

		// this.ns.print(Math.random() * coords.length - 1)
		// this.ns.print(coords[Math.round(Math.random() * coords.length - 1)])
		return coords[Math.floor(Math.random() * coords.length)]
	}

	public CountStones(board: Data.BoardState = this.gameMaster.BoardState): number {
		return this.gameMaster.CountStones(board)[this.Typ]
	}

	public CalculateMoveReward() {
		const boardBefore = this.gameMaster.BoardHistory[this.gameMaster.BoardHistory.length - 2]
		const boardAfter = this.gameMaster.BoardHistory[this.gameMaster.BoardHistory.length - 1]
		let reward = 0

		// 1. CAPTURED STONES (easiest - just count pieces)
		const stonesBefore = this.gameMaster.CountStones(boardBefore)
		const stonesAfter = this.gameMaster.CountStones(boardAfter)
		const capturedStones = stonesBefore[this.Opponent] - stonesAfter[this.Opponent]
		reward += capturedStones * 10

		// 2. TERRITORY CLAIMED (built-in API!)
		const territoryBefore = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes() as unknown as Data.BoardState)
		// Make the move happens here in your actual code
		const territoryAfter = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes() as unknown as Data.BoardState)
		const territoryClaimed = territoryAfter - territoryBefore
		reward += territoryClaimed * 2

		// 3. LIBERTIES (sum them from the API)
		const libertiesBefore = this.gameMaster.SumPlayerLiberties(boardBefore)
		const libertiesAfter = this.gameMaster.SumPlayerLiberties(boardAfter)
		const libertyChange = libertiesAfter - libertiesBefore
		reward += libertyChange * 0.5

		// 4. GOT CAPTURED (check if we lost stones)
		const ourLostStones = stonesBefore[this.Opponent] - stonesAfter[this.Opponent]
		reward += ourLostStones * -15

		return reward
	}

}
