import React, { Component } from "react";
import { connect } from "react-redux";

import { newMessage, setNewMessage } from "./../actions/room";

export class ChatFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };

    this.props.socket.on("createMessage", (message, callback) => {
      this.props.setNewMessage(this.props.socket, message, roomName);
    });

    this.props.socket.on("newMessage", message => {
      this.props.newMessage(message);
    });

    this.props.socket.on("newLocationMessage", message => {
      this.props.newMessage(message);
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.setNewMessage(
      this.props.socket,
      { from: "me", text: this.state.text },
      this.props.room
    );
    this.setState(() => ({ text: "" }));
  };

  onTextChange = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  handleLocationMessage = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.props.socket.emit(
        "createLocationMessage",
        {
          latitude,
          longitude
        },
        this.props.room,
        this.props.username
      );
    });
  };

  render() {
    return (
      <div className="chat__footer">
        <form id="message-form">
          <input
            value={this.state.text}
            onChange={this.onTextChange}
            name="message"
            type="text"
            placeholder="Message"
            autoFocus
            autoComplete="off"
          />
          <button onClick={this.handleSubmit}>Send</button>
        </form>
        <button id="send-location" onClick={this.handleLocationMessage}>
          Send location
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setNewMessage: (socket, message, roomName) =>
    dispatch(setNewMessage(socket, message, roomName)),
  newMessage: message => dispatch(newMessage(message))
});

const mapStateToProps = state => ({
  room: state.room,
  username: state.auth.user.username
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatFooter);
