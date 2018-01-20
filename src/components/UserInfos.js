import React from "react";

export default props => (
  <div className="user-infos">
    <p>
      <i className="fa fa-user-o" /> {props.user.username}
    </p>
  </div>
);
