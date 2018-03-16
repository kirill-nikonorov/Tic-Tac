import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"


import GameBoard from "../components/GameBoard"
import UdoRedo from "../components/UdoRedo"

import * as actions from "../actions/actions"

class TicTacToe extends React.Component {


    handleClick(i) {


        const {actions, history, presentStep} = this.props;
        let currentHistory = history[presentStep];
        let currentSquares = currentHistory.squares;


        if (this.calculateWinner(currentSquares) || currentSquares[i]) return;
        //    console.log("handleClick = ", currentSquares)

        actions.makeStep(i);
        // console.log("handleClick = ", actions.makeStep)

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
                console.log("calculateWinner = ", square[a])
                return square[a];
            }
        }
        return null;
    }

    jumpTo(step) {
        let {actions: {changeStepNumber}} = this.props;
        changeStepNumber(step)
    }


    render() {
        console.log("_____________ ")


        const {history, presentStep} = this.props;
        console.log("history = ", history)

        console.log("presentStep = ", presentStep)

        let currentHistory = history[presentStep];
        console.log("currentHistory = ", currentHistory)

        let currentSquare = currentHistory.squares
        console.log("currentSquare = ", currentSquare)


        let info = <h5>Next step from {currentHistory.xIsNext ? "x" : "o"}</h5>
        let winer = this.calculateWinner(currentSquare);
        if (winer) {
            info = <h5>The Winner Is {winer}</h5>
        }
        return (
            <div>
                <h4>Hello From TicTacToe</h4>
                <GameBoard onClick={(i) => this.handleClick(i)}
                           squares={currentSquare}
                />
                <UdoRedo history={history}
                         onClick={(step) => this.jumpTo(step)}
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
        console.log("mapToProps = ", state)
        return {

            history: state.history,
            presentStep: state.presentStep
        }
    }

export default connect(mapStateToProps, mapDispatchToProps)(TicTacToe)