import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_API_VERSION,CREATE_API_VERSION ,DELETE_API_VERSION} from "../actions/actionTypes";

const initialState = {
  apiVersions: [],
  success:false,
  loading:false,
  createapiVersions:null,
  createApiSuccess:false,
  deleteapiVersions:'',
  deleteApiSuccess:null
};

const ApiVersionReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(FETCH_API_VERSION).loading:
      return { ...state, loading:true };
    case asyncActionName(FETCH_API_VERSION).success:
      console.log(action.payload)
      return {
        ...state,
        apiVersions: action.payload,
        success: true,
        loading:false,
      };
    case asyncActionName(FETCH_API_VERSION).failure:
      return {
        ...state,
        apiVersions:[],
        error: action.payload,
        success: false,
        loading:false,
      };
      case asyncActionName(CREATE_API_VERSION).loading:
        return { ...state, loading:true };
      case asyncActionName(CREATE_API_VERSION).success:
        console.log(action.payload)
        return {
          ...state,
          createapiVersions: action.payload,
          createApiSuccess: true,
          loading:false,
        };
      case asyncActionName(CREATE_API_VERSION).failure:
        return {
          ...state,
          apiVersions:[],
          error: action.payload,
          createApiSuccess: false,
          loading:false,
        };
        case asyncActionName(DELETE_API_VERSION).loading:
          return { ...state, loading:true };
        case asyncActionName(DELETE_API_VERSION).success:
          console.log(action.payload)
          return {
            ...state,
            deleteapiVersions: action.payload,
            deleteApiSuccess: true,
            loading:false,
          };
        case asyncActionName(DELETE_API_VERSION).failure:
          return {
            ...state,
            error: action.payload,
            deleteApiSuccess: false,
            loading:false,
          };
    default:
      return state;
  }
};

export default ApiVersionReducer;
