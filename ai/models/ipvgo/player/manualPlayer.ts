import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class ManualPlayer extends AGoPlayer {
	constructor(ns: NS) {
		super(ns, 'manual')
	}

	public override async Wait(): Promise<any> {
		const prev = this.go.getGameState().previousMove

		await new Promise((res) => {
			setInterval(() => {
				if (this.go.getCurrentPlayer() != 'Black') {
					// if (prev !== this.go.getGameState().previousMove) {
					return res(null)
				}
			}, 10)
		})

		return this.go.opponentNextTurn(false, true)
	}
}
