import * as Data from '../data.ts'
import * as Utils from '../utils.ts'

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] as const

export function Solve(data: Extract<CodingContractObject, { type: 'Encryption I: Caesar Cipher' }>['data'], log: (...msg: any[]) => void = () => { return }): string {
	let out: string[] = []
	const input = data[0].split('') as (typeof alphabet[number] | ' ')[]
	const shift = data[1]

	for (const char of input) {
		if (char == " ") {
			out.push(char)
			continue
		}

		const letter = char as typeof alphabet[number]
		let i = alphabet.indexOf(letter) - shift
		if (i < 0) {
			i += alphabet.length
		}
		log(`${letter}: ${alphabet.indexOf(letter)} (${alphabet.indexOf(letter) - shift}) = ${i}`)

		out.push(alphabet[i])
	}

	log(Utils.FormatData(out))
	log(out)

	return out.join('')
}
