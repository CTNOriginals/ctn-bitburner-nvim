import { Logger } from '../../../logging/index.ts'
import * as Data from './data.ts'
import { GoPlayer } from './player.ts'

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

		while (true) {
			await this.ns.sleep(1)
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

