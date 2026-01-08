export type TServer = Required<Server>
export type THostMap<T> = { [host: string]: T }

export type TBatchScript = {
	hack: string,
	grow: string,
	weaken: string,
}
export type KBatchScript = keyof TBatchScript

export const BatchScripts: TBatchScript = {
	hack: 'hack/batcher/scripts/hack.ts',
	grow: 'hack/batcher/scripts/grow.ts',
	weaken: 'hack/batcher/scripts/weaken.ts',
}
