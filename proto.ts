const ENode = {
	node: "node",
	level: "level",
	ram: "ram",
	cores: "cores",
} as const

type TENode = keyof typeof ENode

class NodeComponent {
	public getCost: (i: number, n?: number) => number
	public upgrade: (i: number, n?: number) => number | boolean

	constructor(private ns: NS, public Typ: TENode) {
		switch (Typ) {
			case ENode.node: {
				this.getCost = ns.hacknet.getPurchaseNodeCost
				this.upgrade = ns.hacknet.purchaseNode
			} break;
			case ENode.level: {
				this.getCost = ns.hacknet.getLevelUpgradeCost
				this.upgrade = ns.hacknet.upgradeLevel
			} break;
			case ENode.ram: {
				this.getCost = ns.hacknet.getRamUpgradeCost
				this.upgrade = ns.hacknet.upgradeRam
			} break;
			case ENode.cores: {
				this.getCost = ns.hacknet.getCoreUpgradeCost
				this.upgrade = ns.hacknet.upgradeCore
			} break;
		}
	}

	public getValue(i: number): number {
		if (this.Typ == ENode.node) {
			return i
		}

		return this.ns.hacknet.getNodeStats(i)[this.Typ]
	}
}

class Node {
	public Components: { [key in TENode]: NodeComponent }

	constructor(ns: NS, public Index: number) {
		this.Components = {
			[ENode.node]: new NodeComponent(ns, ENode.node),
			[ENode.level]: new NodeComponent(ns, ENode.level),
			[ENode.ram]: new NodeComponent(ns, ENode.ram),
			[ENode.cores]: new NodeComponent(ns, ENode.cores),
		}
	}

	public String(seperator: string = '\n'): string {
		let lines: string[] = []
		for (const name in this.Components) {
			const comp = this.Components[name as TENode]

			lines.push(`${name}:${comp.getValue(this.Index)}`)
		}

		return lines.join(seperator)
	}
}


export function main(ns: NS) {
	ns.tprint("Hacking some nets!")

	const nodes: Node[] = []
	let numNodes = ns.hacknet.numNodes()

	for (let i = 0; i < numNodes; i++) {
		let stats = ns.hacknet.getNodeStats(i)

		nodes.push(new Node(ns, i))
	}

	for (const node of nodes) {
		ns.tprint(node.String(' '))
	}
}

