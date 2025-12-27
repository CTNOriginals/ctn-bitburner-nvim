import { Logger } from '../../../../logging/index.ts'
import * as Data from '../data.ts'
import { AIPlayer } from '../player/aiPlayer.ts'
import { AGoPlayer } from '../player/definition.ts'
import { NPCPlayer } from '../player/npcPlayer.ts'

type TGameScore = { self: number, opp: number }
export class GameStats {
	public GameCount: number = 0
	public Won: number = 0
	public ScoreHistory: TGameScore[] = []

	public get Lost() {
		return this.GameCount - this.Won
	}

	public Report(self: number, opp: number) {
		this.GameCount++
		this.ScoreHistory.push({ self: self, opp: opp })

		if (self > opp) {
			this.Won++
		}
	}

	/** Get the total game score of each player */
	public GetTotal(): TGameScore {
		let total: TGameScore = { self: 0, opp: 0 }

		for (const score of this.ScoreHistory) {
			total.self += score.self
			total.opp += score.opp
		}

		return total
	}

	/** Get the average game score of each player */
	public GetAverage(): TGameScore {
		let score: TGameScore = this.GetTotal()

		score.self /= this.GameCount
		score.opp /= this.GameCount

		return score
	}

	/** Get the average difference between game scores */
	public GetRatio(): number {
		const score = this.GetAverage()
		return score.self - score.opp
	}
}

export class GameSession {
	public BoardHistory: Data.BoardState[] = []

	public Stats: GameStats = new GameStats()

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


	public async Start(): Promise<void> {
		this.BoardHistory = [this.go.getBoardState() as Data.BoardState]
		const black = this.Player1
		const white = this.Player2

		black.OnGameStart(this, 'black')
		white.OnGameStart(this, 'white')

		while (this.go.getCurrentPlayer() !== 'None') {
			await this.ns.asleep(10)
			const turn = this.go.getCurrentPlayer()
			// this.log(this.BoardState.join('\n'))

			const player = turn == 'Black' ? black : white

			await player.Move()

			if (player.Type !== 'ai') {
				await player.Wait()
			}

			this.BoardHistory.push(this.go.getBoardState() as Data.BoardState)

			// this.log(`---- ${turn} (${player.Type}) ----`)
			// this.log(`---- ${player.CalculateMoveReward(true)} ----\n\n`)
			// this.log(this.go.analysis.getLiberties(this.BoardState).join('\n'))
		}

		this.PlayersDo('OnGameEnd')

		const state = this.go.getGameState()
		this.Stats.Report(state.blackScore, state.whiteScore)

		if (state.blackScore == state.whiteScore) {
			this.log(`${this.Stats.GameCount}:\tTie\t${state.blackScore}`)
			return
		}

		const winner = ((state.blackScore > state.whiteScore) ? "black" : "white")
		const loser = ((state.blackScore > state.whiteScore) ? "white" : "black")

		this.log(`${this.Stats.GameCount}:\t${winner}\t${state.blackScore} / ${state.whiteScore} = ${state[winner + 'Score'] - state[loser + 'Score']} (${Math.round(this.Stats.GetRatio() * 10) / 10})`)
	}

	public Restart() {
		this.go.resetBoardState(this.GoOpponentName(), this.BoardSize)
	}

	public Reset() {
		this.Stats = new GameStats()
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

	public Liberties(board: Data.BoardState = this.BoardState): Record<Data.KStone, number> {
		const liberties = this.go.analysis.getLiberties(this.BoardState)
		const scores: ReturnType<typeof this.Liberties> = { black: 0, white: 0 }

		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				if (board[x][y] == Data.NodeState.black) {
					scores.black += liberties[x][y]
				} else if (board[x][y] == Data.NodeState.white) {
					scores.white += liberties[x][y]
				}
			}
		}

		return scores
	}

}

