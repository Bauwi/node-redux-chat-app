import axios from "axios";

const API_PATH =
  process.env.NODE_ENV === "production"
    ? "https://react-node-chat-app.herokuapp.com"
    : "http://localhost:3000";

export const setRoomsTop5 = topRooms => ({
  type: "SET_TOP_ROOMS",
  topRooms
});

export const startSetRoomsTop5 = () => (dispatch, getState) => {
  return axios
    .get(`${API_PATH}/rooms/top5`, {
      headers: { "x-auth": getState().auth.user.token }
    })
    .then(res => {
      dispatch(setRoomsTop5(res.data));
    });
};

const setLastRooms = lastRooms => ({
  type: "SET_LAST_ROOMS",
  lastRooms
});

export const startSetLastRooms = () => (dispatch, getState) =>
  axios
    .get(`${API_PATH}/rooms/last`, {
      headers: { "x-auth": getState().auth.user.token }
    })
    .then(res => {
      dispatch(setLastRooms(res.data));
    });

const setCrowdedRooms = crowdedRooms => ({
  type: "SET_CROWDED_ROOMS",
  crowdedRooms
});

export const startSetCrowdedRooms = () => (dispatch, getState) =>
  axios
    .get(`${API_PATH}/rooms/crowded`, {
      headers: { "x-auth": getState().auth.user.token }
    })
    .then(res => {
      dispatch(setCrowdedRooms(res.data));
    });
