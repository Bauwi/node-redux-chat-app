import axios from "axios";

export const setRoomsTop5 = topRooms => ({
  type: "SET_TOP_ROOMS",
  topRooms
});

export const startSetRoomsTop5 = () => (dispatch, getState) => {
  return axios
    .get("http://localhost:3000/rooms/top5", {
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
    .get("http://localhost:3000/rooms/last", {
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
    .get("http://localhost:3000/rooms/crowded", {
      headers: { "x-auth": getState().auth.user.token }
    })
    .then(res => {
      dispatch(setCrowdedRooms(res.data));
    });
