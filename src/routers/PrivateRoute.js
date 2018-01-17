//PrivateRoute component is used to manage private only pages
import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  // get the rest of the props
  ...rest
}) => (
  <Route
    {...rest}
    component={props =>
      isAuthenticated ? (
        <div>
          <Header />
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/" />
      )}
  />
);

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.auth.user
  };
};

export default connect(mapStateToProps)(PrivateRoute);
