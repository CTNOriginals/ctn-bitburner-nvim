import { Logger } from '../../logging/index.ts'
import * as Data from './data.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)
	const args = ns.args as string[]

	if (args.length > 0 && args[0] in Data.ContractType) {
		const type = args[0]
		LogDescription(ns, type as Data.KContractType)
		return
	}

	for (const type in Data.ContractType) {
		LogDescription(ns, type as Data.KContractType)
	}
}

function LogDescription(ns: NS, type: Data.KContractType) {
	const name = Data.ContractType[type]
	const file = ns.codingcontract.createDummyContract(name)!
	const contract = ns.codingcontract.getContract(file)
	const desc = `\n---- ${(name as string).toUpperCase()} (${contract.difficulty}) ----\n\t${contract.description.split('\n').join('\n  ')}\n\n\n\n`

	ns.tprint(desc)
	ns.rm(file)
}

export function autocomplete(): string[] {
	return Object.keys(Data.ContractType)
}
