let percist = 0

export async function main(ns: NS) {
	ns.disableLog('ALL')

	ns.print(percist)
	await ns.sleep(4000)
	percist++

	// while (true) {
	// 	await ns.sleep(1000)
	// 	const testScript = getTestScript(ns)
	//
	// 	if (!testScript) {
	// 		continue
	// 	}
	//
	// 	let now = new Date().getTime()
	//
	// 	let mtime = ns.getFileMetadata(testScript.filename).mtime
	// 	let msec = (now - mtime) / 1000
	// 	let runtime = testScript.onlineRunningTime
	//
	// 	ns.print(`script  : ${testScript.pid} ${testScript.filename} ${testScript.args}`)
	// 	ns.print(`\nmod time: ${mtime}`)
	// 	ns.print(`mod sec : ${msec}`)
	//
	// 	if ('timeOfDeath' in testScript) {
	// 		runtime = now - testScript.endTime
	// 		runtime /= 1000
	// 	}
	//
	// 	ns.print('\n')
	// 	ns.print(`${('timeOfDeath' in testScript) ? 'death  ' : 'runtime'} : ${runtime}`)
	// 	ns.print(`diff    : ${msec - runtime}`)
	//
	// 	ns.print('\n\n')
	// }
}

type TTestScript = RunningScript | RecentScript | null
function getTestScript(ns: NS): TTestScript {
	let testScript: TTestScript = null
	for (const script of ns.ps()) {
		if (!script.args.includes('--watch')) {
			continue
		}

		return ns.getRunningScript(script.pid)!
	}

	for (const script of ns.getRecentScripts().reverse()) {
		if (!script.args.includes('--watch')) {
			continue
		}
		return script
	}

	return null
}

