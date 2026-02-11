// src/interceptor.js

import axios from "axios";
import { removeToken } from "./utils/localStorage";
import { logoutUser } from "./Redux/requests/userRequest";

const safeRedirectToLogin = () => {
  // prevent redirect loops if you're already on login
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};

export default {
  setupInterceptors: (store, history) => {
    axios.interceptors.response.use(
      (response) => {
        // Your backend-style custom response code
        const responseCode = response?.data?.responseCode;

        if (responseCode === "02") {
          try {
            removeToken();
            if (store) store.dispatch(logoutUser());
          } catch (e) {
            // ignore
          }
          safeRedirectToLogin();
        }

        return response;
      },
      (error) => {
        const status = error?.response?.status;

        // Standard HTTP auth failures
        if (status === 401 || status === 403) {
          try {
            removeToken();
            if (store) store.dispatch(logoutUser());
          } catch (e) {
            // ignore
          }
          safeRedirectToLogin();
        }

        return Promise.reject(error);
      }
    );
  },
};
