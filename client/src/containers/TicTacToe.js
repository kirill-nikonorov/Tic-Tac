import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"


import GameBoard from "../components/GameBoard"

import * as actions from "../actions/actions"

class TicTacToe extends React.Component {
    handleClick(i) {

        let {squares, actions} = this.props;
        let winner = this.calculateWinner(squares);
        if (winner||squares[i]) return;
        actions.makeStep(i);
    }

    renderGameInfo() {

    }

    calculateWinner(square) {
        const wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < wins.length; i++) {
            let [a, b, c] = wins[i];
            if (square[a] && square[a] === square[b] && square[a] === square[c]) {
                return square[a];
            }
        }
        return null;
    }


    render() {
        let {squares} = this.props;

        let info = <h5>Next step from {this.props.xIsNext ? "x" : "o"}</h5>
        let winer = this.calculateWinner(squares);
        if (winer) {
            info = <h5>The Winner Is {winer}</h5>
        }
        return (
            <div>
                <h4>Hello From TicTacToe</h4>
                <GameBoard onClick={(i) => this.handleClick(i)}
                           squares={this.props.squares}
                />
                {info}
            </div>)
    }

}


const
    mapDispatchToProps = (disatch) => {
        return {
            actions: bindActionCreators(actions, disatch)
        }
    }
const
    mapStateToProps = (state) => {
        console.log(state)
        return {

            squares: state.squares,
            xIsNext: state.xIsNext
        }
    }

export default connect(mapStateToProps, mapDispatchToProps)(TicTacToe)