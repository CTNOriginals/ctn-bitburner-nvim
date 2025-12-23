//* All types of functions: https://www.geeksforgeeks.org/activation-functions-neural-networks/

//? brings any number to a value between 0 and 1
export function Sigmoid(x: number) {
	return 1 / (1 + Math.exp(-x));
}
export function SigmoidDeriv(x: number) {
	const sx = Sigmoid(x);
	return sx * (1 - sx);
}

//? Rectified Linear Unit
//* https://medium.com/@meetkp/understanding-the-rectified-linear-unit-relu-a-key-activation-function-in-neural-networks-28108fba8f07
export function ReLU(x: number) {
	return Math.max(0, x);
}
export function ReLUDeriv(x: number) {
	return (x > 0) ? 1 : 0;
}

//? Mean Squared Error
//* https://www.geeksforgeeks.org/mean-squared-error/
export function MSE(predicted: number[], actual: number[]): number {
	return predicted.reduce((sum, p, i) => {
		return sum + Math.pow(p - actual[i], 2)
	}, 0) / predicted.length;
}
export function MSEDeriv(predicted: number[], actual: number[]): number[] {
	return predicted.map((p, i) => {
		return 2 * (p - actual[i]) / predicted.length;
	})
}
