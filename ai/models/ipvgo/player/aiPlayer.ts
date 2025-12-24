import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class AIPlayer extends AGoPlayer {
	constructor(ns: NS) {
		super(ns, 'ai')
	}

	public Move() {
		const pos = this.GetRandomMove()

		if (!pos) {
			this.Pass()
			return
		}

		super.Move(pos)
	}
}
