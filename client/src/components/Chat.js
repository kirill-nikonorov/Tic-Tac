import React from "react";
import PropTypes from 'prop-types';

import io from "socket.io-client";
import "./Chat.css";
import jwt from "jwt-client";

let socket;

class Chat extends React.Component {
    constructor(props) {
        super();

        this.state = {message: "", token: props.token};

        let {token} = props;

        socket = io("/chat", {
            forceNew: true,
            query: "token=" + token
        });
        socket.on("message", (data) => {

            console.log(data);
            let {areYouFirst, message} = data;

            let newLi = document.createElement("li");
            newLi.innerHTML = message;
            newLi.classList.add(areYouFirst ? "firstPlayerMassage" : "secondPlayerMassage");
            let messages = this.ulMessages;
            messages.prepend(newLi);

        });

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        let {message, token} = this.state;

        if (message.length === 0) return;

        let areYouFirst = jwt.read(token).claim.areYouFirst;

        socket.emit("message", {message, areYouFirst});
        this.setState({message: ""});
        this.textInput.value = "";
    }

    onChange(e) {
        let value = e.target.value;
        this.setState({message: value});
    }

    render() {
        let {token} = this.props;
        if (!token) {
            return;
        }
        return (
            <div>
                <form action="" id="chatForm" onSubmit={this.handleSubmit}>
                    <input ref={(input) => { this.textInput = input; }} onChange={this.onChange} value={this.state.message}
                           autoComplete={"off"}
                           id="text"/>
                    <button>Отправить</button>
                </form>
                <div className={"panel chat-panel"}>
                    <ul className={"messages"} ref={(ul) => { this.ulMessages = ul; }}/>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        console.log("Chat componentWillUnmount");

        socket.disconnect();
    }
}

Chat.propTypes = {
    token: PropTypes.object
};

export default Chat;