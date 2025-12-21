import { BudgetBase } from "../../handlers/budget.ts"

export class Budget extends BudgetBase {
	constructor(private ns: NS, budget: number, gain?: number, loss?: number) {
		let moneySource = ns.getMoneySources().sinceInstall

		super(
			budget,
			(gain) ? gain : moneySource.hacknet,
			(loss) ? loss : -moneySource.hacknet_expenses
		)
	}

	public CalculateGain(): number {
		return super.CalculateGain(this.ns.getMoneySources().sinceInstall.hacknet)
	}
	public CalculateLoss(): number {
		return super.CalculateLoss(-this.ns.getMoneySources().sinceInstall.hacknet_expenses)
	}

	public String(): string {
		return super.String(this)
	}
}

