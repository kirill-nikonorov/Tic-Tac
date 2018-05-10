import React from "react";

import TwoPlayersPanel from "./TwoPlayersPanel";
import "react-bootstrap";


import qs from "qs";
import jwt from "jwt-client";
import io from "socket.io-client";
import {hot} from "react-hot-loader";

let socket;

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
        };

        console.log("Main socket connection  = ");

        socket = io("/authenticate", {
            forceNew: true,
        });

        socket.on("provideToken", ({token}) => {
            console.log("provideToken");

            localStorage.setItem("token", token);
            console.log("localStorage = ", localStorage);

            this.setState({
                token: token,
            });
        });
        socket.on("authenticationFail", () => {
            alert("Try another room, please")
        });


        socket.on("disconnect ", () => {
            console.log("disconnect = autentication ");
        });

        this.leaveThisRoom = this.leaveThisRoom.bind(this);
        App.goToRoom = App.goToRoom.bind(this);


    }


    leaveThisRoom() {
        localStorage.removeItem("token");
        socket.emit("leaveRoom");
        window.location = "/";

    }

    static goToRoom( id) {
        console.log("go to new Room  = " , id)
        socket.emit("getToken", {id: id});
    }


    render() {
        let {token} = this.state;

        if (!token && areWeInvited()) {
            App.goToRoom( extractRoomIdFromSearch())
        }

        return (
            <div className={" panel panel-default"}>
                <header className={" panel-heading text-center"}>
                    <h1>Tic Tac Toe Game</h1>
                </header>
                <main className={" panel panel-body"}>
                    {token ? <TwoPlayersPanel token={token}
                                              inviteLink={generateInviteLink(token)}
                                              onModalButtonClick={this.leaveThisRoom}
                        />
                        : "Enter a room , please"}
                </main>
                <footer className={" panel-footer text-center"}>
                    {token ?
                        <button onClick={this.leaveThisRoom}>Leave this room</button> :
                        <button onClick={() => App.goToRoom()}>Go to new room</button>
                    }
                </footer>
            </div>
        );
    }

    componentWillUnmount() {
        socket.disconnect();
    }
}

const extractRoomIdFromSearch = () => {

    let roomId;

    let searchParams = window.location.search.substring(1);
    if (searchParams) {

        let roomIdString = qs.parse(searchParams).room;
        let parsedRoomId = parseInt(roomIdString);

        console.log("createURL : roomIdParsed = ", parsedRoomId);
        if (typeof parsedRoomId === "number") {
            console.log("полученны данные Комнаты из строки запроса");
            roomId = parsedRoomId;
        }
    }
    return roomId;
};

const areWeInvited = () => {
    return window.location.search !== "";

};
const generateInviteLink = (token) => {
    let roomId = jwt.read(token).claim.roomId;

    console.log("roomId = ", roomId);

    let inviteAdress = "http://localhost:3001/?room=" + roomId;

    return (<a href={inviteAdress}>{inviteAdress}</a>);

};

export default hot(module)(App);
