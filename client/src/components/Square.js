import React from "react"
import 'react-bootstrap';
import "./Square.css"


const Square = ({number, onClick, disabled}) => {
    return (
        <button
            onClick={onClick}
            style={{height: 50, width: 50}}
            disabled={disabled}
        >
            <span className={"marks"}>{number}</span>
        </button>
    )
}
export default Square;