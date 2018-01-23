import React, { Component } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";

import ChatMessageListItem from "./ChatMessageListItem";

export class ChatMessageList extends Component {
  componentDidMount() {
    console.log("MEssagelistmounted");
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behaviour: "smooth" });
  }
  renderMessages = () =>
    this.props.messages &&
    this.props.messages.map(message => {
      return <ChatMessageListItem key={message.createdAt} {...message} />;
    });

  render() {
    return (
      <div>
        <ol id="messages" className="chat__messages">
          {this.renderMessages()}
          <li
            key="autoscroll"
            ref={el => {
              this.el = el;
            }}
          />
        </ol>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.room.messages
});

export default connect(mapStateToProps)(ChatMessageList);
