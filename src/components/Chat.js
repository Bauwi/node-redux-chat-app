import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { notification, Icon } from "antd";

// import "antd/dist/antd.css";
import ChatFooter from "./ChatFooter";
import ChatSidebar from "./ChatSidebar";

const userEntersRoomNotif = username => {
  notification.open({
    message: `${username} has joined.`,
    className: "notification",
    style: {
      position: "relative",
      top: "70px",
      marginLeft: 335 - 250,
      width: 300
      //   position: "relative",
      //   top: "65px"
    },

    icon: <Icon type="user-add" style={{ color: "#ffd21f" }} />
  });
};

const userLeavesRoomNotif = username => {
  notification.open({
    message: `${username} has left.`,
    className: "notification",
    style: {
      position: "relative",
      top: "70px",
      marginLeft: 335 - 250,
      width: 300
      //   position: "relative",
      //   top: "65px"
    },

    icon: <Icon type="user-delete" style={{ color: "#ffd21f" }} />
  });
};

const ROOT_URL =
  process.env.NODE_ENV === "production"
    ? "https://react-node-chat-app.herokuapp.com"
    : "http://localhost:3000";

import {
  setNewMessage,
  newMessage,
  startInitialLoad,
  clearRoom,
  newUserInRoom,
  userLeftRoom
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
    socket = io.connect(`${ROOT_URL}`);

    socket.on("connect", () => {
      const params = {
        name: this.props.user.username || "User",
        room: roomName
      };
      socket.emit("join", params, () => {
        socket.emit("enterRoom", roomName, this.props.user);
      });

      socket.on("newUserInRoom", user => {
        const alreadyInList =
          this.props.room.users.filter(
            userInState => userInState._id === user._id
          ).length !== 0;

        if (!alreadyInList) {
          this.props.newUserInRoom(user);
          console.log("new user in room.");
          if (user.username !== this.props.user.username) {
            userEntersRoomNotif(user.username);
          }
        }
      });

      socket.on("userLeftRoom", user => {
        console.log(user);
        this.props.userLeftRoom(user);
        if (user.username !== this.props.user.username) {
          userLeavesRoomNotif(user);
        }
      });
    });

    // emitted to the current user only
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
  clearRoom: () => dispatch(clearRoom()),
  newUserInRoom: user => dispatch(newUserInRoom(user)),
  userLeftRoom: username => dispatch(userLeftRoom(username))
});

const mapStateToProps = state => ({
  room: state.room,
  user: state.auth.user,
  isLoaded: state.room.isLoaded
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
