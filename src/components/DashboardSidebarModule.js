import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class DashboardSidebarModule extends Component {
  renderList = () =>
    this.props.rooms.map(room => {
      return (
        <li key={room._id}>
          <Link to={`/dashboard/${room.name}`}>
            <p>/ {room.name}</p>
            <p>{room.users.length}</p>
          </Link>
        </li>
      );
    });

  render() {
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
