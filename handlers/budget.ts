export abstract class BudgetBase {
	protected gain: number = 0
	protected loss: number = 0

	constructor(
		private initialValue: number,
		private initialGain: number = 0,
		private initialLoss: number = 0
	) { }

	public AddGain(val: number) {
		this.gain += val
	}
	public AddLoss(val: number) {
		this.loss += val
	}

	/** Calculates the current total gain
	 * @param val The current total gain
	*/
	public CalculateGain(val: number = this.initialGain): number {
		return val
			- this.initialGain
			+ this.gain
	}

	/** Calculates the current total loss
	 * @param val The current total loss
	*/
	public CalculateLoss(val: number = this.initialLoss): number {
		return val
			- this.initialLoss
			+ this.loss
	}

	public get Current() {
		return this.initialValue
			+ this.CalculateGain()
			- this.CalculateLoss()
	}

	public String(inst: BudgetBase = this): string {
		return [
			`Budget:`,
			`  Current: ${inst.Current}`,
			`  Gain: ${inst.CalculateGain()}`,
			`  Loss: ${inst.CalculateLoss()}`
		].join('\n')
	}
}
