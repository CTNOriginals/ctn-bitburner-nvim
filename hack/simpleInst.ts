
export async function main(ns: NS) {
	ns.disableLog('ALL')
	const host = ns.args[0] as string

	if (host == 'home') {
		return
	}

	while (true) {
		ns.print(`Weaken: ${await ns.weaken(host)}`)
		ns.print(`Grow: ${await ns.grow(host)}`)
		ns.print(`Weaken: ${await ns.weaken(host)}`)
		ns.print(`Hack: ${await ns.hack(host)}`)

		ns.print(' ')
	}
}
