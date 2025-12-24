import { Logger } from '../../../logging/index.ts'
import { GameMaster } from './gameMaster.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	const master = new GameMaster(ns)

	await master.Start()
	logger.log('Game done')
}
