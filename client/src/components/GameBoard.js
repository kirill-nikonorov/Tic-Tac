import React from "react"

import Square from "./Square"

class GameBoard extends React.Component {


    renderSquare(i) {
        const {onClick, squares} = this.props;
        return (
            <Square number={squares[i]}
                    onClick={() => onClick(i)}/>
        )
    }

    render() {
        return (
            <div id="game-board">
                <div id="game-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div id="game-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div id="game-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>

            </div>
        )
    }
}

export default GameBoard;