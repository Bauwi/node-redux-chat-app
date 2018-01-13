import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import {
  setRoom,
  startSetRoom,
  setNewMessage,
  newMessage,
  startInitialLoad
} from "./../actions/room";
import ChatMessageList from "./ChatMessageList";

let socket;

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    const roomName = this.props.history.location.pathname.replace(
      /\/dashboard\//,
      ""
    );
    socket = io.connect("http://localhost:3000");
    console.dir(socket);

    socket.on("connect", () => {
      const params = { name: "User", room: roomName };
      socket.emit("join", params, () => {
        socket.emit("enterRoom", roomName);
      });
    });

    socket.on("roomReady", res => {
      this.props.startInitialLoad(res, this.props.isLoaded);
    });

    socket.on("createMessage", (message, callback) => {
      this.props.setNewMessage(socket, message, roomName);
    });

    socket.on("newMessage", message => {
      this.props.newMessage(message);
    });

    // socket.on("initialLoad", room => {
    //   console.log("Room: ", room);
    //   this.props.initialLoad(room);
    // });
  }
  componentDidMount() {
    // this.props.startSetRoom("Peaky Blind");
  }

  componentWillUnmount() {
    socket.disconnect();
    alert("Disconnecting Socket as component will unmount");
  }

  handleSendMessage = e => {
    e.preventDefault();
    console.log("clicked");
    this.props.setNewMessage(
      socket,
      { from: "me", text: this.state.text },
      this.props.room
    );
  };

  handleMessageTyping = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  render() {
    return (
      <div className="chat">
        <div className="chat__sidebar">
          <h3>People</h3>
          <div id="users" />
        </div>

        <div className="chat__main">
          <ChatMessageList />

          <div className="chat__footer">
            <form id="message-form">
              <input
                value={this.state.text}
                onChange={this.handleMessageTyping}
                name="message"
                type="text"
                placeholder="Message"
                autoFocus
                autoComplete="off"
              />
              <button onClick={this.handleSendMessage}>Send</button>
            </form>
            <button id="send-location">Send location</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetRoom: (socket, room) => dispatch(startSetRoom(socket, room)),
  setNewMessage: (socket, message, roomName) =>
    dispatch(setNewMessage(socket, message, roomName)),
  newMessage: message => dispatch(newMessage(message)),
  startInitialLoad: (room, loadedStatus) =>
    dispatch(startInitialLoad(room, loadedStatus)),
  setRoom: room => dispatch(setRoom(room))
});

const mapStateToProps = state => ({
  room: state.room.room,
  isLoaded: state.room.isLoaded
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
