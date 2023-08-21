import Cookies from "js-cookie";

const initialState = {
  isAuthenticated: !!Cookies.get("info_Authtoken"),
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DELETE_COOKIE":
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authenticationReducer;
