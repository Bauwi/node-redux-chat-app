import React, { Component } from "react";

export default class ChatSidebarUserlist extends Component {
  renderList = () =>
    this.props.userList.map(user => <li key="user._id">{user.username}</li>);

  render() {
    return <ol>{this.props.userList && this.renderList()}</ol>;
  }
}
