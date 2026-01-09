import { Logger } from '../logging/index.ts'

export async function ServerWorm(
	ns: NS,
	host: string,
	func: (server: Required<Server>, parent: string) => void | Promise<void>,
	requireRoot: boolean = true,
	tryGetRoot: boolean = true,
	skipHome: boolean = true,
	seen: string[] = [],
) {
	const scan = ns.scan(host)
	const player = ns.getPlayer()

	const children: string[] = []

	for (const sub of scan) {
		if (seen.includes(sub)) {
			continue
		}
		seen.push(sub)

		if (skipHome && sub == 'home') {
			continue
		}

		const server = ns.getServer(sub)

		if (!server.hasAdminRights) {
			let getRootAttemt = false

			if (tryGetRoot) {
				getRootAttemt = getRoot(ns, sub)
			}

			if (requireRoot && !getRootAttemt) {
				continue
			}
		}

		// Get the server again to make sure the data is up to date
		await func(ns.getServer(sub) as Required<Server>, host)
		children.push(sub)
		// await ServerWorm(ns, sub, func, tryGetRoot, requireRoot, skipHome, seen)

		// const childServers = ns.scan(sub)
		// for (const child of childServers) {
		// 	if (scan.includes(child)) {
		// 		continue
		// 	}
		//
		// 	scan.push(child)
		// }
	}

	for (const child of children) {
		await ServerWorm(ns, child, func, requireRoot, tryGetRoot, skipHome, seen)
	}
}

function getRoot(ns: NS, host: string): boolean {
	const server = ns.getServer(host)

	if ((server.numOpenPortsRequired ?? 0) > crackPorts(ns, host)) {
		ns.print(`Failed to open enough ports for ${host}`)
		return false
	}

	return ns.nuke(host)
}

function crackPorts(ns: NS, host: string): number {
	const funcs = [
		ns.brutessh,
		ns.ftpcrack,
		ns.relaysmtp,
		ns.httpworm,
		ns.sqlinject,
	]

	let count = 0
	for (const f of funcs) {
		if (f(host)) {
			count++
		}
	}

	return count
}
