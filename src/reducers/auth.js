export default (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.user
      };
    case "LOGOUT":
      return {};
    case "LOGIN_HAS_ERRORED":
      return {
        ...state,
        hasErrored: action.bool,
        error: action.err
      };
    case "LOGIN_IS_LOADING":
      return {
        ...state,
        isLoading: action.bool
      };
    default:
      return state;
  }
};
