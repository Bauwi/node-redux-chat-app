const lobbyReducerInitialState = {};

export default (state = lobbyReducerInitialState, action) => {
  switch (action.type) {
    case "SET_TOP_ROOMS":
      return {
        ...state,
        top5: action.topRooms
      };
    case "SET_LAST_ROOMS":
      return {
        ...state,
        lastRooms: action.lastRooms
      };
    default:
      return state;
  }
};
