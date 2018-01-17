import React from "react";

import CalendarDate from "./CalendarDate";

export default ({ from, text, createdAt, url }) => {
  return (
    <li className="message">
      <div className="message__title">
        <h4>{from}</h4>
        <CalendarDate createdAt={createdAt} />
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
