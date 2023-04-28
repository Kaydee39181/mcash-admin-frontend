import { asyncActionName } from "../../utils/asyncUtil";
import { CHANGE_PASSWORD, FETCH_ROLE, FETCH_ROLE_GROUP, CREATE_ROLE_GROUP, UPDATE_ROLE_GROUP } from "../actions/actionTypes";

const initialState = {
  passwordSuccess: false,
  loading: false,
  error: false,
  roleGroups: [],
  roles: [],
  rolesuccess: false,
  successRole: false,
  createRole: [],
  errorMessage: null,
  passworderror: false,
  successUpdateRole: false
  // failure:'user cant be logged in'
};

const SettingsReducer = (state = initialState, action) => {
  console.log(action.payload)
  switch (action.type) {
    case asyncActionName(CHANGE_PASSWORD).loading:
      return { ...state, loading: true };
    case asyncActionName(CHANGE_PASSWORD).success:
      // window.location.replace('/')

      return {
        ...state,
        passwordSuccess: true,
        success: true,
        loading: false,
        error: false,
        passworderror: false
      };
    case asyncActionName(CHANGE_PASSWORD).failure:
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
    case asyncActionName(FETCH_ROLE).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_ROLE).success:
      // window.location.replace('/')

      return {
        ...state,
        roles: action.payload,
        rolesuccess: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_ROLE).failure:
      return {
        ...state,
        error: true,
        rolesuccess: false,
        loading: false,
        // failure
      };
    case asyncActionName(FETCH_ROLE_GROUP).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_ROLE_GROUP).success:
      // window.location.replace('/')

      return {
        ...state,
        roleGroups: action.payload,
        successRoleGroup: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_ROLE_GROUP).failure:
      return {
        ...state,
        error: true,
        successRoleGroup: false,
        loading: false,
        // failure
      };
    case asyncActionName(CREATE_ROLE_GROUP).loading:
      return { ...state, loading: true };
    case asyncActionName(CREATE_ROLE_GROUP).success:
      // window.location.replace('/')

      return {
        ...state,
        createRole: action.payload,
        successRole: true,
        loading: false,
        error: false,
      };
    case asyncActionName(CREATE_ROLE_GROUP).failure:
      return {
        ...state,
        error: true,
        successRole: false,
        errorMessage: action.payload,
        loading: false,
        // failure
      };
    case asyncActionName(UPDATE_ROLE_GROUP).loading:
      return { ...state, loading: true };
    case asyncActionName(UPDATE_ROLE_GROUP).success:
      return {
        ...state,
        loading: false,
        successUpdateRole: true
      };
    case asyncActionName(UPDATE_ROLE_GROUP).failure:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        error: true,
        successUpdateRole: false
      };
    default:
      return state;
  }
};

export default SettingsReducer;
