export const NodeState = {
	empty: '.',
	black: 'X',
	white: 'O',
	static: '#',
} as const

export type KNodeState = keyof typeof NodeState
export type VNodeState = typeof NodeState[KNodeState]
export const NodeStateKeys: KNodeState[] = Object.keys(NodeState) as KNodeState[]
export const NodeStateValues: VNodeState[] = Object.keys(NodeState) as VNodeState[]

export type Stones = Pick<typeof NodeState, 'black' | 'white'>
export type VStone = typeof NodeState['black' | 'white']
export type KStone = Extract<KNodeState, 'black' | 'white'>

export function GetStateNameFromValue(val: VNodeState): KNodeState {
	return NodeStateKeys[NodeStateValues.indexOf(val)]
}

export type BoardState = VNodeState[][]

export interface PlayerMoveState {
	type: "move" | "pass" | "gameOver";
	x: number | null;
	y: number | null;
}
