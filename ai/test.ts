// Source: https://github.com/CTNOriginals/CTN-Bitburner/blob/main/src/ai/neuralNetwork.ts
import { NeuralNetwork } from "./neuralNetwork.ts";
import { AAIDef, CIODef } from "./definition.ts";

import * as AdderTest from './models/adder/test.ts'

import { Logger } from "../logging/index.ts";

let logger: Logger
let thisNS: NS

export async function main(ns: NS) {
	ns.disableLog('ALL');
	ns.clearLog()
	console.clear();

	thisNS = ns
	logger = new Logger(ns)

	AdderTest.main(ns)
}

