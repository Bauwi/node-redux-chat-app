import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { startLogout } from "../actions/auth";

export const Header = ({ startLogout, room }) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <div className="header__content--left">
          <Link className="header__title" to="/dashboard">
            <h1>ChatApp</h1>
          </Link>
          <h4 className="header__room">
            {room ? `/ ${room.toUpperCase()}` : ""}
          </h4>
        </div>

        <button className="button button--link" onClick={startLogout}>
          Logout
        </button>
      </div>
    </div>
  </header>
);

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout())
});

const mapStateToProps = state => ({
  room: state.room ? state.room.name : ""
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
