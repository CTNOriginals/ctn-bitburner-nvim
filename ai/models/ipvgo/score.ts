import * as Data from './data.ts'

export function calculateMoveReward(boardBefore, boardAfter) {
	let reward = 0

	// 1. CAPTURED STONES (easiest - just count pieces)
	const stonesBefore = countStones(boardBefore)
	const stonesAfter = countStones(boardAfter)
	const capturedStones = stonesBefore.opponent - stonesAfter.opponent
	reward += capturedStones * 10

	// 2. TERRITORY CLAIMED (built-in API!)
	const territoryBefore = ns.go.analysis.getControlledEmptyNodes()
	// Make the move happens here in your actual code
	const territoryAfter = ns.go.analysis.getControlledEmptyNodes()
	const territoryClaimed = territoryAfter.player - territoryBefore.player
	reward += territoryClaimed * 2

	// 3. LIBERTIES (sum them from the API)
	const libertiesBefore = sumPlayerLiberties(
		ns.go.analysis.getLiberties(),
		boardBefore
	)
	const libertiesAfter = sumPlayerLiberties(
		ns.go.analysis.getLiberties(),
		boardAfter
	)
	const libertyChange = libertiesAfter - libertiesBefore
	reward += libertyChange * 0.5

	// 4. GOT CAPTURED (check if we lost stones)
	const ourLostStones = stonesBefore.player - stonesAfter.player
	reward += ourLostStones * -15

	return reward
}

// Helper: count stones on board
function countStones(board: string[][]) {
	let player = 0, opponent = 0
	for (let x = 0; x < board.length; x++) {
		for (let y = 0; y < board[x].length; y++) {
			if (board[x][y] === 'X') player++
			if (board[x][y] === 'O') opponent++
		}
	}
	return { player, opponent }
}

// Helper: sum all liberties for player's stones
function sumPlayerLiberties(liberties: number[][], board: string[][]) {
	let total = 0
	for (let x = 0; x < board.length; x++) {
		for (let y = 0; y < board[x].length; y++) {
			if (board[x][y] === 'X') {
				total += liberties[x][y]
			}
		}
	}
	return total
}
