import React, { Component } from "react";

export default class ChatSidebarUserlist extends Component {
  renderList = () => this.props.userList.map(user => <li>{user}</li>);

  render() {
    return <ol>{this.props.userList && this.renderList()}</ol>;
  }
}
