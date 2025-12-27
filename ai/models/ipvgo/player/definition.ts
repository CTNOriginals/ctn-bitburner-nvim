import { Logger } from '../../../../logging/index.ts'
import * as Data from '.././data.ts'
import { GameSession } from '../game/gameSession.ts'

export abstract class AGoPlayer {
	protected gameSession: GameSession
	public IsPlaying: boolean = false

	protected color: Data.KStone

	private logger: Logger

	constructor(
		private ns: NS,
		public Type: Data.KPlayerType,
	) {
		this.logger = new Logger(ns)

		if (this.Type == 'manual') {
			this.color = 'black'
		} else if (this.Type == 'npc') {
			this.color = 'white'
		}
	}

	public get go() {
		return this.ns.go
	}
	public get log() {
		return this.logger.log
	}
	private get isWhite(): boolean {
		return this.color == 'white'
	}
	public get OpponentColor(): Data.KStone {
		return this.isWhite ? 'black' : 'white'
	}

	public Move(pos?: Data.Position) {
		// this.log(`Move: ${this.color}`)
		if (!pos) {
			return
		}

		// TODO: add error handling
		this.go.makeMove(pos.x, pos.y, this.isWhite)
	}
	public Pass() {
		this.go.passTurn(this.isWhite)
	}
	public Wait(): Promise<any> {
		// this.log(`Wait: ${this.color}`)
		return this.go.opponentNextTurn(false, this.isWhite)
	}

	public GetValidMoves() {
		return this.go.analysis.getValidMoves(undefined, undefined, this.isWhite)
	}
	public GetValidPositions(): Data.Position[] {
		const valid = this.GetValidMoves()
		const positions: Data.Position[] = []

		for (let x = 0; x < this.gameSession.BoardSize; x++) {
			for (let y = 0; y < this.gameSession.BoardSize; y++) {
				if (valid[x][y]) {
					positions.push({ x: x as Data.Coord, y: y as Data.Coord })
				}
			}
		}

		return positions
	}
	public IsValidMove(pos: Data.Position): boolean {
		const valid = this.GetValidMoves()
		return valid[pos.x][pos.y]
	}

	public OnGameStart(session: GameSession, color: Data.KStone) {
		this.gameSession = session
		if (this.Type == 'ai') {
			this.color = color
		}
		this.IsPlaying = true
	}
	public OnGameEnd() {
		this.IsPlaying = false
	}

	// public OnOpponentMove() { }

	public GetRandomMove(): Data.Position | null {
		const valid = this.ns.go.analysis.getValidMoves(this.color === 'white')
		const coords: [Data.Coord, Data.Coord][] = []

		for (let x = 0; x < this.gameSession.BoardSize; x++) {
			for (let y = 0; y < this.gameSession.BoardSize; y++) {
				if (valid[x][y] && this.gameSession.BoardState[x][y] == Data.NodeState.empty) {
					coords.push([x as Data.Coord, y as Data.Coord])
				}
			}
		}

		if (coords.length == 0) {
			return null
		}

		const pick = coords[Math.floor(Math.random() * coords.length)]
		return { x: pick[0], y: pick[1] }
	}

	public CountStones(board: Data.BoardState = this.gameSession.BoardState): number {
		return this.gameSession.CountStones(board)[this.color]
	}

	public CalculateMoveReward(doLog: boolean = false) {
		const log = (...msg: string[]) => {
			if (!doLog) {
				return
			}
			this.log(...msg)
		}
		// this.log(`${this.Type} Getting rewards: ${this.go.getCurrentPlayer()}`)
		const boardBefore = this.gameSession.BoardHistory[this.gameSession.BoardHistory.length - 2]
		const boardAfter = this.gameSession.BoardHistory[this.gameSession.BoardHistory.length - 1]
		let reward = 0

		// 1. CAPTURED STONES (easiest - just count pieces)
		const stonesBefore = this.gameSession.CountStones(boardBefore)
		const stonesAfter = this.gameSession.CountStones(boardAfter)
		const captured = stonesBefore[this.OpponentColor] - stonesAfter[this.OpponentColor]
		reward += captured
		log(`Captre:\t ${captured}`)

		// 2. TERRITORY CLAIMED (built-in API!)
		const territoryBefore = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes(boardBefore) as Data.BoardState)
		const territoryAfter = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes(boardAfter) as Data.BoardState)
		const territory = territoryAfter - territoryBefore
		reward += territory * 2
		log(`Territ:\t ${territory}`)

		// 3. LIBERTIES (sum them from the API)
		const libertiesBefore = this.gameSession.Liberties(boardBefore)
		const libertiesAfter = this.gameSession.Liberties(boardAfter)
		const liberty = libertiesAfter[this.color] - libertiesBefore[this.color]
		reward += liberty
		log(`Libert:\t ${liberty}`)

		const stats = this.go.getGameState()
		const statScore = (this.isWhite) ? stats.whiteScore : stats.blackScore
		const oppScore = (!this.isWhite) ? stats.whiteScore : stats.blackScore
		const scoreDiff = statScore - oppScore
		// const scoreRatio = scoreDiff / statScore

		let result = reward
		result += result * scoreDiff
		return result
	}
}


