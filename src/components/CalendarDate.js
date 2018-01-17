import React, { Component } from "react";
import moment from "moment";

export default class CalendarDate extends Component {
  render() {
    moment.updateLocale("en", {
      calendar: {
        lastDay: "[Yesterday at] LT",
        sameDay: "LT",
        nextDay: "[Tomorrow at] LT",
        lastWeek: "[last] dddd [at] LT",
        nextWeek: "dddd [at] LT",
        sameElse: "L"
      }
    });

    return <span>{moment(this.props.createdAt).calendar()}</span>;
  }
}
