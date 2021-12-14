import { userConstants } from "../_constants";
import { REHYDRATE } from "redux-persist";
const initialState = {
  loggingIn: false,
  user: {},
};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload) {
        return {
          ...state,
          loggingIn: action.payload.authentication.loggingIn
            ? action.payload.authentication.loggingIn
            : false,
          user: action.payload.authentication.user
            ? action.payload.authentication.user
            : {},
        };
      } else {
        return {
          ...state,
        };
      }
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: true,
        user: action.user,
      };
    case userConstants.GET_USER_ROLE:
      return {
        ...state,
        userRole: action.userRole,
      };
    case userConstants.LOGIN_FAILURE:
      return { ...state };
    case userConstants.LOGOUT:
      return { loggingIn: false, user: {} };
    default:
      return { ...state };
  }
}
