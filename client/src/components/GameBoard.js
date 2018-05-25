import React from "react";

import Square from "./Square";
import PropTypes from 'prop-types';
import styled from "styled-components";


const GameRow = styled.div`
          display: flex
          ;`;
class GameBoard extends React.Component {


    renderSquare(i) {
        const {onClick, squares, disabled} = this.props;
        return (
            <Square number={squares[i]}
                    onClick={() => onClick(i)}
                    disabled={disabled}
            />
        );
    }


    render() {


        return (
            <div id="game-board">
                <GameRow>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </GameRow>
                <GameRow>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </GameRow>
                <GameRow>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </GameRow>

            </div>
        );
    }
}

GameBoard.propTypes = {
    onClick: PropTypes.func,
    squares: PropTypes.array,
    disabled: PropTypes.bool,

};

export default GameBoard;