import { Logger } from '../logging/index.ts'

let logger: Logger
export async function main(ns: NS) {
	ns.disableLog('ALL')
	logger = new Logger(ns)

	while (true) {
		await ns.sleep(10)
		await PlaySession(ns)
		logger.log('Game Over')
	}

}

async function PlaySession(ns: NS) {
	const go = ns.go
	const goa = go.analysis

	// go.resetBoardState('No AI', 5)
	// go.analysis.setTestingBoardState(['.....', '.....', '.....', '.....', '.....',], 1.5)
	go.resetBoardState('Netburners', 13)
	// go.resetBoardState('The Black Hand', 13)
	// go.resetBoardState('Illuminati', 13)

	while (true) {
		await ns.sleep(1)

		const turn = go.getCurrentPlayer()
		logger.log(turn)
		if (turn != 'Black' || go.getOpponent() == 'No AI') {
			if (turn == 'None') {
				break
			}
			logger.log(await go.opponentNextTurn(true, isWhite(ns)))

			if (go.getOpponent() != 'No AI') {
				logger.log('here')
				continue
			}
		}

		let move = GetRandomMove(ns)

		if (!move) {
			go.passTurn(isWhite(ns))
			continue
		}

		go.makeMove(move[0], move[1], isWhite(ns))
	}
}

function GetRandomMove(ns: NS): [number, number] | null {
	const valid = ns.go.analysis.getValidMoves(undefined, undefined, isWhite(ns))
	const coords: [number, number][] = []
	const size = valid[0].length

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			if (valid[x][y] && (x % 2 === 1 || y % 2 === 1)) {
				coords.push([x, y])
			}
		}
	}

	// this.ns.print(Math.random() * coords.length - 1)
	// this.ns.print(coords[Math.round(Math.random() * coords.length - 1)])
	if (coords.length == 0) {
		return null
	}
	return coords[Math.floor(Math.random() * coords.length)]
}

function isWhite(ns: NS) {
	return ns.go.getCurrentPlayer() == 'White'
}
