export class Logger {
	constructor(private ns: NS) { }

	public log(...msg: string[]) {
		this.ns.print(...msg)
	}

	public terminal(...msg: string[]) {
		this.ns.tprint(...msg)
	}

	// public error(msg: string) {
	// 	this.ns.print(msg)
	// }
}


