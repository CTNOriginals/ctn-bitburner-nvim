import { Logger } from '../../../../logging/index.ts'
import * as Data from '.././data.ts'
import { GameSession } from '../game/gameSession.ts'

export class GoPlayer {
	constructor(
		private ns: NS,
		public Typ: Data.KStone,
		private gameMaster: GameSession
	) { }

	public get Opponent(): Data.KStone {
		return this.Typ == 'black' ? 'white' : 'black'
	}

	public GetRandomMove(): Data.Position | null {
		const valid = this.ns.go.analysis.getValidMoves(this.Typ === 'white')
		const coords: [number, number][] = []

		for (let x = 0; x < this.gameMaster.BoardSize; x++) {
			for (let y = 0; y < this.gameMaster.BoardSize; y++) {
				if (valid[x][y] && this.gameMaster.BoardState[x][y] == Data.NodeState.empty) {
					coords.push([x, y])
				}
			}
		}

		if (coords.length == 0) {
			return null
		}

		const pick = coords[Math.floor(Math.random() * coords.length)]
		return { x: pick[0], y: pick[1] }
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


