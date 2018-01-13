import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { startLogin } from "../actions/auth";

export class LoginPage extends Component {
  state = {
    displayName: "",
    roomName: ""
  };

  handleRoomNameChange = e => {
    const roomName = e.target.value;
    console.log(e.target.value);
    this.setState(() => ({ roomName }));
  };

  render() {
    console.log(this.state.roomName);
    return (
      <div className="centered-form__form">
        <form>
          <div className="form-field">
            <h3>Join a Chat</h3>
          </div>
          <div className="form-field">
            <label>Display name</label>
            <input type="text" name="name" autoFocus />
          </div>
          <div className="form-field">
            <label>Room name</label>
            <input
              value={this.state.roomName}
              type="text"
              name="room"
              onChange={this.handleRoomNameChange}
            />
          </div>
          <div className="form-field">
            <Link to={`/dashboard/${this.state.roomName}`}>Join</Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startLogin: () => dispatch(startLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
