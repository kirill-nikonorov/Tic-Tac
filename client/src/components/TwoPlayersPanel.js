import React from "react";
//import "./TwoPlayersPanel.css"
import {Modal, Button} from "react-bootstrap";


import io from "socket.io-client";

import TicTacToe from "../containers/TicTacToe";
import Chat from "./Chat";

let socket;

class TwoPlayersPanel extends React.Component {
	constructor({token}) {
		super();
		this.state = {
			token: token,
			hasSecondPlayer: false,
			show: true
		};


		socket = io("/roomFillerObserver", {
			forceNew: true,
			query: "token=" + token
		});
		socket.on("startGame", () => {
			console.log("startGame");
			this.setState({show: false});
		});
		socket.on("endGame", () => {
			console.log("endGame");
			this.setState({show: true});
		});
	}


	render() {
		let {token, hasSecondPlayer} = this.state;
		let {inviteLink, onModalButtonClick} = this.props;


		return (
			<div>

				<Modal show={this.state.show} >
					<Modal.Header>
						<Modal.Title>Expecting for opponent</Modal.Title>
					</Modal.Header>
					<Modal.Body className={"text-center center-block"}>
                        Send it to your opponent to start game
						<br/>
						{inviteLink}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={onModalButtonClick}>Leave this room</Button>
					</Modal.Footer>
				</Modal>

				<div className={"two-players-elements"}>
					<TicTacToe token={token}/>
					<Chat token={token}/>
				</div>

			</div>
		);
	}

	componentWillUnmount() {
		socket.disconnect();
	}
}


export default TwoPlayersPanel;