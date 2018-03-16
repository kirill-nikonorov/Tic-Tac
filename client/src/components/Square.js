import React from "react"

const Square = ({number, onClick}) => {
    return (
        <button onClick={onClick} style={{height: 20, width: 20}}>
            {number}
        </button>
    )
}
export default Square;