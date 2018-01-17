import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppRouter, { history } from "./routers/AppRouter";
import configureStore from "./store/configureStore";

import { login, logout } from "./actions/auth";
import LoadingPage from "./components/LoadingPage";

import "normalize-css/normalize.css";
import "./styles/styles.scss";
import "react-dates/lib/css/_datepicker.css";

const store = configureStore();

const user = JSON.parse(localStorage.getItem("user"));
console.log("user from localStorage", user);
if (user && user.token) {
  store.dispatch(login(user));
}

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

// check if app has already been rendered to avoid useless re-rendering
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById("app"));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById("app"));
renderApp();
// manage redirecting when user is authenticated
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     store.dispatch(login(user.uid));
//     renderApp();
//     // only redirect when user is at the root of the app
//     if (history.location.pathname === '/') {
//       history.push('/dashboard');
//     }
//   } else {
//     store.dispatch(logout());
//     renderApp();
//     history.push('/');
//   }
// });
