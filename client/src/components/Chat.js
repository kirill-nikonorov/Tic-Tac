import React from "react"

import io from "socket.io-client"
import "./Chat.css"

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
            //  newLi.key = data.text;
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
        this.setState({message: ""})
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
                <form action="" id="chatForm" onSubmit={this.handleSubmit}>
                    <input ref={"text"} onChange={this.onChange} value={this.state.message}
                           autoComplete={"off"}
                           id="text"/>
                    <button>Отправить</button>
                </form>
                <div className={"panel chat-panel"}>
                    <ul className={"messages"} ref={"messages"}/>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        console.log("Chat componentWillUnmount")

        socket.disconnect()
    }
}


export default Chat;