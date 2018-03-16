import * as types from "../constants/constants"

export const makeStep = (number) => ({
    type: types.MAKE_STEP,
    number: number
})
export const changeStepNumber = (number) => ({
    type: types.CHANGE_STEP_NUMBER,
    number: number
})
