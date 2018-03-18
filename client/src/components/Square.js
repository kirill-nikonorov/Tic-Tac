import React from "react"

const Square = ({number, onClick , disabled}) => {
    return (
        <button onClick={onClick}
                style={{height: 20, width: 20}}
                disabled={disabled}
        >
            {number}
        </button>
    )
}
export default Square;