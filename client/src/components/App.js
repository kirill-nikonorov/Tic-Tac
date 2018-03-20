import React from "react"
import TicTacToe from "../containers/TicTacToe"
import Chat from "./Chat"


import qs from "qs"
import jwt from "jwt-client"


class App extends React.Component {
    constructor() {
        super();
        let shouldStart = localStorage.getItem("shouldStart");
        console.log("shouldStart = ", shouldStart)
        this.state = {
            token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
            shouldStart: shouldStart ? JSON.parse(shouldStart).shouldStart : false
        }

        this.cleanStorage = this.cleanStorage.bind(this);
    }

    getAuthenticationToken() {

        let self = this;

        let urlTamplate = createUrlFromSearchParams();

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

            self.setState({token: token})

        };
        xhr.send(null)

    }

    cleanStorage() {
        console.log("cleanStorage");

        localStorage.removeItem("token");
        localStorage.removeItem("shouldStart");
        this.setState({
            token: undefined,
            shouldStart: false
        })

    };

    render() {
        let {token, shouldStart} = this.state;

        let willAuthGo = !token && shouldStart;
        console.log("willAuthGo ", willAuthGo)

        if (willAuthGo) {
            console.log("willAuthGo ", willAuthGo)
            this.getAuthenticationToken();
        }


        return (
            <div>
                <h1>App</h1>

                <main>
                    {token ? <TicTacToe token={token}/> : ""}
                    {token ? generateInviteLink(token) : ""}
                    {token ? <Chat token={token}/> : ""}
                </main>
                <footer>
                    <br/>
                    <button onClick={goToNewRoom}>Go to new room</button>
                    <br/>
                    <button onClick={this.cleanStorage}>Clean Storage</button>
                    <br/>
                    <button onClick={allowAuthentication}>allowAuthentication</button>
                    <br/>
                    <button onClick={forbidAuthentication}>forbidAuthentication</button>
                </footer>
            </div>
        )
    }
}


const goToNewRoom = () => {

    localStorage.removeItem("token");
    localStorage.setItem("shouldStart", JSON.stringify({shouldStart: true}))


    window.location = "/"
};

const allowAuthentication = () => {

    localStorage.setItem("shouldStart", JSON.stringify({shouldStart: true}))
};
const forbidAuthentication = () => {

    localStorage.setItem("shouldStart", JSON.stringify({shouldStart: false}))

};


const createUrlFromSearchParams = () => {

    let urlTamplate = "/authinticate";

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

    return (<a href={"http://localhost:3001/?room=" + roomNum}>Ссылка = {roomNum}</a>)

}


export default App;