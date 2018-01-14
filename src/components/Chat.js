import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import ChatFooter from "./ChatFooter";

import { setNewMessage, newMessage, startInitialLoad } from "./../actions/room";
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
  }

  componentWillUnmount() {
    socket.disconnect();
    alert("Disconnecting Socket as component will unmount");
  }

  render() {
    return (
      <div className="chat">
        <div className="chat__sidebar">
          <h3>People</h3>
          <div id="users" />
        </div>

        <div className="chat__main">
          <ChatMessageList />

          <ChatFooter socket={socket} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startInitialLoad: (room, loadedStatus) =>
    dispatch(startInitialLoad(room, loadedStatus))
});

const mapStateToProps = state => ({
  room: state.room.room,
  isLoaded: state.room.isLoaded
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
