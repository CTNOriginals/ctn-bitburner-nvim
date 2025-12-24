import { Logger } from '../../../../logging/index.ts'
import * as Data from '../data.ts'
import { AIPlayer } from '../player/aiPlayer.ts'
import { AGoPlayer } from '../player/definition.ts'
import { NPCPlayer } from '../player/npcPlayer.ts'

export class GameSession {
	public BoardHistory: Data.BoardState[] = []

	private logger: Logger

	constructor(
		private ns: NS,
		public BoardSize: Data.BoardSize = 5,
		public Player1: Exclude<AGoPlayer, NPCPlayer>,
		public Player2: AGoPlayer,
	) {
		this.logger = new Logger(ns)
	}

	private get go() {
		return this.ns.go
	}
	private get log() {
		return this.logger.log
	}
	public get BoardState(): Data.BoardState {
		return this.BoardHistory[this.BoardHistory.length - 1]
	}
	// public PlayersDo<M extends MethodsOf<AGoPlayer>>(method: MethodsOf<AGoPlayer>, ...params: MethodParams<AGoPlayer, M>) {
	public PlayersDo<M extends MethodsOf<AGoPlayer>>(method: MethodsOf<AGoPlayer>) {
		this.Player1[method]
		this.Player2[method]
	}

	public GoOpponentName(): GoOpponent {
		if (this.Player2.Type == 'npc') {
			return (this.Player2 as NPCPlayer).Name
		}

		return 'No AI'
	}

	public Reset() {
		this.go.resetBoardState(this.GoOpponentName(), this.BoardSize)
		this.BoardHistory = [this.go.getBoardState() as Data.BoardState]
	}

	public async Start(): Promise<void> {
		this.Reset()
		const black = this.Player1
		const white = this.Player2

		black.OnGameStart(this, 'black')
		white.OnGameStart(this, 'white')

		while (this.go.getCurrentPlayer() !== 'None') {
			await this.ns.asleep(10)
			const turn = this.go.getCurrentPlayer()

			const player = turn == 'Black' ? black : white

			player.Move()

			if (player.Type !== 'ai') {
				await player.Wait()
			}

			this.BoardHistory.push(this.go.getBoardState() as Data.BoardState)
			this.log(`${turn} (${player.Type}):\t${player.CalculateMoveReward()}`)
		}

		this.logger.log('Game ended')
		// black.OnGameEnd()
		// white.OnGameEnd()
		this.PlayersDo('OnGameEnd')
	}

	public CountStones(board: Data.BoardState = this.BoardState): Record<Data.KStone, number> {
		const count = { black: 0, white: 0 }

		for (const row of board) {
			for (const node of row) {
				if (node == Data.NodeState.black) {
					count.black++
				} else if (node == Data.NodeState.white) {
					count.white++
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

