import * as types from "../constants/constants"

export const makeStep = (number) => ({
    type: types.MAKE_STEP,
    number: number
});

export const initialItems = (data) => {
    return {
        type: types.INITIAL_ITEMS,
        squareArr: data
    }
};


export const makeStepSocket = (socket, number, mark) => {
    return (dispatch) => {
        console.log("makeStepSocket = " , number )
        socket.emit('makeStepEmit', {number: number, mark: mark})
    }
};



export const loadInitialDataSocket = (socket) => {
    console.log("loadInitialDataSocket")
    return (dispatch) => {
        socket.on("initialState", (data) => {
            console.log(data)

            dispatch(initialItems(data))

        })
    }
};


/*export const changeStepNumber = (number) => ({
    type: types.CHANGE_STEP_NUMBER,
    number: number
})*/
