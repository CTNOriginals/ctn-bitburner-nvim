import { Logger } from '../../../logging/index.ts'
import { GameSession } from './game/gameSession.ts'
import { GoAI5 } from './ipvgo.ts'
import { AIPlayer } from './player/aiPlayer.ts'
import { ManualPlayer } from './player/manualPlayer.ts'
import { NPCPlayer } from './player/npcPlayer.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.clearLog()
	console.clear()
	const logger = new Logger(ns)

	// const p1 = new ManualPlayer(ns)
	let p1 = new AIPlayer(ns)

	let p2 = new AIPlayer(ns)
	// const p2 = new NPCPlayer(ns, 'Netburners')

	const session = new GameSession(ns, 5, p1, p2)
	ns.go.analysis.resetStats()

	let gameCount = 0

	while (true) {
		session.Reset()
		// ns.go.analysis.setTestingBoardState([
		// 	'X...#',
		// 	'..O..',
		// 	'.X.X.',
		// 	'..O..',
		// 	'#...O',
		// ], 0)
		ns.go.analysis.setTestingBoardState(ns.go.getBoardState(), 0)
		// logger.log(ns.go.analysis.getValidMoves())

		await session.Start()
		await ns.asleep(1)
		logger.log('Game Over\n\n')


		gameCount++
		if (gameCount >= 100) {
			const stats = ns.go.analysis.getStats()['No AI']
			if (!stats) {
				continue
			}

			if (stats.wins == stats.losses) {
				continue
			}

			if (stats.wins > stats.losses) {
				p2 = new AIPlayer(ns)
			} else {
				p1 = new AIPlayer(ns)
			}

			ns.go.analysis.resetStats()

			gameCount = 0
		}
	}

}
