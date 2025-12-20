import { Logger } from "./logging/index.ts"

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const host = ns.getHostname()

	const list = ns.ls(host)
	logger.log(list.join('\n'))
}
