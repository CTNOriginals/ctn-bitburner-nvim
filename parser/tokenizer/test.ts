import { Logger } from '../../logging/index.ts'
import * as tokenizer from './index.ts'

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	logger.log('waah')
}
