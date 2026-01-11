import * as Adder from './adder.ts'
import { Logger } from '../../../logging/index.ts'

export function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)

	const ai = new Adder.AdderAI()

	ai.Train([
		{
			inputs: { x: 0, y: 0, cin: 0 },
			outputs: { sum: 0, cout: 0 },
		},
		{
			inputs: { x: 0, y: 0, cin: 1 },
			outputs: { sum: 1, cout: 0 }
		},
		{
			inputs: { x: 0, y: 1, cin: 0 },
			outputs: { sum: 1, cout: 0 }
		},
		{
			inputs: { x: 0, y: 1, cin: 1 },
			outputs: { sum: 0, cout: 1 }
		},
		{
			inputs: { x: 1, y: 0, cin: 0 },
			outputs: { sum: 1, cout: 0 }
		},
		{
			inputs: { x: 1, y: 0, cin: 1 },
			outputs: { sum: 0, cout: 1 }
		},
		{
			inputs: { x: 1, y: 1, cin: 0 },
			outputs: { sum: 0, cout: 1 }
		},
		{
			inputs: { x: 1, y: 1, cin: 1 },
			outputs: { sum: 1, cout: 1 }
		},
	], 100, 0.5)

	logger.log('000: ', ai.GetOutputValues(ai.Test({ x: 0, y: 0, cin: 0 })).join(''))
	logger.log('001: ', ai.GetOutputValues(ai.Test({ x: 0, y: 0, cin: 1 })).join(''))
	logger.log('010: ', ai.GetOutputValues(ai.Test({ x: 0, y: 1, cin: 0 })).join(''))
	logger.log('011: ', ai.GetOutputValues(ai.Test({ x: 0, y: 1, cin: 1 })).join(''))
	logger.log('100: ', ai.GetOutputValues(ai.Test({ x: 1, y: 0, cin: 0 })).join(''))
	logger.log('101: ', ai.GetOutputValues(ai.Test({ x: 1, y: 0, cin: 1 })).join(''))
	logger.log('110: ', ai.GetOutputValues(ai.Test({ x: 1, y: 1, cin: 0 })).join(''))
	logger.log('111: ', ai.GetOutputValues(ai.Test({ x: 1, y: 1, cin: 1 })).join(''))
}
