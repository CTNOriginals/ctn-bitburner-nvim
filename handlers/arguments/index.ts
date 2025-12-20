
// TODO: Create the parameter interface 
type ArgInputs = any;
export interface IArgumentDefinition {
	flags: string[]
	description: string[]
	inputs: ArgInputs
	action: (inputs: ArgInputs[]) => void
}
