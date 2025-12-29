import * as Data from './data.ts'

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


export class ServerController {
	private maxRam: number
	private cores: number

	private security = new MinMaxSecurity(this.ns, this.Target)
	private money = new MinMaxMoney(this.ns, this.Target)

	constructor(
		private ns: NS,
		public Target: string,
	) {
		this.cores = this.ns.getServer().cpuCores
	}

	public GetServer(): Data.TServer {
		return this.ns.getServer(this.Target) as Data.TServer
	}

	public GetTotalTime(): number {
		const server = this.GetServer()
		return this.ns.getWeakenTime(server.hostname)
			+ this.ns.getGrowTime(server.hostname)
			+ this.ns.getHackTime(server.hostname)
	}

	public GetScore(): number {
		const server = this.GetServer()
		const growth = server.serverGrowth
		const max = server.moneyMax
		const time = this.GetTotalTime()

		return (max / (100 - growth)) / time
	}

	public GetInfoString(): string {
		const nf = this.ns.format.number
		return [
			`${this.Target}:${" ".repeat(18 - this.Target.length)} `,
			`${nf(this.GetServer().moneyMax)}`,
			`\t${this.GetServer().serverGrowth}`,
			`\t${Math.round(this.GetTotalTime() / 1000)}`,
			`\t= ${nf(this.GetScore(), 2)}`,
		].join('')
	}

	public SetMaxRam(ram: number) {
		this.maxRam = ram
	}

	private getGrowThreadCount(): number {
		return Math.ceil(this.ns.growthAnalyze(
			this.Target,
			this.money.Max / this.money.Current,
			this.cores
		))
	}

	private getWeakenThreadCount() {
		const effect = this.ns.weakenAnalyze(1, this.ns.getServer().cpuCores)
		return Math.ceil((this.security.Max - this.security.Min) / effect)
	}

	private startGrow() {

	}

	/** Ensures that the server is maxed out before launching the first batching sequence.
	 * Once the server is maxed, this function will automatically start batching.
	*/
	public async Initialize() {
		if (!this.money.IsMax()) {
			this.getGrowThreadCount()
			this.ns.getGrowTime()
		}

		if (!this.security.IsMin()) {
		}
	}
}

