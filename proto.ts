import { Logger } from './logging/index.ts'
import * as Worm from './hack/worm.ts'
import * as Data from './managers/contract/data.ts'

let ns: NS
export async function main(n: NS) {
	ns = n
	ns.disableLog('ALL')
	ns.clearLog()
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	// await Worm.ServerWorm(ns, 'home', (server: Server) => {
	// 	const files = ns.ls(server.hostname, '.cct')
	// 	log(`${server.hostname}: ${files}`)
	// }, false, false, false)

	const x = new test()
	x.start(x.bar)
	x.start(x.bar, 'hello', 'asdf')
}

class test {
	public foo(x: string): string {
		return `foo ${x}`
	}

	public bar(x: string): string {
		return `bar ${this.foo(x)}`
	}

	public start(cb: (...args: any[]) => string, ...args: any[]) {
		cb = cb.bind(this)
		// ns.print(cb.arguments.toString())

		ns.print(cb(...args))
		ns.print('\n\n')
	}
}
