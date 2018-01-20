import axios from "axios";

import { startSetRoomsTop5 } from "./lobby";

const API_PATH =
  process.env.NODE_ENV === "production"
    ? "https://react-node-chat-app.herokuapp.com"
    : "http://localhost:3000";

const loginHasErrored = (bool, err) => ({
  type: "LOGIN_HAS_ERRORED",
  bool,
  err: err
});

const loginIsLoading = bool => ({
  type: "LOGIN_IS_LOADING",
  bool
});

export const login = user => ({
  type: "LOGIN",
  user
});

export const startLogin = credentials => dispatch => {
  dispatch(loginIsLoading(true));
  return axios
    .post(`${API_PATH}/users/login`, credentials)
    .then(res => {
      dispatch(login(res.data));
      sessionStorage.setItem("user", JSON.stringify(res.data));
    })
    .then(() => dispatch(loginIsLoading(false)))
    .catch(e => {
      dispatch(loginIsLoading(false));
      dispatch(loginHasErrored(true, e));
    });
};

export const logout = () => ({
  type: "LOGOUT"
});

export const startLogout = () => (dispatch, getState) => {
  return axios
    .delete(`${API_PATH}/users/me/token`, {
      headers: { "x-auth": getState().auth.user.token }
    })
    .then(() => {
      sessionStorage.removeItem("user");
      dispatch(logout());
    })
    .catch(e => console.log(e));
};

export const startCreateAccount = credentials => dispatch => {
  return axios.post(`${API_PATH}/users`, credentials).then(() => {
    dispatch(
      startLogin({ email: credentials.email, password: credentials.password })
    );
  });
};
