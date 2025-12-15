export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.print("Hacking some nets!")

	const nodes: Node[] = []
	let numNodes = ns.hacknet.numNodes()

	for (let i = 0; i < numNodes; i++) {
		nodes.push(new Node(ns, i))
	}

	while (true) {
		// sleep first to account for the chance of the loop continueing in the middle
		await ns.sleep(100)

		let bestComp = getCheapestUpgrade(nodes)

		if (!bestComp) {
			continue
		}

		if (ns.getPlayer().money > bestComp.GetCost()) {
			ns.print(bestComp.String())

			const i = bestComp.Upgrade()

			if (bestComp.Typ == ENode.node) {
				nodes.push(new Node(ns, i as number))
			}
		}
	}
}

function getCheapestUpgrade(nodes: Node[]): NodeComponent | null {
	let bestVal = -1
	let bestComp: NodeComponent | null = null

	for (const node of nodes) {
		let lowestVal: number = -1
		let lowestComp = node.Components[0]

		for (const compName in node.Components) {
			let comp: NodeComponent = node.Components[compName]

			if (comp.IsMax()) {
				continue
			}

			let cost = comp.GetCost()

			if (lowestVal > cost || lowestVal < 0) {
				lowestComp = comp
				lowestVal = cost
			}
		}

		if (bestVal > lowestVal || bestVal < 0) {
			bestVal = lowestVal
			bestComp = lowestComp
		}
	}

	return bestComp
}

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
	public MaxValue: number

	private getCost: (i: number, n?: number) => number
	private upgrade: (i: number, n?: number) => number | boolean

	constructor(private ns: NS, public Index: number, public Typ: TENode) {
		switch (Typ) {
			case ENode.node: {
				this.getCost = ns.hacknet.getPurchaseNodeCost
				this.upgrade = ns.hacknet.purchaseNode
				this.MaxValue = ns.hacknet.maxNumNodes()
			} break;
			case ENode.level: {
				this.getCost = ns.hacknet.getLevelUpgradeCost
				this.upgrade = ns.hacknet.upgradeLevel
				this.MaxValue = HacknetNodeConstants.MaxLevel
			} break;
			case ENode.ram: {
				this.getCost = ns.hacknet.getRamUpgradeCost
				this.upgrade = ns.hacknet.upgradeRam
				this.MaxValue = HacknetNodeConstants.MaxRam
			} break;
			case ENode.cores: {
				this.getCost = ns.hacknet.getCoreUpgradeCost
				this.upgrade = ns.hacknet.upgradeCore
				this.MaxValue = HacknetNodeConstants.MaxCores
			} break;
		}
	}

	public GetCost(n: number = 1): number {
		return this.getCost(this.Index, n)
	}

	public Upgrade(n: number = 1): boolean | number {
		return this.upgrade(this.Index, n)
	}

	public GetValue(): number {
		if (this.Typ == ENode.node) {
			return this.Index
		}

		return this.ns.hacknet.getNodeStats(this.Index)[this.Typ]
	}

	public IsMax(): boolean {
		return this.GetValue() >= this.MaxValue
	}

	public String() {
		return `${this.Index}[${this.Typ}]: value:${this.GetValue()} cost:${this.GetCost()} max:${this.IsMax()}`
	}
}

class Node {
	public Components: { [key in TENode]: NodeComponent }

	constructor(ns: NS, public Index: number) {
		this.Components = {
			[ENode.node]: new NodeComponent(ns, this.Index, ENode.node),
			[ENode.level]: new NodeComponent(ns, this.Index, ENode.level),
			[ENode.ram]: new NodeComponent(ns, this.Index, ENode.ram),
			[ENode.cores]: new NodeComponent(ns, this.Index, ENode.cores),
		}
	}

	public StringValue(seperator: string = '\n'): string {
		let lines: string[] = []

		for (const name in this.Components) {
			const comp = this.Components[name as TENode]

			lines.push(`${name}:${comp.GetValue()}`)
		}

		return lines.join(seperator)
	}


}








