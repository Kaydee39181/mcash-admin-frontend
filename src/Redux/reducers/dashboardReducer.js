import { asyncActionName } from "../../utils/asyncUtil";
import { DASHBOARD_BREAKDOWN, DASHBOARD_TRANSACTION_DETAILS} from "../actions/actionTypes";

const initialState = {
  dashboardBreakdown: [],
  dashboardDetails:[],
  mostPerformingAgent:[],
  transactionTypeBreakdown:[],
  numberOfAgents:''
};

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(DASHBOARD_BREAKDOWN).loading:
      return { ...state, loading:true };
    case asyncActionName(DASHBOARD_BREAKDOWN).success:

      return {
        ...state,
        dashboardBreakdown:action.payload.transactionSummary,
        transactionTypeBreakdown:action.payload.transactionTypeBreakdown,
        success: true,
        loading:false,
        error: false,
      };
    case asyncActionName(DASHBOARD_BREAKDOWN).failure:
      return {
        ...state,
        error: true,
        success: false,
        loading:false,
        // failure
      };
      case asyncActionName(DASHBOARD_TRANSACTION_DETAILS).loading:
      return { ...state, loading:true };
    case asyncActionName(DASHBOARD_TRANSACTION_DETAILS).success:

      return {
        ...state,
        dashboardDetails:action.payload.transactionDetails,
        mostPerformingAgent:action.payload.dailyTopPerformingAgents,
        numberOfAgents:action.payload.numberOfAgents,
        success: true,
        loading:false,
        error: false,
      };
    case asyncActionName(DASHBOARD_TRANSACTION_DETAILS).failure:
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

export default DashboardReducer;
