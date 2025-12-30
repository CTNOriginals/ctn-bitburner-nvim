export type TServer = Required<Server>
export type THostMap<T> = { [host: string]: T }

export type TBatchScript = {
	weaken: string,
	grow: string,
	hack: string,
}
