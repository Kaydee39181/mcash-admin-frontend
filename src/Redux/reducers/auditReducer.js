import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_AUDIT } from "../actions/actionTypes";

const initialState = {
  audit: [],
  auditTotal:''
};

const AuditReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(FETCH_AUDIT).loading:
      return { ...state, loading:true };
    case asyncActionName(FETCH_AUDIT).success:

      return {
        ...state,
        audit:action.payload.data,
        auditTotal:action.payload.recordsFiltered,
        success: true,
        loading:false,
        error: false,
      };
    case asyncActionName(FETCH_AUDIT).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading:false,
        // failure
      };
    default:
      return state;
  }
};

export default AuditReducer;
