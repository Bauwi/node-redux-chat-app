const roomDefaultState = {
  messages: [],
  users: [],
  isLoaded: false
};

export default (state = roomDefaultState, action) => {
  switch (action.type) {
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message]
      };
    case "INITIAL_LOAD":
      return {
        ...state,
        room: action.room,
        messages: [...state.messages, ...action.room.messages]
      };
    // case "STORE_SOCKET":
    //   return {
    //     ...state,
    //     socket: action.socket
    //   };
    case "ROOM_HAS_LOADED":
      return {
        ...state,
        isLoaded: action.isLoaded
      };
    default:
      return state;
  }
};
