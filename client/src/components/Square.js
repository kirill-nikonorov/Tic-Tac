import React from "react";
import "react-bootstrap";
import "./Square.css";
import PropTypes from 'prop-types';

const Square = ({number, onClick, disabled}) => {
    return (
        <button
            onClick={onClick}
            style={{height: 50, width: 50,
                backgroundColor:  disabled ?  "grey" : null}}
            disabled={disabled}

        >
            < span className={"marks"}>{number}</span>
        </button>
    );
};

Square.propTypes = {
    number: PropTypes.number,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,

};
export default Square;