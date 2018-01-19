import React, { Component } from "react";
import { connect } from "react-redux";

import DashboardSidebarModule from "./DashboardSidebarModule";

import { startSetRoomsTop5, startSetLastRooms } from "./../actions/lobby";

export class DashboardSidebar extends Component {
  static defaultProps = {
    top5: [],
    lastRooms: []
  };

  componentDidMount() {
    this.props.startSetRoomsTop5();
    this.props.startSetLastRooms();
  }

  render() {
    console.log(this.props.top5);
    return (
      <div className="dashboard__sidebar">
        <DashboardSidebarModule rooms={this.props.top5} category="Popular" />
        <DashboardSidebarModule rooms={this.props.lastRooms} category="Last" />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetRoomsTop5: () => dispatch(startSetRoomsTop5()),
  startSetLastRooms: () => dispatch(startSetLastRooms())
});

const mapStateToProps = state => ({
  top5: state.lobby.top5,
  lastRooms: state.lobby.lastRooms
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebar);
