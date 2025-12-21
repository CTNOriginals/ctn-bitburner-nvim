export abstract class ACursor<T> {
	/** The current origin of the cursor relative to its position
	 * The  origin is always behind the position
	 * It is mostly used to keep track of the range of the content that is currently being evaluated  
	*/
	protected origin = 0

	/** The current position of the cursor */
	protected pos = 0

	/** Has the cursor reached the End Of Transmission (last item of the content) */
	protected EOT: boolean = false

	constructor(private content: T[]) { }

	/** Returns the item the cursor pos is currently without advancing the pos */
	public Peek(): T {
		return this.content[this.pos]
	}

	/** Returns the current stream between origin and pos */
	public Stream(): T[] {
		return this.content.slice(this.origin, this.pos + 1)
	}

	/** Seek a new pos relative to the current pos
	 * @param offset The offset to seek relative to the current pos
	 * This value must be positive
	 * @returns True if the offset can be reached
	 * False if the offset could not be reched (likely due to reaching EOT before offset)
	 * @note If false is returned, the cursor position will not be effected and will remain on the current pos
	*/
	public Seek(offset: number): boolean {
		if (offset < 0) {
			throw this.getError(`Attempting to seek a negative offset (${offset})`)
		}

		if (this.pos + offset) {
			return false
		}

		this.pos += offset

		return true
	}

	/** Reads and returns the current item before advancing forward by 1 pos 
	 * @returns The item that was read or null if EOT is reached
	 * @note If EOT has not been reached yet but is reached after advancing, this function will set EOT to true
	*/
	public Read(): T | null {
		if (this.EOT) {
			return null
		}

		const item = this.Peek()

		if (!this.Seek(1)) {
			this.EOT = true
		}

		return item
	}

	protected getError(msg: string): string {
		throw `${msg}\n  at range ${this.origin}:${this.pos}`
	}
}

class StringCursor extends ACursor<string> {
	constructor(content: string) {
		super(content.split(''))
	}
}
