export function Solve(data: Extract<CodingContractObject, { type: 'Minimum Path Sum in a Triangle' }>['data'], log: (...msg: any[]) => void = () => { return }): string {
	log(data.join('\n'))
	log('\n')

	const scores: number[][] = []

	for (let i = 0; i < data.length; i++) {
		const val = data[i]

		if (i == 0) {
			scores.push(val)
			continue
		}

		const current: number[] = []
		const prev = scores[i - 1]

		for (let j = 0; j < val.length; j++) {
			const num = val[j]
			const roots: number[] = []

			if (j - 1 >= 0) {
				roots.push(prev[j - 1] + num)
			}

			if (j < prev.length) {
				roots.push(prev[j] + num)
			}

			log(`${num}: ${roots.join(',')}`)

			current.push(Math.min(...roots))
		}

		scores.push(current)
	}

	log('\n')
	log(scores.join('\n'))
	log('\n')
	log(scores)

	return Math.min(...scores[scores.length - 1]).toString()
}
