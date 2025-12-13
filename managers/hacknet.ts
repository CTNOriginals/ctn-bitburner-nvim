
const HacknetNodeConstants = {
	MoneyGainPerLevel: 1.5,

	BaseCost: 1000,
	LevelBaseCost: 500,
	RamBaseCost: 30e3,
	CoreBaseCost: 500e3,

	PurchaseNextMult: 1.85,
	UpgradeLevelMult: 1.04,
	UpgradeRamMult: 1.28,
	UpgradeCoreMult: 1.48,

	MaxLevel: 200,
	MaxRam: 64,
	MaxCores: 16,
} as const;

const ENode = {
	node: "node",
	level: "level",
	ram: "ram",
	cores: "cores",
} as const

type TENode = keyof typeof ENode

class NodeComponent {
	public GetCost: (i: number, n?: number) => number
	public Upgrade: (i: number, n?: number) => number | boolean
	public MaxValue: number

	constructor(private ns: NS, public Typ: TENode) {
		switch (Typ) {
			case ENode.node: {
				this.GetCost = ns.hacknet.getPurchaseNodeCost
				this.Upgrade = ns.hacknet.purchaseNode
				this.MaxValue = ns.hacknet.maxNumNodes()
			} break;
			case ENode.level: {
				this.GetCost = ns.hacknet.getLevelUpgradeCost
				this.Upgrade = ns.hacknet.upgradeLevel
				this.MaxValue = HacknetNodeConstants.MaxLevel
			} break;
			case ENode.ram: {
				this.GetCost = ns.hacknet.getRamUpgradeCost
				this.Upgrade = ns.hacknet.upgradeRam
				this.MaxValue = HacknetNodeConstants.MaxRam
			} break;
			case ENode.cores: {
				this.GetCost = ns.hacknet.getCoreUpgradeCost
				this.Upgrade = ns.hacknet.upgradeCore
				this.MaxValue = HacknetNodeConstants.MaxCores
			} break;
		}
	}

	public GetValue(i: number): number {
		if (this.Typ == ENode.node) {
			return i
		}

		return this.ns.hacknet.getNodeStats(i)[this.Typ]
	}

	public IsMax(i: number): boolean {
		return this.GetValue(i) >= this.MaxValue
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

	public StringValue(seperator: string = '\n'): string {
		let lines: string[] = []

		for (const name in this.Components) {
			const comp = this.Components[name as TENode]

			lines.push(`${name}:${comp.GetValue(this.Index)}`)
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
		ns.tprint(node.StringValue(' '))
	}
}






