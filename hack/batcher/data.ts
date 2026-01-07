export type TServer = Required<Server>
export type THostMap<T> = { [host: string]: T }

export type TBatchScript = {
	hack: string,
	grow: string,
	weaken: string,
}
export type KBatchScript = keyof TBatchScript
