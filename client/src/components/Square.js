import React from "react";
import "react-bootstrap";
import PropTypes from 'prop-types';
import styled from "styled-components";

const Button = styled.button`
      height: 50px;
      width: 50px;
      background-color: ${props => props.disabled ? "grey" : null}
    `;
const Mark = styled.span`
    font-size: 30px;
    font-weight: bold ;
    text-transform: uppercase;
    `;

const Square = ({number, onClick, disabled}) => {

    return (
        <Button
            onClick={onClick}
            disabled={disabled}>
            < Mark className={"marks"}>{number}</Mark>
        </Button>
    );
};

Square.propTypes = {
    number: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,

};
export default Square;