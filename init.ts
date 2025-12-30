import { Logger } from './logging/index.ts'

class IStartupScript {
	public args?: string[] = []
	public singleton?: boolean = true

	constructor(inputs: IStartupScript) {
		for (const key in inputs) {
			this[key as keyof typeof this] = inputs[key]
		}
	}
}

const startupScripts: { [file: string]: IStartupScript } = {
	'./managers/script/script.ts': {},
	'./managers/watcher/index.ts': {},
	'./tools/RunInBackground.js': { singleton: false },
}

export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	const log = (...msg: any[]) => logger.log(...msg)

	logger.terminal(`Initializing...`)

	for (const path in startupScripts) {
		let opts = new IStartupScript(startupScripts[path])
		let file = path

		if (path.substring(0, 2) == './') {
			file = path.substring(2)
		}

		ns.tprintf(`Running startup script: ${file} %j`, opts)

		ns.run(
			file,
			{ preventDuplicates: opts.singleton, temporary: true },
			...opts.args ?? []
		)
	}
}
