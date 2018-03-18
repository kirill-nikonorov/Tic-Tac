import React from "react"
import TicTacToe from "../containers/TicTacToe"
import qs from "qs"

import jwt from "jwt-client"


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            token: localStorage.getItem("token")
        };
        this.cleanStorage = this.cleanStorage.bind(this);
    }

    getAuthenticationToken() {

        let self = this;
        let {token} = localStorage;

        console.log("token = " ,token)

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
            console.log("this.state = ", self.state);

        };
        xhr.send(null)

    }

    cleanStorage() {

        localStorage.clear();

       /* let self = this;

        let {token} = this.state;

        let xhr = new XMLHttpRequest();
        xhr.open("delete", "/authinticate", true);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {

            if (this.readyState !== 4) return;
            if (this.status !== 200) {
                console.log(this.status)
                alert(this.status + " " + this.statusText + "\nДаннная ссылка недействительна")

                return;
            }

            localStorage.clear();
            console.log("localStorage = rdelete =  ", localStorage);

            self.setState({token: undefined})
            console.log("this.state = rdelete = ", self.state);
            window.location = "http://localhost:3001/";

            console.log(window.location)

        };
        xhr.send(token)*/

    };

    render() {
        let {token} = this.state;


        if (!token) {
            this.getAuthenticationToken();
        }


        return (
            <div>
                <h1>App</h1>

                {token ? <TicTacToe token={token}/> : ""}
                {token ? generateInviteLink(token) : ""}
                <button onClick={this.cleanStorage}>go to new room</button>
            </div>
        )
    }
}

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