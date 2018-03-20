import React from "react"
import TicTacToe from "../containers/TicTacToe"

import qs from "qs"
import jwt from "jwt-client"
import io from "socket.io-client"

let socket;

class Chat extends React.Component {
    constructor(props) {
        super();

        this.state = {message: ""};

        let {token} = props;

        socket = io("/chat", {
            forceNew: true,
            query: 'token=' + token
        });
        socket.on("message", (data) => {

            console.log(data);
            let newLi = document.createElement("li");
            newLi.innerHTML = data.text;
            let messages = this.refs.messages;
            messages.prepend(newLi);

        });

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();

        let text = this.state.message;

        if (text.length === 0) return

        socket.emit("message", {text: text})
        this.setState({message : ""})
        this.refs.text.value = ""
    }

    onChange(e) {
        let value = e.target.value;
        this.setState({message: value})

    }


    render() {
        let {token} = this.props;
        if (!token) {
            return;
        }

        return (
            <div>
                <h1>Chat</h1>
                <form action="" id="chatForm" onSubmit={this.handleSubmit}>
                    <input ref={"text"} onChange={this.onChange} value={this.state.message} id="text"/>
                    <button>Отправить</button>
                </form>
                <ul ref={"messages"}></ul>
            </div>
        )
    }
}


export default Chat;