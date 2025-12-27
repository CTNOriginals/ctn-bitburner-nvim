import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'
import { GoAI5 } from "../ipvgo.ts";
import { GameSession } from "../game/gameSession.ts";
import { AAIDef } from "../../../definition.ts";

export class AIPlayer extends AGoPlayer {
	public ai: GoAI5
	public scoreMult: number = 0.1;

	private config = {
		allowPass: false
	} as const

	private moveID: number = 0

	private onInvalidMoveCacheID: number = -1
	private onInvalidMoveCache: Data.Position[]

	constructor(ns: NS) {
		super(ns, 'ai')
		this.ai = new GoAI5(ns)
	}

	// For initial testing
	// public override OnGameStart(session: GameSession, color: Data.KStone): void {
	// 	super.OnGameStart(session, color)
	// }

	public override OnGameEnd(): void {
		super.OnGameEnd()
		// TODO: Log average score
	}

	private getMove(): typeof this.ai.TOut {
		const inputs = this.ai.GetInputFromBoard(this.gameSession.BoardState)
		let result = this.ai.Test(inputs)
		// if (!this.config.allowPass) {
		// 	result = { x: result.x, y: result.y, action: 'move' }
		// }
		return result
	}
	private getPos(move: typeof this.ai.TOut): Data.Position {
		return { x: move.x, y: move.y }
	}

	private onInvalidMove(move: typeof this.ai.TOut) {
		if (this.onInvalidMoveCacheID != this.moveID) {
			this.onInvalidMoveCacheID = this.moveID
			this.onInvalidMoveCache = this.GetValidPositions()
		}

		let valid = this.onInvalidMoveCache
		const rate = valid.length / this.gameSession.BoardSize

		// for (const pos of valid) {
		// 	const target: typeof move = { x: pos.x, y: pos.y, action: 'move' }
		// 	this.ai.Feedback(this.ai.GetOutputValues(target), 0.1)
		// }
		this.Feedback(move, -1)
	}

	private getValidMove(): typeof this.ai.TOut {
		let move = this.getMove()

		if (move.action == 'pass') {
			return move
		}

		let pos = this.getPos(move)
		const valid = this.GetValidMoves()

		let retries = 0
		// while (move.action != 'pass' && !this.IsValidMove(this.getPos(move))) {
		while (!valid[pos.x][pos.y]) {
			// TODO: Adjust this value based on possible moves on board
			this.onInvalidMove(move)

			if (retries >= 100) {
				const random = this.GetRandomMove()
				const rng = this.GetRandomMove()
				// this.log(`${this.Color}: Max retries reached`)
				if (!rng || true) {
					move = { action: 'pass', x: move.x, y: move.y }
					// } else {
					// 	move = { action: 'move', x: rng.x, y: rng.y }
				}
				break
			}

			retries++
			move = this.getMove()
			pos = this.getPos(move)
		}

		return move
	}

	public override async Move() {
		let move = this.getValidMove()
		let pos = this.getPos(move)
		let score = 0
		// this.log(`Retries: ${retries}`)

		// this.log(inputs)
		// this.log(move)
		this.moveID++

		if (move.action == 'pass') {
			score -= this.GetValidPositions().length * 0.01
			// TODO: Give the ai a score based on how many viable
			// moves it could have made instead of passing
			super.Pass()
			// score -= 1
			// this.ai.Feedback(this.ai.GetOutputValues(move), -1)
		} else {
			const before = this.go.getGameState()
			super.Move(pos)
			const after = this.go.getGameState()

			score += after[this.Color + 'Score'] - before[this.Color + 'Score']
			score += this.CalculateMoveReward() * 0.001
		}

		// this.log(score)
		this.Feedback(move, (score > 0.1) ? 0 : score)

		// this.log(score)
		// this.log('\n\n')
	}

	public Feedback(move: typeof this.ai.TOut, score) {
		this.ai.Feedback(this.ai.GetOutputValues(move), score * this.scoreMult)
	}

	public override GetRandomMove(): Data.Position | null {
		const count = this.gameSession.CountStones()
		if (count[this.OpponentColor] < 2 && count[this.Color] > 1) {
			return null
		}

		return super.GetRandomMove()
	}
}
