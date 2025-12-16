
export function main(ns: NS) {
	ns.tprint('Prototype')
	// ns.run('managers/hacknet.ts!')
	ns.tprint(ns.getMoneySources().sinceInstall.hacknet)
	ns.tprint(ns.getMoneySources().sinceInstall.hacknet_expenses)
	ns.tprint(ns.getMoneySources().sinceInstall.hacknet - ns.getMoneySources().sinceInstall.hacknet_expenses)
}






