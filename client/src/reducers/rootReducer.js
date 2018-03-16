import {MAKE_STEP, CHANGE_STEP_NUMBER} from "../constants/constants";
import undoable, {distinctState} from 'redux-undo'

export const grtInitialState = () => {
    return {
        history: [{
            squares: Array(9).fill(null),
            xIsNext: true
        }],
        presentStep: 0

    }
}

const rootReducer = (state = grtInitialState(), action) => {
    switch (action.type) {
        case MAKE_STEP :
            //  console.log("сработало = ", action.number)

            const {history, presentStep} = state;
            let currentHistory = history.slice(0, state.presentStep + 1);
            console.log("reducer = ", currentHistory)
            let currentSquares = currentHistory[currentHistory.length - 1].squares.slice();
            let currentXIsNext = !!currentHistory[currentHistory.length - 1].xIsNext;

            currentSquares[action.number] = currentXIsNext ? "x" : "0";
            currentXIsNext = !currentXIsNext;


            let newHistory = currentHistory.concat({squares: currentSquares, xIsNext: currentXIsNext})
            return {

                history: newHistory,
                presentStep: newHistory.length - 1
            }
        case CHANGE_STEP_NUMBER :
            return {
                history: state.history,
                presentStep: action.number
            }

        default:
            console.log("нет такой команды")
            return state
    }

}


/*
const undoableRootReducer = undoable(rootReducer, {
    filter: distinctState()
})

export default undoableRootReducer;*/

export default rootReducer
