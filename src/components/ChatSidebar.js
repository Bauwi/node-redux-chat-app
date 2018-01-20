import React, { Component } from "react";
import { connect } from "react-redux";

import ChatSidebarUserlist from "./ChatSidebarUserlist";
import ChatSidebarStats from "./ChatSidebarStats";

import { updateUserList } from "./../actions/room";
import UserInfos from "./UserInfos";

export class ChatSidebar extends Component {
  constructor(props) {
    super(props);
    // this.props.socket.on("updateUserList", res => {
    //   this.props.updateUserList(res);
    // });
  }

  render() {
    const { room } = this.props;
    return (
      <div className="chat__sidebar">
        <div>
          <ChatSidebarStats />
          <ChatSidebarUserlist userList={this.props.userList} />
        </div>
        <UserInfos user={this.props.user} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateUserList: userList => dispatch(updateUserList(userList))
});

const mapStateToProps = state => ({
  userList: state.room.users,
  user: state.auth.user
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebar);
