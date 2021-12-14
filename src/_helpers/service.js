import Cookies from "universal-cookie";
import axios from "axios";
import appInfo from "../app-info";
import { notification } from "antd";
export const cookies = new Cookies();

let baseURL = appInfo.apiURL;

export const API = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 300000,
});

API.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error) {
      console.log("error", error);
      if (error.response !== undefined) {
        console.log(error.response);
        // if (
        //   401 === error.response.status &&
        //   !error.request.responseURL.endsWith("/login")
        // ) {
        //   window.location = "/login";
        // } else {
        //   notification["error"]({
        //     message: "Амжилтгүй",
        //     description: error.response.data.message,
        //   });
        //   return Promise.reject(error);
        // }
      } else {
        console.log(error.response);
        // window.location = "/login";
        return Promise.reject(error);
      }
    }
  }
);

API.interceptors.request.use(
  (config) => {
    let token = cookies.get("Token") || "";

    let auth = token
      ? {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        }
      : { "Access-Control-Allow-Origin": "*" };
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!config.headers) {
      config.headers = auth;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
