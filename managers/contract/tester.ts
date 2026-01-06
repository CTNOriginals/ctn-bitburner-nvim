import { Logger } from '../../logging/index.ts'
import * as Data from './data.ts'
import * as Utils from './utils.ts'

import * as dummy from './solvers/MinimumPathSumInATriangle.ts'

// const testData: Partial<Record<Data.KContractType, CodingContractObject['data']>> = {
// 	AlgorithmicStockTraderI: [
// 		[2],
// 		[2, 4],
// 	],
// }

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
	const contract = Utils.GetDummyContract(ns, type)

	const t1 = performance.now()
	const res = solver.Solve(contract.data, log)
	const t2 = performance.now()
	const submit = contract.submit(res)

	log([
		`\n\n---- SUBMISSION ${type} ---- `,
		`Input: ${Utils.FormatData(contract.data)}`,
		`Output: ${res} (${t2 - t1} ms)`,
		`Result: ${submit}`,
		`Remaining: ${contract.numTriesRemaining()}`
	].join('\n'))
}

function GetDummyContract(ns: NS, type: Data.KContractType): CodingContractObject {
	const name = Data.ContractType[type]
	let contract: CodingContractObject | null = Utils.GetContractByType(ns, type)

	if (contract == null) {
		const file = ns.codingcontract.createDummyContract(name)
		if (!file) {
			throw 'ContractTester: something went wront whole creating dummy file'
		}
		ns.print(`Created new contract: ${file}`)
		contract = ns.codingcontract.getContract(file)
	}

	return contract
}

export function autocomplete(): string[] {
	return Object.keys(Data.ContractType)
}
