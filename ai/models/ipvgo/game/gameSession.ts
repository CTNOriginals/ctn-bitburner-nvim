import { Logger } from '../../../../logging/index.ts'
import * as Data from '../data.ts'
import { AIPlayer } from '../player/aiPlayer.ts'

export class GameSession {
	public BoardHistory: Data.BoardState[] = []

	private logger: Logger

	constructor(
		private ns: NS,
		public BoardSize: Data.BoardSize = 5
	) {
		this.logger = new Logger(ns)
	}

	private get go() {
		return this.ns.go
	}
	public get BoardState(): Data.BoardState {
		return this.BoardHistory[this.BoardHistory.length - 1]
	}


	public Reset() {
		this.go.resetBoardState('No AI', this.BoardSize)
		this.BoardHistory = [this.go.getBoardState() as Data.BoardState]
	}

	public async Start(): Promise<void> {
		this.Reset()
		const black = new AIPlayer(this.ns, 'black')
		const white = new AIPlayer(this.ns, 'white')

		black.OnGameStart(this)
		white.OnGameStart(this)

		while (this.go.getCurrentPlayer() !== 'None') {
			await this.ns.sleep(1)
			const turn = this.go.getCurrentPlayer()

			const player = turn == 'Black' ? black : white
			// const isWhite = turn == 'White'

			// await this.go.opponentNextTurn(false, isWhite)
			await player.WaitForMove()

			// const move: ReturnType<typeof player.GetRandomMove> = player.GetRandomMove()

			// if (move == null) {
			// 	this.go.passTurn(isWhite)
			// 	continue
			// }

			// this.go.makeMove(move.x, move.y, isWhite)
			player.DoMove()
		}

		this.logger.log('Game ended')
		black.OnGameEnd()
		white.OnGameEnd()
	}

	public CountStones(board: Data.BoardState = this.BoardState): Record<Data.KStone, number> {
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
		const liberties = this.go.analysis.getLiberties(this.BoardState)
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

