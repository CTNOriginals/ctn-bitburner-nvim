import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class NPCPlayer extends AGoPlayer {
	constructor(ns: NS, public Name: GoOpponent) {
		super(ns, 'npc')
	}

	public override async Wait(): Promise<any> {
		// const prev = this.go.getGameState().previousMove

		return await new Promise((res) => {
			setInterval(() => {
				// this.log(this.go.getCurrentPlayer())
				// if (prev !== this.go.getGameState().previousMove) {
				if (this.go.getCurrentPlayer() != 'White') {
					return res(null)
				}
			}, 1)
		})

		// return this.go.opponentNextTurn(false, true)
	}
}
