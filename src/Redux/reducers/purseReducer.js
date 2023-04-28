import { asyncActionName } from "../../utils/asyncUtil";
import {
  AGENT_PURSE,
  CENTRAL_PURSE,
  CREDIT_DEBIT_PURSE,
  PURSE_BALANCE_SUMMARY,
} from "../actions/actionTypes";

const initialState = {
  agentPurse: [],
  centralPurse: [],
  cdsuccess: false,
  centralPurseBalance:[]
};

const AgentPurse = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(AGENT_PURSE).loading:
      return { ...state, loading: true };
    case asyncActionName(AGENT_PURSE).success:
      return {
        ...state,
        agentPurse: action.payload.data,
        agentPurseTotal: action.payload.recordsFiltered,
        success: true,
        loading: false,
        error: false,
      };
    case asyncActionName(AGENT_PURSE).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading: false,
        // failure
      };
    case asyncActionName(CENTRAL_PURSE).loading:
      return { ...state, loading: true };
    case asyncActionName(CENTRAL_PURSE).success:
      return {
        ...state,
        centralPurse: action.payload.data,
        centralPurseTotal: action.payload.recordsFiltered,
        success: true,
        loading: false,
        error: false,
      };
    case asyncActionName(CENTRAL_PURSE).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading: false,
        centralPurse:[]
        // failure
      };
    case asyncActionName(CREDIT_DEBIT_PURSE).loading:
      return { ...state, loading: true };
    case asyncActionName(CREDIT_DEBIT_PURSE).success:
      return {
        ...state,
        cdsuccess: true,
        loading: false,
        error: false,
      };
    case asyncActionName(CREDIT_DEBIT_PURSE).failure:
      return {
        ...state,
        error: true,
        cdsuccess: false,
        loading: false,
        // failure
      };
    case asyncActionName(PURSE_BALANCE_SUMMARY).loading:
      return { ...state, loading: true };
    case asyncActionName(PURSE_BALANCE_SUMMARY).success:
      return {
        ...state,
        centralPurseBalance: action.payload.data,
        success: true,
        loading: false,
        error: false,
      };
    case asyncActionName(PURSE_BALANCE_SUMMARY).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading: false,
        // failure
      };
      

    default:
      return state;
  }
};

export default AgentPurse;
