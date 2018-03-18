import React from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import io from "socket.io-client"
import jwt from "jwt-client"


import GameBoard from "../components/GameBoard"


import * as actions from "../actions/actions"
import {initialItems} from "../actions/actions";


let socket;

class TicTacToe extends React.Component {
    constructor(props) {
        super();
        createSocketConnection(props.token, props.actions);
    }

    handleClick(i) {

        const {actions , square, xIsNext , dispatch} = this.props;

        let currentMark = xIsNext ? "x" : "o";

        if (calculateWinner(square) || square[i]) return;

        actions.makeStepSocket(socket, i, currentMark);
    }

    render() {

        //  console.log("_____________ ")
        const {square, xIsNext, token} = this.props;

        let areYouFirst = jwt.read(token).claim.areYouFirst;
      //  console.log("areYouFirst = ", areYouFirst)

        let disabled = xIsNext !== areYouFirst
      //  console.log("render = diabled =  ", disabled)

        let info = <h5>Next step from {xIsNext ? "x" : "o"}</h5>
        let winer = calculateWinner(square);
        if (winer) {
            info = <h5>The Winner Is {winer}</h5>
        }
        return (
            <div>
                <h4>Hello From TicTacToe</h4>
                <GameBoard onClick={(i) => this.handleClick(i)}
                           squares={square}
                           disabled={disabled}

                />
                {info}
            </div>)
    }

    componentWillUnmount() {
        socket.disconnect()
    }

}

const calculateWinner = (square) => {
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
};

const createSocketConnection = (token, actions) => {

    const roomNum = jwt.read(token).claim.roomNum;

    console.log("createSocketConnection = ", roomNum);

    socket = io("", {
        forceNew: true,
        query: 'token=' + token
    });


    actions.loadInitialDataSocket(socket);


    socket.on("makeStep", (data) => {
        console.log(data.number);

        actions.makeStep(data.number)
    });

    socket.on("disconnect ", () => {
        console.log("disconnect")
    })

};


const
    mapDispatchToProps = (dispatch) => {
        return {
            dispatch: dispatch,
            actions: bindActionCreators(actions, dispatch)
        }
    }
const
    mapStateToProps = (state, props) => {
        //   console.log("mapToProps = " , props)
        return {
            square: state.square,
            xIsNext: state.xIsNext,

            token: props.token

        }
    }

export default connect(mapStateToProps, mapDispatchToProps)(TicTacToe)