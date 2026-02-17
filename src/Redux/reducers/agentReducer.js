import { asyncActionName } from "../../utils/asyncUtil";
import {
  FETCH_AGENTS,
  FETCH_AMBASSADOR_AGENTS,
  ACTIVATION_CODE,
  FETCH_BANK_TERMINAL,
  ACTIVATE_ASSIGN_TERMINAL,
  UNACTIVATE_ASSIGN_TERMINAL,
  CREATE_AGENTS,
  ACTIVATE_DEACTIVATE_USER,
  RESET_AGENT_PASSWORD,
  UPDATE_AGENT
} from "../actions/actionTypes";

const initialState = {
  agents: [],
  activationCode: null,
  bankTerminal: [],
  createAgent: null,
  success: false,
  assignSuccess: false,
  unassignSuccess: false,
  successActivation: null,
  createAgentsuccess: false,
  agentTotal: 0,
  assignTerminal: null,
  resetPassword: null,
  resetErrorMessage: null,
};

const AgentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(FETCH_AGENTS).loading:
      console.log("1");
      return { ...state, loading: true };
    case asyncActionName(FETCH_AGENTS).success:
      return {
        ...state,
        agents: action.payload.data,
        agentTotal: action.payload.recordsFiltered,
        success: true,
        loading: false,
        error: false,
        assignTerminal: null,
        assignSuccess: false,
      };
    case asyncActionName(FETCH_AGENTS).failure:
      return {
        ...state,
        error: true,
        agentTotal: "",
        success: false,
        loading: false,
        assignTerminal: null,
        assignSuccess: false,
        // failure
      };
    case asyncActionName(FETCH_AMBASSADOR_AGENTS).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_AMBASSADOR_AGENTS).success:
      return {
        ...state,
        agents: action.payload.data,
        agentTotal: action.payload.recordsFiltered,
        success: true,
        loading: false,
        error: false,
        assignTerminal: null,
        assignSuccess: false,
      };
    case asyncActionName(FETCH_AMBASSADOR_AGENTS).failure:
      return {
        ...state,
        error: true,
        agentTotal: "",
        success: false,
        loading: false,
        assignTerminal: null,
        assignSuccess: false,
        // failure
      };
    case asyncActionName(ACTIVATION_CODE).loading:
      return { ...state, loading: true };
    case asyncActionName(ACTIVATION_CODE).success:
      return {
        ...state,
        loading: false,
        activationCode: action.payload,
        successActivation: true,
      };
    case asyncActionName(ACTIVATION_CODE).failure:
      return {
        ...state,
        loading: false,
        error: true,
        successActivation: false,
      };
    case asyncActionName(FETCH_BANK_TERMINAL).loading:
      return { ...state, loading: true };
    case asyncActionName(FETCH_BANK_TERMINAL).success:
      return {
        ...state,
        loading: false,
        bankTerminal: action.payload,
        successmodal: true,
      };
    case asyncActionName(FETCH_BANK_TERMINAL).failure:
      return {
        ...state,
        // loading:false,
        error: true,
        successmodal: false,
      };
    case asyncActionName(ACTIVATE_ASSIGN_TERMINAL).loading:
      return { ...state, loading: true };
    case asyncActionName(ACTIVATE_ASSIGN_TERMINAL).success:
      return {
        ...state,
        loading: false,
        assignTerminal: action.payload,
        assignSuccess: true,
      };
    case asyncActionName(ACTIVATE_ASSIGN_TERMINAL).failure:
      return {
        ...state,
        loading: false,
        error: true,
        assignSuccess: false,
      };
    case asyncActionName(UNACTIVATE_ASSIGN_TERMINAL).loading:
      return { ...state, loading: true };
    case asyncActionName(UNACTIVATE_ASSIGN_TERMINAL).success:
      return {
        ...state,
        loading: false,
        unassignTerminal: action.payload,
        unassignSuccess: true,
      };
    case asyncActionName(UNACTIVATE_ASSIGN_TERMINAL).failure:
      return {
        ...state,
        loading: false,
        error: true,
        unassignSuccess: false,
      };
    case asyncActionName(CREATE_AGENTS).loading:
      return { ...state, loading: true };
    case asyncActionName(CREATE_AGENTS).success:
      return {
        ...state,
        loading: false,
        createAgent: action.payload,
        createAgentsuccess: true,
      };
    case asyncActionName(CREATE_AGENTS).failure:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        error: true,
        createAgentsuccess: false,
      };
    case asyncActionName(UPDATE_AGENT).loading:
      return { ...state, loading: true };
    case asyncActionName(UPDATE_AGENT).success:
      return {
        ...state,
        loading: false,
        updateAgent: action.payload,
        updateAgentsuccess: true,
      };
    case asyncActionName(UPDATE_AGENT).failure:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        error: true,
        updateAgentsuccess: false,
      };
    case asyncActionName(ACTIVATE_DEACTIVATE_USER).loading:
      return { ...state, loading: true };
    case asyncActionName(ACTIVATE_DEACTIVATE_USER).success:
      return {
        ...state,
        loading: false,
        activateDeacivate: true,
      };
    case asyncActionName(ACTIVATE_DEACTIVATE_USER).failure:
      return {
        ...state,
        loading: false,
        activateDeacivate: false

      };
    case asyncActionName(RESET_AGENT_PASSWORD).loading:
      return { ...state, loading: true, resetErrorMessage: null };
    case asyncActionName(RESET_AGENT_PASSWORD).success:
      return {
        ...state,
        loading: false,
        resetSuccess: true,
        resetErrorMessage: null,
      };
    case asyncActionName(RESET_AGENT_PASSWORD).failure:
      const resetError =
        action?.payload?.error?.response?.data?.responseMessage ||
        action?.payload?.error?.response?.data?.message ||
        action?.payload?.error?.message ||
        action?.payload?.error ||
        "Password reset failed";
      return {
        ...state,
        loading: false,
        resetSuccess: false,
        resetErrorMessage: resetError,

      };
    default:
      return state;
  }
};

export default AgentsReducer;
