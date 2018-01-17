import React from "react";
import moment from "moment";

export default ({ from, text, createdAt, url }) => {
  return (
    <li className="message">
      <div className="message__title">
        <h4>{from}</h4>
        <span>{moment(createdAt).format("Do MMM, YYYY at hh:mm")}</span>
      </div>
      <div className="message__body">
        {text ? (
          <p>{text}</p>
        ) : (
          <a href={url} target="_blank">
            Check where I am !
          </a>
        )}
      </div>
    </li>
  );
};
