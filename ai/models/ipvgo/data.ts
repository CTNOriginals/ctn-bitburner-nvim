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

export const PlayerType = {
	ai: 'ai',
	npc: 'npc',
	manual: 'manual',
} as const
export type KPlayerType = keyof typeof PlayerType

export type Stones = Pick<typeof NodeState, 'black' | 'white'>
export type VStone = typeof NodeState['black' | 'white']
export type KStone = Extract<KNodeState, 'black' | 'white'>

export type BoardState = VNodeState[]
export type BoardSize = 5 | 7 | 9 | 13

export type Coord = 0 | 1 | 2 | 3 | 4
export type Position = { x: Coord, y: Coord }

export function GetStateNameFromValue(val: VNodeState): KNodeState {
	return NodeStateKeys[NodeStateValues.indexOf(val)]
}

export interface PlayerMoveState {
	type: "move" | "pass" | "gameOver";
	x: number | null;
	y: number | null;
}
