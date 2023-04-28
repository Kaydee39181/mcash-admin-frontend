import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_ADMIN_USERS, CREATE_ADMIN,UPDATE_ADMIN } from "../actions/actionTypes";

const initialState = {
  allAdmin: [],
  allAdminTotal: "",
  createAdmin: "",
  createAdminsuccess: false,
  successUpdate:false
};

const AdminReducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case asyncActionName(FETCH_ADMIN_USERS).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_ADMIN_USERS).success:
      return {
        ...state,
        allAdmin: action.payload.data,
        allAdminTotal: action.payload.recordsFiltered,
        success: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_ADMIN_USERS).failure:
      return {
        ...state,
        error: true,
        allAdminTotal: "",
        success: false,
        loading: false,
      };
    case asyncActionName(CREATE_ADMIN).loading:
      return { ...state, loading: true };
    case asyncActionName(CREATE_ADMIN).success:
      return {
        ...state,
        loading: false,
        createAdmin: action.payload,
        createAdminsuccess: true,
      };
    case asyncActionName(CREATE_ADMIN).failure:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        error: true,
        createAdminsuccess: false,
      };
      case asyncActionName(UPDATE_ADMIN).loading:
        return { ...state, loading: true };
      case asyncActionName(UPDATE_ADMIN).success:
        return {
          ...state,
          loading:false,
          successUpdate: true
        };
      case asyncActionName(UPDATE_ADMIN).failure:
        return {
          ...state,
          loading:false,
          errorMessage: action.payload,
          error: true,
          successUpdate: false
        };
    default:
      return state;
  }
};

export default AdminReducer;
