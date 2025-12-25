import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'
import { GoAI5 } from "../ipvgo.ts";

export class AIPlayer extends AGoPlayer {
	private ai: GoAI5
	constructor(ns: NS) {
		super(ns, 'ai')
		this.ai = new GoAI5()
	}

	public override Move() {
		const pos = this.GetRandomMove()

		if (!pos) {
			this.Pass()
			return
		}

		super.Move(pos)
	}

	public override GetRandomMove(): Data.Position | null {
		const count = this.gameSession.CountStones()
		if (count[this.OpponentColor] < 2 && count[this.color] > 1) {
			return null
		}

		return super.GetRandomMove()
	}
}
