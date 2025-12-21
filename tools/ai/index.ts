type TValueOf<T> = T[keyof T]
class CIODef {
	/** The variences that the value may represent
	 * key: The name of the varient
	 * Value: The weight of the varient, meaning how much space this varient takes compared to the others.
	 * @example 
	 * // If the value of this IO is < 0.5, the varience would return 'off', otherwise 'on'
	 * ['off', 'on']
	*/
	public Variants: string[] = ['off', 'on']
	public Count: number

	public GetVarientFromValue(val: number): typeof this['Variants'][number] {
		return this.Variants[Math.round(val * (this.Variants.length - 1))]
	}

	public GetValueFromVarient(variant: typeof this['Variants'][number]): number {
		if (!this.Variants.includes(variant)) {
			throw `Variant does not include key: ${variant}`
		}

		return (1 / (this.Variants.length - 1)) * this.Variants.indexOf(variant)
	}
}

type TIODefMap = { [key: string]: Pick<CIODef, 'Variants' | 'Count'> }

export abstract class AAIDef {
	protected inputs: TIODefMap
	protected outputs: TIODefMap

	constructor(inputs: TIODefMap, outputs: TIODefMap) {
		this.inputs = inputs
		this.outputs = outputs
	}
}



