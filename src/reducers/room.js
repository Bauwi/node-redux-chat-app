const roomDefaultState = {
  messages: [],
  users: [],
  isLoaded: false
};

export default (state = roomDefaultState, action) => {
  switch (action.type) {
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message]
      };
    case 'INITIAL_LOAD':
      return {
        ...action.room,
        messages: [...state.messages, ...action.room.messages]
      };
    case 'ROOM_HAS_LOADED':
      return {
        ...state,
        isLoaded: action.isLoaded
      };
    case 'NEW_USER_IN_ROOM':
      return {
        ...state,
        users: [...state.users, action.user]
      };
    case 'USER_LEFT_ROOM':
      return {
        ...state,
        users: state.users.filter(user => user.username !== action.username)
      };
    case 'CLEAR_ROOM':
      return roomDefaultState;
    default:
      return state;
  }
};
