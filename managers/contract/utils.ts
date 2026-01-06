import * as Data from './data.ts'

export function GetContractTypeByName(name: Data.VContractType): Data.KContractType {
	const keys = Object.keys(Data.ContractType)
	const vals = Object.values(Data.ContractType)
	return keys[vals.indexOf(name)] as Data.KContractType
}

export function GetContractByType<T extends Data.KContractType>(ns: NS, type: T): Extract<CodingContractObject, { type: T }> | null {
	const files = ns.ls('home', '.cct')

	for (const file of files) {
		const contract = ns.codingcontract.getContract(file)

		if (GetContractTypeByName(contract.type) == type) {
			return contract as Extract<CodingContractObject, { type: T }>
		}
	}

	return null
}

export function GetSolverPath(type: Data.KContractType): string {
	return `/managers/contract/solvers/${type}.ts`
}

export function SolverExists(ns: NS, type: Data.KContractType): boolean {
	return ns.fileExists(GetSolverPath(type))
}


