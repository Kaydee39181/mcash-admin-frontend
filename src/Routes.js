 import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import { Provider } from "react-redux";
import store from "./Redux/store";

import PrivateRoute from "./utils/privateRoute";
import AuthRequired from "./Components/authRequired";

import Dashboard from "./Views/pages/dashboard";
import Admin from "./Views/pages/Admin";
import Transactions from "./Views/pages/Transactions";
import TransactionsSingle from "./Views/pages/TransactionSingle";
import Agents from "./Views/pages/Agents";
import GetSingleAgents from "./Views/pages/AmbassadorAgents";
import AgentsManager from "./Views/pages/AgentsManager";
import AgentFees from "./Views/pages/AgentFees";
import Purse from "./Views/pages/Purse";
import Audit from "./Views/pages/Audit";
import SelectSwitch from "./Views/pages/SelectSwitch";
import AppVersion from "./Views/pages/AppVersion";
import Settings from "./Views/pages/Settings";
import Login from "./Views/pages/Login";
import changePassword from "./Views/pages/userChangePassword";
import AgentsAccount from "./Views/pages/AgentsAccount";
import AccountOpening from "./Views/pages/AccountOpening";
import Gtb from "./Views/pages/AccountOpening/Gtb";
import VirtualAccount from "./Views/pages/Virtual Account";
import AgentProfile from "./Components/AgentProfile";
import AgentManagerProfile from "./Components/AgentManagerProfile";

class Routes extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/changepassword" component={changePassword} />

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
                exact
                path="/transactions"
                component={Transactions}
              />

              <PrivateRoute
                roleCode="ROLE_VIEW_ALL_TRANSACTION"
                exact
                path="/agenttransactions"
                component={TransactionsSingle}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/virtual-account"
                component={VirtualAccount}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/agents"
                component={Agents}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/agentprofile"
                component={AgentProfile}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/agentmanagerprofile"
                component={AgentManagerProfile}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/openAccount"
                component={AccountOpening}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/gtb"
                component={Gtb}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/agentsmanager"
                component={AgentsManager}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_AGENT_FEE"
                exact
                path="/agentfees"
                component={AgentFees}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_PURSE"
                exact
                path="/purse"
                component={Purse}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_AUDIT_LOG"
                exact
                path="/audit"
                component={Audit}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_AUDIT_LOG"
                exact
                path="/selectSwitch"
                component={SelectSwitch}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/getagents"
                component={GetSingleAgents}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_AGENT"
                exact
                path="/agentsaccount"
                component={AgentsAccount}
              />

              <AuthRequired
                roleCode="ROLE_VIEW_ALL_ADMIN"
                exact
                path="/appversion"
                component={AppVersion}
              />

              <PrivateRoute
                roleCode="ROLE_VIEW_DASHBOARD"
                exact
                path="/settings"
                component={Settings}
              />

              {/* Catch-all */}
              <Route component={Login} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default Routes;
