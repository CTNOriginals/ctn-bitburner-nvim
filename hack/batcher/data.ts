export type TServer = Required<Server>
export type THostMap<T> = { [host: string]: T }

export type TGetter = (host: string) => number
export class MinMaxGetter {
	constructor(
		private host: string,
		private minGetter: TGetter,
		private currentGetter: TGetter,
		private maxGetter: TGetter,
	) { }

	public get Min(): ReturnType<typeof this.minGetter> {
		return this.minGetter(this.host)
	}
	public get Current(): ReturnType<typeof this.currentGetter> {
		return this.currentGetter(this.host)
	}
	public get Max(): ReturnType<typeof this.maxGetter> {
		return this.maxGetter(this.host)
	}

	public DiffMin(): number {
		return this.Current - this.Min
	}
	public DiffMax(): number {
		return this.Max - this.Current
	}

	public IsMin(): boolean {
		return this.DiffMin() == 0
	}
	public IsMax(): boolean {
		return this.DiffMax() == 0
	}
}

export class MinMaxSecurity extends MinMaxGetter {
	constructor(ns: NS, host: string) {
		super(host,
			ns.getServerMinSecurityLevel,
			ns.getServerSecurityLevel,
			ns.getServerBaseSecurityLevel
		)
	}
}
export class MinMaxMoney extends MinMaxGetter {
	constructor(ns: NS, host: string) {
		super(host,
			(_) => 0,
			ns.getServerMoneyAvailable,
			ns.getServerMaxMoney
		)
	}
}

