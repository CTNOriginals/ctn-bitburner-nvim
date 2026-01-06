
export function Solve(data: Extract<CodingContractObject, { type: 'Algorithmic Stock Trader I' }>['data'], ns?: NS): string {
	const log = (...msg: any[]) => {
		if (!ns) {
			return
		}
		ns.print(...msg)
	}

	const scores: number[] = [0].fill(0, 0, data.length - 1)

	for (let i = 0; i < data.length; i++) {
		const val = data[i]
		let best = 0

		for (let j = i + 1; j < data.length; j++) {
			const profit = data[j] - val
			if (profit > best) {
				best = profit
			}
		}

		scores[i] = best
	}

	return Math.max(...scores).toString()
}
