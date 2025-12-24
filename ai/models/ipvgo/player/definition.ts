import { Logger } from '../../../../logging/index.ts'
import * as Data from '.././data.ts'
import { GameSession } from '../game/gameSession.ts'

export abstract class AGoPlayer {
	protected gameSession: GameSession
	public IsPlaying: boolean = false

	constructor(
		private ns: NS,
		public Type: Data.KPlayerType,
		public StoneType: Data.KStone,
	) { }

	public abstract DoMove()
	public abstract WaitForMove(): Promise<void>

	public get go() {
		return this.ns.go
	}

	public get Opponent(): Data.KStone {
		return this.StoneType == 'black' ? 'white' : 'black'
	}

	private get isWhite(): boolean {
		return this.StoneType == 'white'
	}

	protected move(pos: Data.Position) {
		// TODO: add error handling
		this.go.makeMove(pos.x, pos.y, this.isWhite)
	}
	protected pass() {
		this.go.passTurn(this.isWhite)
	}
	protected wait(): ReturnType<typeof this.go.opponentNextTurn> {
		return this.go.opponentNextTurn(false, this.isWhite)
	}

	public OnGameStart(session: GameSession) {
		this.gameSession = session
		this.IsPlaying = true
	}
	public OnGameEnd() {
		this.IsPlaying = false
	}

	public GetRandomMove(): Data.Position | null {
		const valid = this.ns.go.analysis.getValidMoves(this.StoneType === 'white')
		const coords: [number, number][] = []

		for (let x = 0; x < this.gameSession.BoardSize; x++) {
			for (let y = 0; y < this.gameSession.BoardSize; y++) {
				if (valid[x][y] && this.gameSession.BoardState[x][y] == Data.NodeState.empty) {
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

	public CountStones(board: Data.BoardState = this.gameSession.BoardState): number {
		return this.gameSession.CountStones(board)[this.StoneType]
	}

	public CalculateMoveReward() {
		const boardBefore = this.gameSession.BoardHistory[this.gameSession.BoardHistory.length - 2]
		const boardAfter = this.gameSession.BoardHistory[this.gameSession.BoardHistory.length - 1]
		let reward = 0

		// 1. CAPTURED STONES (easiest - just count pieces)
		const stonesBefore = this.gameSession.CountStones(boardBefore)
		const stonesAfter = this.gameSession.CountStones(boardAfter)
		const capturedStones = stonesBefore[this.Opponent] - stonesAfter[this.Opponent]
		reward += capturedStones * 10

		// 2. TERRITORY CLAIMED (built-in API!)
		const territoryBefore = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes() as unknown as Data.BoardState)
		// Make the move happens here in your actual code
		const territoryAfter = this.CountStones(this.ns.go.analysis.getControlledEmptyNodes() as unknown as Data.BoardState)
		const territoryClaimed = territoryAfter - territoryBefore
		reward += territoryClaimed * 2

		// 3. LIBERTIES (sum them from the API)
		const libertiesBefore = this.gameSession.SumPlayerLiberties(boardBefore)
		const libertiesAfter = this.gameSession.SumPlayerLiberties(boardAfter)
		const libertyChange = libertiesAfter - libertiesBefore
		reward += libertyChange * 0.5

		// 4. GOT CAPTURED (check if we lost stones)
		const ourLostStones = stonesBefore[this.Opponent] - stonesAfter[this.Opponent]
		reward += ourLostStones * -15

		return reward
	}
}


