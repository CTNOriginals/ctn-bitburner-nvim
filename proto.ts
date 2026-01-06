import * as Data from './managers/contract/data.ts'

export async function main(ns: NS) {
	const files = ns.ls('home', '.cct')
	const descriptions: string[] = []

	for (const type in Data.ContractType) {
		const name = Data.ContractType[type]
		const file = ns.codingcontract.createDummyContract(name)!
		const contract = ns.codingcontract.getContract(file)

		descriptions.push(`---- ${(name as string).toUpperCase()} (${contract.difficulty}) ----\n\t${contract.description.split('\n').join('\n\t')}\n\n\n\n`)
		ns.print(descriptions[descriptions.length - 1])
		ns.rm(file)
	}
}
