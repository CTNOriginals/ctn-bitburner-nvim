import { Logger } from "../../logging/index.ts";

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const now = new Date()

	logger.log(`Testing args - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
}
