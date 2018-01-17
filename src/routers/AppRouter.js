import React from "react";
import { Router, Route, Switch, Link, NavLink } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import LoginPage from "../components/LoginPage";
import DashboardPage from "../components/DashboardPage";
import Chat from "../components/Chat";
import NotFoundPage from "../components/NotFoundPage";
import CreateAccountPage from "../components/CreateAccountPage";
import AuthenticationTest from "../components/AuthenticationTest";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// create history props for Router to access history outside of components
// allow redirecting function of authentication status
export const history = createHistory();

const AppRouter = () => (
  // Router is used instead of browserRouter to allow passing down history props
  // that has been previously created
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PublicRoute path="/create" component={CreateAccountPage} />
        <PrivateRoute path="/dashboard" component={DashboardPage} exact />
        <PrivateRoute path="/dashboard/:id" component={Chat} />

        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
