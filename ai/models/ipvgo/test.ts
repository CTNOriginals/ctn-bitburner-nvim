import { Logger } from '../../../logging/index.ts'
import { GameSession } from './game/gameSession.ts'
import { AIPlayer } from './player/aiPlayer.ts'
import { ManualPlayer } from './player/manualPlayer.ts'
import { NPCPlayer } from './player/npcPlayer.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	const p1 = new ManualPlayer(ns)
	// const p1 = new AIPlayer(ns)

	const p2 = new AIPlayer(ns)
	// const p2 = new NPCPlayer(ns, 'Netburners')

	const master = new GameSession(ns, 5, p1, p2)

	while (true) {
		await master.Start()
		await ns.asleep(10)
	}

	logger.log('Game done')
}
