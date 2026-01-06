import { Logger } from '../../logging/index.ts'
import * as Data from './data.ts'
import * as Utils from './utils.ts'

import * as dummy from './solvers/MinimumPathSumInATriangle.ts'

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	const type = ns.args[0] as Data.KContractType

	if (!Utils.SolverExists(ns, type)) {
		log(`Solver for ${type} does not exist`)
		return
	}

	const solver: Data.TSolver = await ns.dynamicImport(Utils.GetSolverPath(type))
	const name = Data.ContractType[type]
	let contract: CodingContractObject | null = Utils.GetContractByType(ns, type)

	if (contract == null) {
		const file = ns.codingcontract.createDummyContract(name)
		if (!file) {
			log('something went wront')
			return
		}
		log(`Created new contract: ${file}`)
		contract = ns.codingcontract.getContract(file)
	}

	const res = solver.Solve(contract.data)
	const submit = contract.submit(res)
	log([
		`-- ${type} -- `,
		`Input: ${Utils.FormatData(contract.data)}`,
		`Output: ${res}`,
		`Result: ${submit}`,
		`Remaining: ${contract.numTriesRemaining()}`
	].join('\n'))
}

export function autocomplete(): string[] {
	return Object.keys(Data.ContractType)
}
