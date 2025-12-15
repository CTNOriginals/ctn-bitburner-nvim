export abstract class BudgetBase {
	protected gain: number
	protected loss: number

	constructor(
		private initialValue: number,
		private initialGain: number = 0,
		private initialLoss: number = 0
	) {
		this.gain = initialGain
		this.loss = initialLoss
	}

	public AddGain(val: number) {
		this.gain += val
	}
	public AddLoss(val: number) {
		this.loss += val
	}

	public CalculateGain(val: number = this.gain): number {
		this.gain -= val
		return this.gain
	}
	public CalculateLoss(val: number = this.loss): number {
		this.loss -= val
		return this.loss
	}

	public get Current() {
		return this.initialValue
			+ this.CalculateGain()
			- this.CalculateLoss()
	}
}
