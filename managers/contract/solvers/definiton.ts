// export function Solve(data: Extract<CodingContractObject, { type: 'type_name' }>['data'], ns?: NS): string {
export function Solve(data: CodingContractObject['data'], ns?: NS): string {
	const log = (...msg: any[]) => {
		if (!ns) {
			return
		}
		ns.print(...msg)
	}
	return ""
}
