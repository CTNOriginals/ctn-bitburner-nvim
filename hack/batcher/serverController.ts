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

	private security = new MinMaxSecurity(this.ns, this.Target)
	private money = new MinMaxMoney(this.ns, this.Target)

	/** The server will run the batches
	 * Defaults to the server this script is running on
	*/
	private hostServer: Data.TServer;
	/** The extra amount of milliseconds each timeout will spent */
	private timeGap = 1000

	constructor(
		private ns: NS,
		public Target: string,
		private hackPercent: number,
		private batchScripts: Data.TBatchScript,
	) {
		if (hackPercent <= 0 || hackPercent > 1) {
			ns.tprint([
				`ServerConstroller(${Target}) hackPercent expects a value between > 0 and 1`,
				`but received ${hackPercent}.`,
				`The value will be set to 0.5.`
			].join(' '))
			this.hackPercent = 0.5
		}

		this.hostServer = ns.getServer(ns.getHostname()) as Data.TServer
	}

	public GetServer(): Data.TServer {
		return this.ns.getServer(this.Target) as Data.TServer
	}

	public GetDuration(type: keyof Data.TBatchScript): number {
		switch (type) {
			case 'hack': return this.ns.getHackTime(this.Target)
			case 'grow': return this.ns.getGrowTime(this.Target)
			case 'weaken': return this.ns.getWeakenTime(this.Target)
		}
	}

	public GetScore(): number {
		const server = this.GetServer()
		const growth = server.serverGrowth
		const max = server.moneyMax
		const time = this.GetDuration('weaken')

		return (max / (100 - growth)) / time
	}

	public GetInfoString(): string {
		const nf = this.ns.format.number
		return [
			`${this.Target}:${" ".repeat(18 - this.Target.length)} `,
			`${nf(this.GetServer().moneyMax)}`,
			`\t${this.GetServer().serverGrowth}`,
			`\t${Math.round(this.GetDuration('weaken') / 1000)}`,
			`\t= ${nf(this.GetScore(), 2)}`,
		].join('')
	}

	public SetMaxRam(ram: number) {
		this.maxRam = ram
	}

	private getRamCost(type: Data.KBatchScript, threads: number = 1): number {
		return this.ns.getScriptRam(this.batchScripts[type], this.hostServer.hostname) * threads
	}

	private getHackThreadCount(): number {
		const targetMoney = this.money.Max * this.hackPercent
		return Math.ceil(this.ns.hackAnalyzeThreads(this.Target, targetMoney))
	}

	private getGrowThreadCount(): number {
		const growMult = this.money.Max / (this.money.Max * this.hackPercent)
		return Math.ceil(this.ns.growthAnalyze(this.Target, growMult, this.hostServer.cpuCores))
	}

	// private getWeakenThreadCount(type: Exclude<keyof Data.TBatchScript, 'weaken'>): number;
	// private getWeakenThreadCount(threads: number): number;
	private getWeakenThreadCount(type_threads: Exclude<keyof Data.TBatchScript, 'weaken'> | number): number {
		const weakenStep = this.ns.weakenAnalyze(1, this.hostServer.cpuCores)
		let effect = 0
		if (typeof type_threads == 'string') {
			effect = (type_threads == 'hack')
				? this.ns.hackAnalyzeSecurity(this.getHackThreadCount(), this.Target)
				: this.ns.growthAnalyzeSecurity(this.getGrowThreadCount(), this.Target, this.hostServer.cpuCores)
		} else {
			effect = type_threads
		}

		return Math.ceil((effect - this.security.Min) / weakenStep)
	}

	private startTimeout(type: keyof Data.TBatchScript, callback: () => any) {
		let duration = this.GetDuration(type) + this.timeGap
		setTimeout(() => {
			callback()
		}, duration)
	}

	private startBatch(type: keyof Data.TBatchScript, threads: number): number {
		const file = this.batchScripts[type]
		const host = this.hostServer.hostname

		if (!this.ns.fileExists(file)) {
			this.ns.tprintf(
				'File does not exist on this server\nFile: %s\nHost: %s',
				file, this.ns.getHostname()
			)

			return -1
		}

		if (!this.ns.fileExists(file, host)) {
			const copied = this.ns.scp(file, host)

			if (!copied) {
				this.ns.tprintf(
					'Unable to copy file to target server\nFile: %s\nHost: %s',
					file, host
				)

				return -1
			}
		}

		return this.ns.exec(file, host, { threads: threads })
	}

	private startHack(threads: number = this.getHackThreadCount()) {
		this.startBatch('hack', threads)
	}
	private startGrow(threads: number = this.getGrowThreadCount()) {
		this.startBatch('grow', threads)
	}

	private startWeaken(type_threads: Exclude<keyof Data.TBatchScript, 'weaken'> | number) {
		let threads = this.getWeakenThreadCount(type_threads)
		this.startBatch('weaken', threads)
	}

	/** Ensures that the server is maxed out before launching the first batching sequence.
	 * Once the server is maxed, this function will automatically start batching.
	*/
	public async Initialize() {
		if (!this.money.IsMax()) {
			const growThreads = Math.ceil(this.ns.growthAnalyze(
				this.Target,
				this.money.Max / this.money.Current,
				this.hostServer.cpuCores
			))

			this.startGrow(growThreads)
			this.startTimeout('grow', this.Initialize)
			return
		}

		if (!this.security.IsMin()) {
			const weakenStep = this.ns.weakenAnalyze(1, this.hostServer.cpuCores)
			const weakenThreads = Math.ceil((this.security.Current - this.security.Min) / weakenStep)

			this.startWeaken(weakenThreads)
			this.startTimeout('weaken', this.Initialize)
			return
		}

		this.startCycle()
	}

	private startCycle() {

	}
}

/** 
			  |Hack=|
|=Weaken=============|
	 |=Grow===========|
  |=Weaken=============|
				  |Hack=|
	|=Weaken=============|
		 |=Grow===========|
	  |=Weaken=============|
					  |Hack=|
		|=Weaken=============|
			 |=Grow===========|
		  |=Weaken=============|
						  |Hack=|
			|=Weaken=============|
				 |=Grow===========|
			  |=Weaken=============|
*
|=Weaken=============|
  |=Weaken=============|
	|=Weaken=============|
	 |=Grow===========|
	  |=Weaken=============|
		|=Weaken=============|
		 |=Grow===========|
		  |=Weaken=============|
			 |=Grow===========|
			  |Hack=|
				  |Hack=|
					  |Hack=|
*/

