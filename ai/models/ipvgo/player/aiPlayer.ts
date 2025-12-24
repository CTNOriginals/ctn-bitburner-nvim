import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class AIPlayer extends AGoPlayer {
	constructor(ns: NS) {
		super(ns, 'ai')
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
