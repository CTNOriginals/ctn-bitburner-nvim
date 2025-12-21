import { ENode, Node, NodeComponent } from "./node.ts"
import { Budget } from "./budget.ts"

// Last known budget value to save between restarts
let budgetValue: number = -1

export async function main(ns: NS) {
	ns.disableLog('ALL')
	ns.print("Hacking some nets!")


	if (budgetValue === -1) {
		budgetValue = ns.getPlayer().money * 0.5
	} else {
		ns.print(`value: ${budgetValue}`)
	}

	const budget = new Budget(ns, budgetValue)
	ns.print(budget.String())
	ns.atExit(() => {
		budgetValue = budget.Current
	})

	const nodes: Node[] = []
	let numNodes = ns.hacknet.numNodes()

	for (let i = 0; i < numNodes; i++) {
		nodes.push(new Node(ns, i))
	}

	if (nodes.length == 0) {
		let newNode = ns.hacknet.purchaseNode()
		if (newNode == -1) {
			ns.print(`Budget (${budget.Current}) is lower then required amount for the first node (${ns.hacknet.getPurchaseNodeCost()}).`)
			return
		}
		nodes.push(new Node(ns, newNode))
	}

	while (true) {
		// sleep first to account for the chance of the loop continueing in the middle
		await ns.sleep(100)

		let bestComp = getCheapestUpgrade(nodes)

		if (!bestComp) {
			continue
		}

		// wait until budget has enough money again
		while (budget.Current < bestComp.GetCost()) {
			await ns.sleep(1000)
		}

		ns.print(bestComp.String())

		const i = bestComp.Upgrade()

		if (bestComp.Typ == ENode.node) {
			nodes.push(new Node(ns, i as number))
		}
		// ns.print(budget.String())
		ns.print(' ')
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

