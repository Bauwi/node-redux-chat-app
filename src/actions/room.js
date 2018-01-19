import axios from "axios";

export const newMessage = message => ({
  type: "NEW_MESSAGE",
  message
});

export const setNewMessage = (socket, message, roomName) => dispatch => {
  socket.emit("createMessage", message, roomName, function() {
    console.log("done");
  });
};

export const initialLoad = room => ({
  type: "INITIAL_LOAD",
  room
});

const roomHasLoaded = bool => ({
  type: "ROOM_HAS_LOADED",
  isLoaded: bool
});

export const startInitialLoad = (room, loadedStatus) => dispatch => {
  console.log("room", room);
  dispatch(roomHasLoaded(false));
  return new Promise((resolve, reject) => {
    if (!loadedStatus) {
      resolve(dispatch(initialLoad(room)));
    }
  }).then(() => dispatch(roomHasLoaded(true)));
};

export const updateUserList = userList => ({
  type: "UPDATE_USER_LIST",
  userList
});

export const clearRoom = () => ({
  type: "CLEAR_ROOM"
});
