import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./Views/pages/dashboard";
import Admin from "./Views/pages/Admin";
import Transactions from "./Views/pages/Transations";
import TransactionsSingle from "./Views/pages/TransactionSingle";
import Agents from "./Views/pages/Agents";
import GetSingleAgents from "./Views/pages/AmbassadorAgents";
import AgentsManager from "./Views/pages/AgentsManager";
import AgentFees from "./Views/pages/AgentFees";
import Purse from "./Views/pages/Purse";
import Audit from "./Views/pages/Audit";
import AppVersion from "./Views/pages/AppVersion";
import Settings from "./Views/pages/Settings";
import Login from "./Views/pages/Login";
import { createHashHistory } from "history";
import { Provider } from "react-redux";
import store from "./Redux/store";
import PrivateRoute from "./utils/privateRoute";
import { history } from "./utils/history";
import AuthRequired from "./Components/authRequired";
import AgentProfile from "./Components/AgentProfile";
import AgentManagerProfile from "./Components/AgentManagerProfile";
import changePassword from "./Views/pages/userChangePassword";
import AgentsAccount from "./Views/pages/AgentsAccount";
import AccountOpening from "./Views/pages/AccountOpening";
import Gtb from "./Views/pages/AccountOpening/Gtb";

class Routes extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route path="/" component={Login} exact />
              <PrivateRoute
                roleCode="ROLE_VIEW_DASHBOARD"
                exact
                path="/dashboard"
                component={Dashboard}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_ADMIN"
                exact
                path="/admin"
                component={Admin}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_TRANSACTION"
                path="/transactions"
                component={Transactions}
              />
              <PrivateRoute
                roleCode="ROLE_VIEW_ALL_TRANSACTION"
                path="/agenttransactions"
                component={TransactionsSingle}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/agents"
                component={Agents}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_DASHBOARD"
                path="/openAccount"
                component={AccountOpening}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/gtb"
                component={Gtb}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/agentsmanager"
                component={AgentsManager}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_AGENT_FEE"
                path="/agentfees"
                component={AgentFees}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_PURSE"
                path="/purse"
                component={Purse}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_AUDIT_LOG"
                path="/audit"
                component={Audit}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/getagents"
                component={GetSingleAgents}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/agentprofile"
                component={AgentProfile}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/agentsaccount"
                component={AgentsAccount}
              />
              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                path="/agentmanagerprofile"
                component={AgentManagerProfile}
              />
              <AuthRequired
                path="/appversion"
                roleCode="ROLE_VIEW_ALL_ADMIN"
                component={AppVersion}
              />
              <PrivateRoute
                roleCode="ROLE_VIEW_DASHBOARD"
                path="/settings"
                component={Settings}
              />
              <PrivateRoute
                roleCode="ROLE_VIEW_DASHBOARD"
                path="/changepassword"
                component={changePassword}
              />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default Routes;
