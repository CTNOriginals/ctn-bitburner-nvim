export class Logger {
	constructor(private ns: NS) { }

	public log(...msg: any[]) {
		this.ns.print(...msg)
	}

	public terminal(...msg: any[]) {
		this.ns.tprint(...msg)
	}

	// public error(msg: string) {
	// 	this.ns.print(msg)
	// }
}


