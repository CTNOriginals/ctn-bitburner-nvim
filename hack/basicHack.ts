export function main(ns: NS) {
	var host = (ns.args.length > 0) ? ns.args[0] as string : "home"

	var secLevel = ns.getServerSecurityLevel(host)
	var maxSec = ns.getServerMinSecurityLevel(host)

	var money = ns.getServerMoneyAvailable(host)
	var maxMoney = ns.getServerMaxMoney(host)

	var growth = ns.getServerGrowth(host)

	let msg = ns.sprintf("\n\n\ngrowth: %.2f\nsec: %.2f/%.2f\nmoney: %s/%s", growth, secLevel, maxSec, ns.format.number(money), ns.format.number(maxMoney))
	ns.tprint(msg)
}
