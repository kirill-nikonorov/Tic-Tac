import * as types from "../constants/constants"

export const makeStep = (number) => ({
    type: types.MAKE_STEP,
    number: number
})