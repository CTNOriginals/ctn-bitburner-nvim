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

export function GetDummyContract(ns: NS, type: Data.KContractType): CodingContractObject {
	const name = Data.ContractType[type]
	let contract: CodingContractObject | null = GetContractByType(ns, type)

	if (contract != null) {
		return contract
	}

	const file = ns.codingcontract.createDummyContract(name)
	ns.print(`Created new contract: ${file}`)

	if (!file) {
		throw 'ContractTester: something went wront whole creating dummy file'
	}

	contract = ns.codingcontract.getContract(file)

	return contract
}

export function GetSolverPath(type: Data.KContractType): string {
	return `/managers/contract/solvers/${type}.ts`
}

export function SolverExists(ns: NS, type: Data.KContractType): boolean {
	return ns.fileExists(GetSolverPath(type))
}

export function FormatData(data: CodingContractObject['data'] | string[]): string {
	if (!Array.isArray(data)) {
		return data.toString()
	}

	let str = ""

	for (let i = 0; i < data.length; i++) {
		const item = data[i]
		if (!Array.isArray(item)) {
			let post = ', '

			if (data.length >= 10
				&& i < data.length - 1
				&& (i + 1) % 5 == 0
			) {
				post += '\n'
			}

			str += item + post
			continue
		} else if (i == 0) {
			str = '\n'
		}

		str += FormatData(item)

		if (i < data.length - 1) {
			str += '\n'
		}
	}

	if (data.length >= 10) {
		str = str.split('\n').join('\n  ')
		str = `\n  ${str}\n`
	}
	return `[ ${str}]`
}
