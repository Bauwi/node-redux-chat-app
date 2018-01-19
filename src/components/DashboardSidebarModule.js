import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class DashboardSidebarModule extends Component {
  renderList = () =>
    this.props.rooms.map(room => {
      return (
        <Link to={`/dashboard/${room.name}`}>
          <li key={room._id}>
            <p>/ {room.name}</p>
            <p>{room.messagesCount}</p>
          </li>
        </Link>
      );
    });

  render() {
    console.log(this.props.rooms);
    return (
      <div>
        <div className="dashboard__sidebar__category">
          <h3>{this.props.category.toUpperCase()} </h3>
          <i className="fa fa-user" />
        </div>

        <div>
          <ul>{this.renderList()}</ul>
        </div>
      </div>
    );
  }
}
