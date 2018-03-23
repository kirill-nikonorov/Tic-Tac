import React from "react"

import TwoPlayersPanel from "./TwoPlayersPanel"
import "./App.css"
import 'react-bootstrap';


import qs from "qs"
import jwt from "jwt-client"


class App extends React.Component {
    constructor() {
        super();
        let shouldStart = localStorage.getItem("shouldStart");
        console.log("shouldStart = ", shouldStart)
        this.state = {
            token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
            shouldStart: shouldStart ? JSON.parse(shouldStart).shouldStart : true
        }

        this.leaveThisRoom = this.leaveThisRoom.bind(this);
        this.goToNewRoom = this.goToNewRoom.bind(this);
    }

    getAuthenticationToken(roomParams) {

        let self = this;

        let urlTamplate = "/authinticate";

        if (roomParams) {
            urlTamplate += roomParams;
        }

        let xhr = new XMLHttpRequest();
        xhr.open("get", urlTamplate, true);

        xhr.responseType = 'json';

        xhr.onreadystatechange = function () {

            if (this.readyState !== 4) return;
            if (this.status !== 200) {
                console.log(this.status)
                alert(this.status + " " + this.statusText + "\nДаннная ссылка недействительна")

                return;
            }

            let token = xhr.response.token;

            //   let decoded = jwt.read(token).claim;

            localStorage.setItem("token", token);
            console.log("localStorage = ", localStorage);

            self.setState({
                token: token,
                shouldStart: true
            })

        };
        xhr.send(null)

    }

    leaveThisRoom() {
        console.log("leaveThisRoom");

        localStorage.removeItem("token");
        localStorage.setItem("shouldStart", JSON.stringify({shouldStart: false}));
        this.setState({
            token: undefined,
            shouldStart: false
        })

    };

    goToNewRoom() {

        localStorage.removeItem("token");
        localStorage.setItem("shouldStart", JSON.stringify({shouldStart: true}))

        //this.getAuthenticationToken();
        window.location="/"

    };

    render() {
        let {token, shouldStart} = this.state;

        let willAuthGo = !token && shouldStart;
        console.log("willAuthGo ", willAuthGo)

        if (willAuthGo) {
            console.log("willAuthGo ", willAuthGo)
            this.getAuthenticationToken(createUrlFromSearchParams());
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
}

const createUrlFromSearchParams = () => {

    let urlTamplate = "";

    let searchParams = window.location.search.substring(1);
    if (searchParams) {

        let roomNumString = qs.parse(searchParams).room;
        let roomNum = parseInt(roomNumString);

        console.log("createURL : roomNum = ", roomNum)
        if (typeof roomNum === "number") {
            console.log("полученны данные Комнаты из строки запроса")
            urlTamplate += "?room=" + roomNum;
        }
    }
    return urlTamplate;
};

const generateInviteLink = (token) => {
    let roomNum = jwt.read(token).claim.roomNum;

    console.log("roomNum = ", roomNum)

    let inviteAdress = "http://localhost:3001/?room=" + roomNum

    return (<a href={inviteAdress}>{inviteAdress}</a>)

}


export default App;