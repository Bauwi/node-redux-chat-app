import React, { Component } from "react";
import { connect } from "react-redux";

export class ChatSidebarStats extends Component {
  render() {
    const { messagesCount, connectedCount } = this.props;
    return (
      <div className="chat__sidebar__header">
        <p>
          <i className="fa fa-user" /> {connectedCount}
        </p>
        <p>
          <i className="fa fa-envelope" /> {messagesCount}
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  connectedCount: state.room.users.length,
  messagesCount: state.room.messages.filter(message => message.from !== "Admin")
    .length
});

export default connect(mapStateToProps)(ChatSidebarStats);
