import React from "react";
import moment from "moment";

export default ({ from, text, createdAt }) => {
  return (
    <li className="message">
      <div className="message__title">
        <h4>{from}</h4>
        <span>{moment(createdAt).format("Do MMM, YYYY")}</span>
      </div>
      <div className="message__body">
        <p>{text}</p>
      </div>
    </li>
  );
};
