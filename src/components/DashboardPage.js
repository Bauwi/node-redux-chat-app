import React from "react";
import Chat from "./Chat";

export const DashboardPage = () => (
  <div className="chat">
    <div className="chat__sidebar">
      <h3>People</h3>
      <div id="users" />
    </div>

    <div className="chat__main">
      <ol id="messages" className="chat__messages" />

      <div className="chat__footer">
        <form id="message-form">
          <input
            name="message"
            type="text"
            placeholder="Message"
            autoFocus
            autoComplete="off"
          />
          <button>Send</button>
        </form>
        <button id="send-location">Send location</button>
      </div>
    </div>
  </div>
);

export default DashboardPage;
