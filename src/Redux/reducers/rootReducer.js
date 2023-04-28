import { combineReducers } from "redux";
import users from "./userReducer";
import transactions from "./transactionsReducer";
import agents from "./agentReducer";
import agentmanager from "./agentManagerReducer";
import dashboard from "./dashboardReducer";
import audit from "./auditReducer";
import purse from "./purseReducer";
import settings from "./settingsReducer";
import apiversions from "./apiVersionReducer";
import admins from "./adminReducer";
import agentfees from "./agentFeesReducer";
import hardwaredevice from "./hardwareReducer";

export default combineReducers({
  users,
  transactions,
  agents,
  agentmanager,
  dashboard,
  audit,
  purse,
  settings,
  apiversions,
  admins,
  agentfees,
  hardwaredevice,
});
