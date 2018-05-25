import {MAKE_STEP, CHANGE_STEP_NUMBER, INITIAL_ITEMS} from "../constants/constants";

export const grtInitialState = () => {
	return {
		square: Array(9).fill(null),
		xIsNext: true
	};
};

const rootReducer = (state = grtInitialState(), action) => {
	switch (action.type) {
	case MAKE_STEP :
		//   console.log("сработало = ", action.number)
		let square = state.square.slice();
		square[action.number] = state.xIsNext ? "x" : "o";

		return {
			square: square,
			xIsNext: !state.xIsNext
		};
	case INITIAL_ITEMS :
		let filledButtons = action.squareArr.reduce((sum, item) => {
			return sum += item === null ? 0 : 1;
		}, 0);
		console.log("filledButtons = " ,filledButtons);
		return {square: action.squareArr, xIsNext: filledButtons % 2 !== 1};
	case CHANGE_STEP_NUMBER :
		return {
			history: state.history,
			presentStep: action.number
		};
	default:
		console.log("нет такой команды");
		return state;
	}

};



export default rootReducer;
