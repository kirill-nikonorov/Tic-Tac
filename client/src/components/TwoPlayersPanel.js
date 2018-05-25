import React from "react";
import {Modal, Button} from "react-bootstrap";
import jwt from "jwt-client";
import PropTypes from 'prop-types';

import styled from 'styled-components';

import io from "socket.io-client";

import TicTacToe from "../containers/TicTacToe";
import Chat from "./Chat";

let socket;

const TwoPlayersElements = styled.div`
             display: flex;
             flex-direction: row;
             justify-content: space-around;
             align-items: center;
             flex: 1 0 500px;
            `;

class TwoPlayersPanel extends React.Component {
    constructor({token}) {
        super();
        this.state = {
            token: token,
            hasSecondPlayer: false,
        };


        socket = io("/roomFillerObserver", {
            forceNew: true,
            query: "token=" + token
        });
        socket.on("startGame", () => {
            console.log("startGame");
            this.setState({hasSecondPlayer: true});
        });
        socket.on("endGame", () => {
            console.log("endGame");
            this.setState({hasSecondPlayer: false});
        });
    }


    render() {
        let {token, hasSecondPlayer} = this.state;
        let {inviteLink, onModalButtonClick} = this.props;
        let areYouFirst = jwt.read(token).claim.areYouFirst;


        console.log(TwoPlayersElements)

        return (
            <div>
                <Modal show={!hasSecondPlayer}>
                    <Modal.Header>
                        <Modal.Title> {areYouFirst ? "Expecting for opponent" : "You opponent left the room"}</Modal.Title>
                    </Modal.Header>
                    {areYouFirst ? <Modal.Body className={"text-center center-block"}>
                        Send it to your opponent to start game
                        <br/>
                        {inviteLink}
                    </Modal.Body> : null}

                    <Modal.Footer>
                        <Button onClick={onModalButtonClick}>Leave this room</Button>
                    </Modal.Footer>
                </Modal>

                <TwoPlayersElements>
                    <TicTacToe token={token}/>
                    <Chat token={token}/>
                </TwoPlayersElements>
            </div>
        );
    }

    componentWillUnmount() {
        socket.disconnect();
    }
}

TwoPlayersPanel.propTypes = {
    inviteLink: PropTypes.element,
    onModalButtonClick: PropTypes.func

};

export default TwoPlayersPanel;