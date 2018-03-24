import React from "react"

import TwoPlayersPanel from "./TwoPlayersPanel"
import "./App.css"
import 'react-bootstrap';


import qs from "qs"
import jwt from "jwt-client"
import io from "socket.io-client";

let socket;

class App extends React.Component {
    constructor() {
        super();
        let shouldStart = localStorage.getItem("shouldStart");

        console.log("shouldStart = ", shouldStart)

        this.state = {
            token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
            shouldStart: shouldStart ? JSON.parse(shouldStart).shouldStart : true
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
                shouldStart: true
            })
        })


        socket.on("disconnect ", () => {
            console.log("disconnect = autentication ")
        });

        this.leaveThisRoom = this.leaveThisRoom.bind(this);
        this.goToNewRoom = this.goToNewRoom.bind(this);


    }


    leaveThisRoom() {
        console.log("leaveThisRoom");

        localStorage.removeItem("token");
        localStorage.setItem("shouldStart", JSON.stringify({shouldStart: false}));
        socket.emit("leaveRoom");
        this.setState({
            token: undefined,
            shouldStart: false
        })

    };

    goToNewRoom() {

        localStorage.removeItem("token");
        localStorage.setItem("shouldStart", JSON.stringify({shouldStart: true}))

        //this.getAuthenticationToken();
        window.location = "/"

    };

    render() {
        let {token, shouldStart} = this.state;

        let willAuthGo = !token && shouldStart;
        console.log("willAuthGo ", willAuthGo)

        if (willAuthGo) {

            console.log("willAuthGo ", willAuthGo)
            console.log("willAuthGo  , data ", extractRoomIdFromSearch())

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
                    <button onClick={this.goToNewRoom}>Go to new room</button>
                    <br/>
                    <button onClick={this.leaveThisRoom}>Leave this room</button>
                    <br/>
                    {token ? generateInviteLink(token) : ""}
                </footer>
            </div>
        )
    }

    componentWillUnmount() {
        socket.disconnect()
    }
}

const extractRoomIdFromSearch = () => {

    let roomId;

    let searchParams = window.location.search.substring(1);
    if (searchParams) {

        let roomIdString = qs.parse(searchParams).room;
        let parsedRoomId = parseInt(roomIdString);

        console.log("createURL : roomIdParsed = ", parsedRoomId)
        if (typeof parsedRoomId === "number") {
            console.log("полученны данные Комнаты из строки запроса")
            roomId = parsedRoomId;
        }
    }
    return roomId;
};

const generateInviteLink = (token) => {
    let roomNum = jwt.read(token).claim.roomNum;

    console.log("roomNum = ", roomNum)

    let inviteAdress = "http://localhost:3001/?room=" + roomNum

    return (<a href={inviteAdress}>{inviteAdress}</a>)

};


export default App;