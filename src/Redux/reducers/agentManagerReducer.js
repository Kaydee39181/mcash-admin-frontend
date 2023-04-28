import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_AGENTS_MANAGER , FETCH_STATE , FETCH_LGA, FETCH_BANK , CREATE_AGENTS_MANAGER , AGENT_MANAGER_SETTLEMENT} from "../actions/actionTypes";

const initialState = {
  agentmanager: [],
  agentStates: [],
  agentLga:[],
  agentBanks:[],
  agentCreation:false,
  settlement:[],
  createAgentMansuccess:false,
  agentManagerTotal:'',
  agentSettleTotal:''
};

const AgentManagerReducer = (state = initialState, action) => {
  console.log(action.type)
  switch (action.type) {
    case asyncActionName(FETCH_AGENTS_MANAGER ).loading:
        console.log('1')
      return { ...state, loading:true };
    case asyncActionName(FETCH_AGENTS_MANAGER ).success:
        console.log('2')

      return {
        ...state,
        agentmanager:action.payload.data,
        agentManagerTotal:action.payload.recordsFiltered,
        success: true,
        loading:false,
        error: false,
      };
    case asyncActionName(FETCH_AGENTS_MANAGER).failure:
      return {
        ...state,
        error: true,
        agentManagerTotal:'',
        success: false,
        loading:false,
        // failure
      };
    case asyncActionName(FETCH_STATE).loading:
      console.log('11')
    return { ...state, loading:true };
    case asyncActionName(FETCH_STATE).success:
        console.log('22')

      return {
        ...state,
        agentStates:action.payload,
        success: true,
        loading:false,
        error: false,
      };
    case asyncActionName(FETCH_STATE).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading:false,
        // failure
      };
      case asyncActionName(FETCH_LGA).loading:
        console.log('11')
      return { ...state, loading:true };
      case asyncActionName(FETCH_LGA).success:
          console.log('22')
  
        return {
          ...state,
          agentLga:action.payload,
          success: true,
          loading:false,
          error: false,
        };
      case asyncActionName(FETCH_LGA).failure:
        return {
          ...state,
          error: true,
          success: false,
          loading:false,
          // failure
        };
    case asyncActionName(FETCH_BANK).loading:
    return { ...state, loading:true };
    case asyncActionName(FETCH_BANK).success:

      return {
        ...state,
        agentBanks:action.payload,
        success: true,
        // loading:false,
        error: false,
      };
    case asyncActionName(FETCH_BANK).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading:false,
        // failure
      };
    case asyncActionName(CREATE_AGENTS_MANAGER).loading:
    return { ...state, loading:true };
    case asyncActionName(CREATE_AGENTS_MANAGER).success:

      return {
        ...state,
        agentCreation:action.payload,
        success: true,
        loading:false,
        error: null,
        createAgentMansuccess:true
      };
    case asyncActionName(CREATE_AGENTS_MANAGER).failure:
      return {
        ...state,
        error: action.payload,
        success: false,
        loading:false,
        createAgentMansuccess:false,
        errorMessage:action.payload,

      };
      case asyncActionName(AGENT_MANAGER_SETTLEMENT).loading:
        return { ...state, loading:true };
        case asyncActionName(AGENT_MANAGER_SETTLEMENT).success:
    
          return {
            ...state,
            settlement:action.payload.data,
            success: true,
            // loading:false,
            error: false,
            agentSettleTotal:action.payload.recordsFiltered
          };
        case asyncActionName(AGENT_MANAGER_SETTLEMENT).failure:
          return {
            ...state,
            error: true,
            success: false,
            loading:false,
            agentSettleTotal:''
            // failure
          };
    default:
      return state;
  }
};

export default AgentManagerReducer;
