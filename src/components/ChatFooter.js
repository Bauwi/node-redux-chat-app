// import React, { Component } from "react";
// import { connect } from "react-redux";

// import { setNewMessage } from "./../actions/room";

// export class ChatFooter extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text: ""
//     };

//     this.props.socket.on("createMessage", (message, callback) => {
//       this.props.setNewMessage(this.props.socket, message, roomName);
//     });
//   }

//   handleSendMessage = e => {
//     e.preventDefault();
//     console.log("clicked");
//     this.props.setNewMessage(
//       this.props.socket,
//       { from: "me", text: this.state.text },
//       this.props.room
//     );
//   };

//   handleMessageTyping = e => {
//     const text = e.target.value;
//     this.setState(() => ({ text }));
//   };

//   render() {
//     if (!this.props.socket) {
//       return <p>Loading...</p>;
//     }
//     return (
//       <div className="chat__footer">
//         <form id="message-form">
//           <input
//             value={this.state.text}
//             onChange={this.handleMessageTyping}
//             name="message"
//             type="text"
//             placeholder="Message"
//             autoFocus
//             autoComplete="off"
//           />
//           <button onClick={this.handleSendMessage}>Send</button>
//         </form>
//         <button id="send-location">Send location</button>
//       </div>
//     );
//   }
// }

// const mapDispatchToProps = dispatch => ({
//   setNewMessage: (socket, message, roomName) =>
//     dispatch(setNewMessage(socket, message, roomName))
// });

// const mapStateToProps = state => ({
//   room: state.room.room
// });

// export default connect(mapStateToProps, mapDispatchToProps)(ChatFooter);
