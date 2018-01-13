import React, { Component } from "react";
import { connect } from "react-redux";

import ChatMessageListItem from "./ChatMessageListItem";

export class ChatMessageList extends Component {
  renderMessages = () =>
    this.props.messages &&
    this.props.messages.map(message => (
      <ChatMessageListItem
        key={message.key || message.createdAt}
        {...message}
      />
    ));

  render() {
    console.log(this.props.messages[5]);
    return (
      <ol id="messages" className="chat__messages">
        {this.renderMessages()}
      </ol>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.room.messages
});

export default connect(mapStateToProps)(ChatMessageList);
