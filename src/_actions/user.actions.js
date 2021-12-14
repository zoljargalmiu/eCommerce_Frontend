import { userConstants } from "../_constants";
import { alertActions } from ".";
import { userService } from "../_services";
import { API } from "../_helpers";
import { history } from "../App";
import jwt_decode from "jwt-decode";

export const userActions = {
  login,
  logout,
  getUserData,
};

function login(username, password) {
  return (dispatch) => {
    dispatch(request({ username }));

    return userService.login(username, password).then(
      (result) => {
        console.log("userData: " + result.data);
        const userData = result.data.userDetail;

        dispatch(success(userData));
        dispatch(alertActions.success("Signed in successfully."));
        history.push("/");
      },
      (error) => {
        if (error.response !== undefined) {
          dispatch(alertActions.error(error.response.data.message));
          dispatch(failure(error.response.data.message));
        } else {
          dispatch(
            alertActions.error("Server Error! Please contact administrator.")
          );
        }
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function getUserData() {
  return (dispatch) => {
    API.get("user/me", {
      headers: { Pragma: "no-cache" },
    }).then(
      (result) => {
        const userData = result.data.content;
        dispatch(success(userData));
        dispatch(alertActions.success("Signed in successfully."));
        history.push("/");
      },
      (error) => {
        console.log("error");
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}
