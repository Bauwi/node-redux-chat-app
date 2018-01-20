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
    case "SET_CROWDED_ROOMS":
      return {
        ...state,
        crowdedRooms: action.crowdedRooms
      };
    default:
      return state;
  }
};
