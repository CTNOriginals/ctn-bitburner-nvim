import { BudgetBase } from "../../handlers/budget"

export class Budget extends BudgetBase {
	constructor(private ns: NS, budget: number) {
		let moneySource = ns.getMoneySources().sinceInstall
		super(budget, moneySource.hacknet, -moneySource.hacknet_expenses)
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

