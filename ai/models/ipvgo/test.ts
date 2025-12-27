import { Logger } from '../../../logging/index.ts'
import { GameSession } from './game/gameSession.ts'
import { GoAI5 } from './ipvgo.ts'
import { AIPlayer } from './player/aiPlayer.ts'
import { ManualPlayer } from './player/manualPlayer.ts'
import { NPCPlayer } from './player/npcPlayer.ts'


const winThreshold = 50

export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.clearLog()
	console.clear()
	const logger = new Logger(ns)

	// const p1 = new ManualPlayer(ns)
	let p1 = new AIPlayer(ns)

	let p2 = new AIPlayer(ns)
	// const p2 = new NPCPlayer(ns, 'Netburners')


	let gameCount = 0

	const session = new GameSession(ns, 5, p1, p2)
	ns.go.analysis.resetStats()

	while (true) {
		session.Restart()
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

		gameCount++
		// const stats = ns.go.analysis.getStats()['No AI']
		const stats = session.Stats
		if (!stats) {
			continue
		}
		if (gameCount >= winThreshold && (stats.Won >= winThreshold || stats.Lost >= winThreshold)) {
			if (stats.Won == stats.Lost) {
				continue
			}

			logger.log(`\n---- Game Over ----`)

			let winner = 'Player1'
			let loser = 'Player2'

			if (stats.Won < stats.Lost) {
				winner = 'Player2'
				loser = 'Player1'
			}

			logger.log(`Regenerating: ${session[loser].Color}`)
			session[loser] = new AIPlayer(ns)

			ns.go.analysis.resetStats()

			session.Reset()
			gameCount = 0
			logger.log('\n\n')
		}
	}

}
