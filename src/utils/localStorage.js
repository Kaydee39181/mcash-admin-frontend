import { AUTH_STORAGE_EVENT } from "../theme";

const notifyAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
};

export const saveToken = (data) => {
  window.localStorage.setItem("data", data);
  notifyAuthChange();
};

export const getToken = () => window.localStorage.getItem("data") || "";
export const removeToken = () => {
  window.localStorage.removeItem("data");
  window.localStorage.removeItem("user");
  window.sessionStorage.removeItem("mcash_active_session");
  notifyAuthChange();
};
