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
        let shouldStartSecondPlayerSearch = localStorage.getItem("shouldStartSecondPlayerSearch");

        console.log("shouldStartSecondPlayerSearch = ", shouldStartSecondPlayerSearch);

        this.state = {
            token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
            shouldStartSecondPlayerSearch: shouldStartSecondPlayerSearch ? JSON.parse(shouldStartSecondPlayerSearch).shouldStartSecondPlayerSearch : true
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
                shouldStartSecondPlayerSearch: true
            });
        });
        socket.on("authenticationFail", () => {
            alert("Try onother room, please")
        });


        socket.on("disconnect ", () => {
            console.log("disconnect = autentication ");
        });

        this.leaveThisRoom = this.leaveThisRoom.bind(this);
        App.goToNewRoom = App.goToNewRoom.bind(this);


    }


    leaveThisRoom() {
        console.log("leaveThisRoom");

        localStorage.removeItem("token");
        localStorage.setItem("shouldStartSecondPlayerSearch", JSON.stringify({shouldStartSecondPlayerSearch: false}));
        socket.emit("leaveRoom");
        this.setState({
            token: undefined,
            shouldStartSecondPlayerSearch: false
        });

    }

    static goToNewRoom() {

        localStorage.removeItem("token");
        localStorage.setItem("shouldStartSecondPlayerSearch", JSON.stringify({shouldStartSecondPlayerSearch: true}));

        //this.getAuthenticationToken();
        window.location = "/";

    }

    render() {
        let {token, shouldStartSecondPlayerSearch} = this.state;

        let willAuthGo = !token && shouldStartSecondPlayerSearch;
        console.log("willAuthGo ", willAuthGo);

        if (willAuthGo) {

            console.log("willAuthGo ", willAuthGo);
            console.log("willAuthGo  , data ", extractRoomIdFromSearch());

            socket.emit("getToken", {id: extractRoomIdFromSearch()});


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
                        : "Enter a room"}
                </main>
                <footer className={" panel-footer text-center"}>
                    <button onClick={App.goToNewRoom}>Go to new room</button>
                    <br/>
                    {token ? <button onClick={this.leaveThisRoom}>Leave this room</button> : null}
                    <br/>
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

const generateInviteLink = (token) => {
    let roomId = jwt.read(token).claim.roomId;

    console.log("roomId = ", roomId);

    let inviteAdress = "http://localhost:3001/?room=" + roomId;

    return (<a href={inviteAdress}>{inviteAdress}</a>);

};


export default hot(module)(App);
