import { Logger } from '../../../logging/index.ts'
import * as Data from './data.ts'

export class GameMaster {
	public BoardHistory: Data.BoardState[] = []

	private logger: Logger

	constructor(private ns: NS) {
		this.logger = new Logger(ns)
	}

	public async Start(): Promise<void> {
		this.BoardHistory = []
		this.BoardHistory.push(this.ns.go.resetBoardState('No AI', 5) as unknown as Data.BoardState)

		const p1 = new GoPlayer(this.ns, 'black', this)
		const p2 = new GoPlayer(this.ns, 'white', this)

		let move: Data.PlayerMoveState = { type: 'pass', x: null, y: null }
		let turn: Data.KStone = 'black'

		while (true) {
			const p = turn == 'black' ? p1 : p2

			// Check if current player has valid moves
			if (this.ns.go.analysis.getValidMoves().length == 0) {
				break;
			}

			this.ns.print(p.Typ)
			const coords = p.GetRandomMove()

			if (!coords || coords.length === 0) {
				// No valid move found, pass turn
				await this.ns.go.passTurn()
				this.logger.log(`${p.Typ} passes`)
			} else {
				// Make the move
				const result = this.ns.go.makeMove(coords[0], coords[1])
				this.logger.log(`${p.Typ} plays: ${coords[0]} | ${coords[1]}`)

				// Check if game ended
				// if (result?.type === 'gameOver') {
				// 	break;
				// }
			}

			// Advance to next turn without waiting for AI
			await this.ns.go.opponentNextTurn(true, true)

			// Switch turns
			turn = turn == 'black' ? 'white' : 'black'
			this.ns.print('next turn: ', turn)
			await this.ns.sleep(500)
		}

		this.logger.log('Game ended')
	}


	public get BoardState(): Data.BoardState {
		return this.BoardHistory[this.BoardHistory.length - 1]
	}
	public get BoardSize(): number {
		return this.BoardState[0].length
	}

	// public CountStones(): {[key: Data.Stones]: number} {
	public CountStones(board: Data.BoardState = this.BoardState): { black: number, white: number } {
		const count = { black: 0, white: 0 }

		for (const row of board) {
			for (const node of row) {
				if (node == Data.NodeState.black || node == Data.NodeState.white) {
					count[node]++
				}
			}
		}

		return count
	}

	public SumPlayerLiberties(board: Data.BoardState = this.BoardState) {
		const liberties = this.ns.go.analysis.getLiberties(this.BoardState as unknown as string[])
		let total = 0

		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				if (board[x][y] === 'X') {
					total += liberties[x][y]
				}
			}
		}

		return total
	}

}

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
