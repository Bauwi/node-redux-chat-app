import React, { Component } from "react";
import { withRouter } from "react-router-dom";

export class DashboardPage extends Component {
  state = {
    roomName: ""
  };

  onRoomNameSubmit = e => {
    e.preventDefault();
    console.log("submitted");
    this.props.history.push(`/dashboard/${this.state.roomName}`);
  };

  handleRoomNameChange = e => {
    const roomName = e.target.value;
    this.setState(() => ({ roomName }));
  };

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard__sidebar">
          <h3>List</h3>
          <div id="users" />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__main__wrapper">
            <h1 className="dashboard__form__greetings">
              Welcome to the Chat App !
            </h1>
            <form onSubmit={this.onRoomNameSubmit} className="dashboard__form">
              <label className="dashboard__form__label">Pick a Room Name</label>
              <input
                value={this.state.roomName}
                onChange={this.handleRoomNameChange}
                type="text"
                className="text-input dashboard__form__input"
              />
              <button className="dashboard__form__button">Join</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardPage);
