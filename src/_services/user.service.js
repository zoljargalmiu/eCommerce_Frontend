import { cookies, API } from "../_helpers";
import moment from "moment";
import jwt_decode from "jwt-decode";

export const userService = {
  login,
  getUserData,
  logout,
};

async function login(username, password) {
  return API.post("/api/auth/authenticate", {
    userName: username,
    password: password,
  }).then((result) => {
    let isSecure = false;
    if (window.location.protocol === "https:") {
      isSecure = true;
    }
    const token = result.data.jwt;
    const userData = jwt_decode(token);

    cookies.set("Token", token, {
      secure: isSecure,
      expires: new Date(moment().add(userData.exp).format()),
    });

    return result;
  });
}

function getUserData(token) {
  return API.get("user/me", null).then((result) => result.data.content);
}

function logout() {
  localStorage.removeItem("user");
  cookies.remove("Token");
  localStorage.removeItem("Token");
}
