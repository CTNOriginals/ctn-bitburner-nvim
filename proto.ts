export function main(ns: NS) {
	enum ENode {
		Node,
		Level,
		Ram,
		Core
	}

	class NodeComponent {
		public Typ: ENode = ENode.Node

		private costFn: (i: number, n?: number) => number
		private upgradeFn: (i: number, n?: number) => number | boolean

		constructor(typ: ENode) {
			this.Typ = typ

			switch (typ) {
				case ENode.Node: {
					this.costFn = ns.hacknet.getPurchaseNodeCost
					this.upgradeFn = ns.hacknet.purchaseNode
				} break;
				case ENode.Level: {
					this.costFn = ns.hacknet.getLevelUpgradeCost
					this.upgradeFn = ns.hacknet.upgradeLevel
				} break;
				case ENode.Ram: {
					this.costFn = ns.hacknet.getRamUpgradeCost
					this.upgradeFn = ns.hacknet.upgradeRam
				} break;
				case ENode.Core: {
					this.costFn = ns.hacknet.getCoreUpgradeCost
					this.upgradeFn = ns.hacknet.upgradeCore
				} break;
			}
		}
	}

	class Node {
		constructor(public Index: number) {

		}
	}

	ns.tprint("Hacking some nets!")

	let numNodes = ns.hacknet.numNodes()

	for (let i = 0; i < numNodes; i++) {
		let stats = ns.hacknet.getNodeStats(i)

		ns.tprint([
			`Node ${i}:`,
			`level:${stats.level}`,
			`ram:${stats.ram}`,
			`cores:${stats.cores}`,
		].join(' '))


	}
}

