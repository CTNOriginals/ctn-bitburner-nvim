import { Logger } from '../../../logging/index.ts'
import { GameSession } from './game/gameSession.ts'
import { GoAI5 } from './ipvgo.ts'
import { AIPlayer } from './player/aiPlayer.ts'
import { ManualPlayer } from './player/manualPlayer.ts'
import { NPCPlayer } from './player/npcPlayer.ts'


const winThreshold = 50
const exportPath = 'ai/models/ipvgo/export'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.clearLog()
	console.clear()
	const logger = new Logger(ns)

	// const p1 = new ManualPlayer(ns)
	let p1 = new AIPlayer(ns)

	let p2 = new AIPlayer(ns)
	// const p2 = new NPCPlayer(ns, 'Netburners')

	const exports = ns.ls('home', exportPath)
	if (exports.length > 0) {
		const path = exports[exports.length - 1]
		p1.ai.Import(ns, path)
		p2.ai.Import(ns, path)

		p1.ai.neuralNetwork = p1.ai.GetNeuralNetworkMutation()
		p2.ai.neuralNetwork = p2.ai.GetNeuralNetworkMutation()
	}

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

		if (p1.Type !== 'ai' || p2.Type !== 'ai') {
			continue
		}

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
			console.log(session.Stats)

			let winner = 'Player1'
			let loser = 'Player2'

			const ratio = session.Stats.GetRatio()
			// if (stats.Won < stats.Lost) {
			if (ratio < 0) {
				winner = 'Player2'
				loser = 'Player1'
			}

			const winnerAI = session[winner] as AIPlayer
			const newAI = new AIPlayer(ns)
			const time = new Date()
			const suffix = `${time.getMonth() + 1}-${time.getDate()}_${time.getHours()}`
			const path = `${exportPath}/goai_${suffix}.json`

			logger.log(`Exporting: ${winnerAI.Color} to ${path}`)
			winnerAI.ai.Export(ns, path)

			const exports = ns.ls('home', exportPath)
			if (exports.length > 5) {
				ns.rm(exports[0])
			}

			// Mutate the winner's neural network and assign it to the loser
			newAI.ai.neuralNetwork = winnerAI.ai.GetNeuralNetworkMutation(0.25)
			session[loser] = newAI

			ns.go.analysis.resetStats()

			session.Reset()
			gameCount = 0
			logger.log('\n\n')
		}
	}

}
