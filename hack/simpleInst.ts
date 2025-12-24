
export async function main(ns: NS) {
	ns.disableLog('ALL')
	const host = ns.args[0] as string

	if (host == 'home') {
		return
	}

	const print = ns.print

	while (true) {
		print(`Weaken: ${ns.format.number(await ns.weaken(host))}\t ${host}`)
		print(`Grow:   ${ns.format.number(await ns.grow(host))}\t ${host}`)
		print(`Weaken: ${ns.format.number(await ns.weaken(host))}\t ${host}`)
		print(`Hack:   ${ns.format.number(await ns.hack(host))}\t ${host}`)

		ns.print(' ')
	}
}
