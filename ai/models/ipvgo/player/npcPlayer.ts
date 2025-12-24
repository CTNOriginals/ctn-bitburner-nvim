import { AGoPlayer } from "./definition.ts";
import * as Data from '.././data.ts'

export class NPCPlayer extends AGoPlayer {
	constructor(ns: NS, public Name: GoOpponent) {
		super(ns, 'npc')
	}
}
