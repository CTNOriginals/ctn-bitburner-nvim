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

export const ENode = {
	node: "node",
	level: "level",
	ram: "ram",
	cores: "cores",
} as const

type TENode = keyof typeof ENode

export class NodeComponent {
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

export class Node {
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

