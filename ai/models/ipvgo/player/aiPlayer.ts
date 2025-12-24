import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class AIPlayer extends AGoPlayer {
	constructor(ns: NS, stoneType: Data.KStone) {
		super(ns, 'ai', stoneType)
	}

	public DoMove() {
		const pos = this.GetRandomMove()

		if (!pos) {
			this.pass()
			return
		}

		this.move(pos)
	}

	public async WaitForMove(): Promise<void> {
		await this.wait()
	}
}
