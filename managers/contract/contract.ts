import { Logger } from '../../logging/index.ts'
import * as Worm from '../../hack/worm.ts'
import * as Data from './data.ts'

export class Contract {
	public Data: CodingContractObject

	constructor(
		private ns: NS,
		public Host: string,
		private file: string
	) {
		this.Data = ns.codingcontract.getContract(file, Host)
	}
}

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	for (const ctyp in Data.ContractType) {
		const name = Data.ContractType[ctyp as Data.KContractType]
		ns.codingcontract.createDummyContract(name, ns.getHostname())
	}

	await Worm.ServerWorm(ns, ns.getHostname(), (server: Server) => {
		const host = server.hostname
		const files = ns.ls(host, '.cct')

		log(`${host}: ${files.length}`)
		for (const file of files) {
			solve(ns, host, file)
		}
		log(`\n\n`)
	}, false, false, true)
}

function solve(ns: NS, host: string, file: string): boolean {
	const contract = ns.codingcontract.getContract(file, host)



	return false
}
