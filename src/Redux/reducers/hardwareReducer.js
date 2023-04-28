import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_HARDWARES, ACTIVATE_HARDWARES,DEACTIVATE_HARDWARES } from "../actions/actionTypes";

const initialState = {
  hardwares: [],
  hardwaresActivate: "",
  hardwaresdeActivate:"",
  loading: false,
  hardwaresuccess: false,
};

const HardwareReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(FETCH_HARDWARES).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_HARDWARES).success:
      return {
        ...state,
        hardwares: action.payload,
        success: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_HARDWARES).failure:
      return {
        ...state,
        hardwares: [],
        success: false,
        loading: false,
        error: true,
        // failure
      };
    case asyncActionName(ACTIVATE_HARDWARES).loading:
      return { ...state, loading: true };
    case asyncActionName(ACTIVATE_HARDWARES).success:
      return {
        ...state,
        hardwaresActivate: action.payload,
        hardwaresuccess: true,
        loading: false,
        error: false,
      };
    case asyncActionName(ACTIVATE_HARDWARES).failure:
      return {
        ...state,
        hardwaresuccess: false,
        loading: false,
        error: true,
        // failure
      };
      case asyncActionName(DEACTIVATE_HARDWARES).loading:
      return { ...state, loading: true };
    case asyncActionName(DEACTIVATE_HARDWARES).success:
      return {
        ...state,
        hardwaresdeActivate: action.payload,
        hardwareunassignsuccess: true,
        loading: false,
        error: false,
      };
    case asyncActionName(DEACTIVATE_HARDWARES).failure:
      return {
        ...state,
        hardwaresdeActivate: action.payload,
        hardwareunassignsuccess: false,
        loading: false,
        error: true,
        // failure
      };

    default:
      return state;
  }
};

export default HardwareReducer;
