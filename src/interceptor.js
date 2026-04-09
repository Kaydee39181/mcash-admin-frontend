// src/interceptor.js

import axios from "axios";
import { removeToken } from "./utils/localStorage";
import { logoutUser } from "./Redux/requests/userRequest";

const AUTH_FAILURE_MESSAGE = /(token|session|unauthori|authoriz|expired|login|authentication)/i;
const ACCESS_DENIED_MESSAGE = /(do not have access|no access|not permitted|permission|forbidden)/i;

const safeRedirectToLogin = () => {
  // prevent redirect loops if you're already on login
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};

const shouldForceLogoutFromBody = (response) => {
  const responseCode = response?.data?.responseCode;
  if (responseCode !== "02") return false;

  const responseText = [
    response?.data?.responseMessage,
    response?.data?.message,
    response?.data?.error?.message,
  ]
    .filter(Boolean)
    .join(" ");

  return AUTH_FAILURE_MESSAGE.test(responseText);
};

const isAccessDeniedFromBody = (response) => {
  const responseCode = response?.data?.responseCode;
  if (responseCode === "99") return true;

  const responseText = [
    response?.data?.responseMessage,
    response?.data?.message,
    response?.data?.error?.message,
  ]
    .filter(Boolean)
    .join(" ");

  return ACCESS_DENIED_MESSAGE.test(responseText);
};

const interceptor = {
  setupInterceptors: (store, history) => {
    axios.interceptors.response.use(
      (response) => {
        // Only force logout if response body explicitly signals auth/session failure.
        if (shouldForceLogoutFromBody(response)) {
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

        // Force logout on unauthorized; 403 can be role/permission and should not end the session.
        if (status === 401) {
          // Some endpoints incorrectly return 401 for permission issues. Do not end the session for that.
          if (isAccessDeniedFromBody(error?.response)) {
            return Promise.reject(error);
          }

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

export default interceptor;
