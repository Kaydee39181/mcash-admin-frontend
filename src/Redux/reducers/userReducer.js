import { asyncActionName } from "../../utils/asyncUtil";
import { LOGIN_USER, LOGOUT_USER, USER_CHANGE_PASSWORD } from "../actions/actionTypes";
import { saveToken, removeToken } from '../../utils/localStorage';

const initialState = {
  user: null,
  isAuthenticated: null,
  loading: false,
  error: null,
  success: false,
  role: null
  // failure:'user cant be logged in'
};

const UsersReducer = (state = initialState, action) => {
  // console.log(action.payload?.error?.response?.data?.responseMessage)
  switch (action.type) {
    case asyncActionName(LOGIN_USER).loading:
      return { ...state, loading: true };
    case asyncActionName(LOGIN_USER).success:
      saveToken(JSON.stringify(action.payload));
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("mcash_active_session", "1");
      }
      console.log(action.payload.user.roleGroup.name)
      // window.location.replace('/dashboard')

      // localStorage.token = JSON.stringify(action.payload)
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        success: true,
        loading: false,
        role: action.payload.user.roleGroup.name,
        error: null,
      };
    case asyncActionName(LOGIN_USER).failure:
      return {
        ...state,
        // error: action.payload?.error?.response?.data?.responseMessage,
        error: action.payload,
        success: false,
        loading: false,
        role: null
        // failure
      };
    case asyncActionName(LOGOUT_USER).success:
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("mcash_active_session");
      }
      removeToken()
      return {
        ...state,
        user: null,
        isAuthenticated: null,
        loading: false,
        error: null,
        success: false
      };


    case asyncActionName(USER_CHANGE_PASSWORD).loading:
      return { ...state, loading: true };
    case asyncActionName(USER_CHANGE_PASSWORD).success:
      window.location.replace('/')

      return {
        ...state,
        passwordSuccess: true,
        success: true,
        loading: false,
        error: false,
        passworderror: false
      };
    case asyncActionName(USER_CHANGE_PASSWORD).failure:
      return {
        ...state,
        passwordSuccess: false,
        error: true,
        success: false,
        loading: false,
        passworderror: true,
        errorMessage: action.payload
        // failure
      };
    default:
      return state;
  }
};

export default UsersReducer;
