import React, { Component } from "react";
import { connect } from "react-redux";

import DashboardSidebarModule from "./DashboardSidebarModule";
import UserInfos from "./UserInfos";

import {
  startSetRoomsTop5,
  startSetLastRooms,
  startSetCrowdedRooms
} from "./../actions/lobby";

export class DashboardSidebar extends Component {
  static defaultProps = {
    top5: [],
    lastRooms: [],
    crowdedRooms: []
  };

  componentDidMount() {
    this.props.startSetCrowdedRooms();
    this.props.startSetRoomsTop5();
    this.props.startSetLastRooms();
  }

  render() {
    return (
      <div className="dashboard__sidebar">
        <div>
          <DashboardSidebarModule
            rooms={this.props.crowdedRooms}
            category="Crowded"
          />

          <DashboardSidebarModule rooms={this.props.top5} category="Popular" />
          <DashboardSidebarModule
            rooms={this.props.lastRooms}
            category="Last"
          />
        </div>
        <UserInfos user={this.props.user} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetCrowdedRooms: () => dispatch(startSetCrowdedRooms()),
  startSetRoomsTop5: () => dispatch(startSetRoomsTop5()),
  startSetLastRooms: () => dispatch(startSetLastRooms())
});

const mapStateToProps = state => ({
  crowdedRooms: state.lobby.crowdedRooms,
  top5: state.lobby.top5,
  lastRooms: state.lobby.lastRooms,
  user: state.auth.user
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebar);
