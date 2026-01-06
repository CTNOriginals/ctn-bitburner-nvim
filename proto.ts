export async function main(ns: NS) {
	const files = ns.ls('home', '.cct')

	for (const file of files) {
		const contract = ns.codingcontract.getContract(file)
		ns.print(`${file}: ${contract.difficulty} ${contract.type}`)
	}
}
