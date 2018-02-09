export const newMessage = message => ({
  type: 'NEW_MESSAGE',
  message
});

export const setNewMessage = (socket, message, roomName) => (dispatch) => {
  socket.emit('createMessage', message, roomName, () => {});
};

export const initialLoad = room => ({
  type: 'INITIAL_LOAD',
  room
});

const roomHasLoaded = bool => ({
  type: 'ROOM_HAS_LOADED',
  isLoaded: bool
});

export const startInitialLoad = (room, loadedStatus) => (dispatch) => {
  dispatch(roomHasLoaded(false));
  return new Promise((resolve, reject) => {
    if (!loadedStatus) {
      resolve(dispatch(initialLoad(room)));
    }
  }).then(() => dispatch(roomHasLoaded(true)));
};

export const updateUserList = userList => ({
  type: 'UPDATE_USER_LIST',
  userList
});

export const newUserInRoom = user => ({
  type: 'NEW_USER_IN_ROOM',
  user
});

export const userLeftRoom = username => ({
  type: 'USER_LEFT_ROOM',
  username
});

export const clearRoom = () => ({
  type: 'CLEAR_ROOM'
});
