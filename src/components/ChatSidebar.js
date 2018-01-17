import React, { Component } from "react";
import { connect } from "react-redux";

import ChatSidebarUserlist from "./ChatSidebarUserlist";

import { updateUserList } from "./../actions/room";

export class ChatSidebar extends Component {
  constructor(props) {
    super(props);
    this.props.socket.on("updateUserList", res => {
      this.props.updateUserList(res);
    });
  }

  render() {
    const { room } = this.props;
    return (
      <div className="chat__sidebar">
        <h3>{room ? `/${room.name}` : ""}</h3>
        <div id="users" />
        <ChatSidebarUserlist userList={this.props.userList} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateUserList: userList => dispatch(updateUserList(userList))
});

const mapStateToProps = state => ({
  userList: state.room.users
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebar);
