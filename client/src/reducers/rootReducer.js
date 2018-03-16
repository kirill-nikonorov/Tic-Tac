import {MAKE_STEP} from "../constants/constants";
import undoable, {distinctState} from 'redux-undo'

export const grtInitialState = () => {
    return {
        squares: Array(9).fill(null),
        xIsNext: true
    }
}

const rootReducer = (state = grtInitialState(), action) => {
    switch (action.type) {
        case MAKE_STEP :
            //console.log("сработало = ", action.number)

            const squares = state.squares.slice();
            squares[action.number] = state.xIsNext ? "x" : "0";
            return {
                squares: squares,
                xIsNext: !state.xIsNext
            }
        default:
            console.log("нет такой команды")
    }

    return state;
}

/*
const undoableRootReducer = undoable(rootReducer, {
    filter: distinctState()
})

export default undoableRootReducer;*/

export default rootReducer
