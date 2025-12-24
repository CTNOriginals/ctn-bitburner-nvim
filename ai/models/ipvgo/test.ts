import { Logger } from '../../../logging/index.ts'
import { GameSession } from './gameSession.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	const master = new GameSession(ns)

	await master.Start()
	logger.log('Game done')
}
