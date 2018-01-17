import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import ChatFooter from "./ChatFooter";
import ChatSidebar from "./ChatSidebar";

import {
  setNewMessage,
  newMessage,
  startInitialLoad,
  clearRoom
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
      const params = {
        name: this.props.user.username || "User",
        room: roomName
      };
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
    this.props.clearRoom();
  }

  render() {
    const { room } = this.props;
    return (
      <div className="chat">
        <ChatSidebar room={room} socket={socket} />

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
    dispatch(startInitialLoad(room, loadedStatus)),
  clearRoom: () => dispatch(clearRoom())
});

const mapStateToProps = state => ({
  room: state.room.room,
  user: state.auth.user,
  isLoaded: state.room.isLoaded
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
