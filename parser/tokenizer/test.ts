import * as tokenizer from './index.ts'
import { Logger } from '../../logging/index.ts'

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

}
