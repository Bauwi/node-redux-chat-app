import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { startLogin } from "../actions/auth";
import LoginForm from "./LoginForm";

export class LoginPage extends Component {
  render() {
    return (
      <div className="centered-form__form">
        <h1 className="login-title">Login</h1>
        {this.props.loginError && (
          <p className="login-error">Sorry, we cannot find this user...</p>
        )}
        <LoginForm user={{ email: "", password: "" }} />
        <div className="login-option">
          <Link to="/create">need an account?</Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startLogin: () => dispatch(startLogin())
});

const mapStateToProps = state => ({
  loginError: state.auth.hasErrored
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
