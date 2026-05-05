import React, { useState, useEffect } from "react";
import DashboardTemplate from "../../Views/template/dashboardtemplate";
import Loader from "../../Components/secondLoader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiSuitcaseLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import image from "../../Assets/img/agentimage.png";
import SweetAlert from "react-bootstrap-sweetalert";
import EditUser from "../../Views/pages/Agents/editAgent";

import {
  ActivateDeactivateUser,
  ResetPassword,
  FetchSingleAgent,
  ActivatateCode,
} from "../../Redux//requests/agentRequest";
import { connect } from "react-redux";
import { getEffectiveRoleName, safeParseStoredAuth } from "../../utils/auth";

import "./style.css";

const FALLBACK_TEXT = "Not available";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return FALLBACK_TEXT;
  }

  return value;
};

const Profile = (props) => {
  const token = safeParseStoredAuth();
  const name = getEffectiveRoleName(token);
  const {
    loading,
    ActivateDeactivateUser: ActivateDeactivateUsers,
    ResetPassword: ResetPasswords,
    resetSuccess,
    resetErrorMessage,
    agents,
    FetchSingleAgent: FetchSingleAgents,
    activateDeacivate,
    successActivation,
    ActivatateCode: ActivatateCodes,
  } = props;
  const [smShow, setSmShow] = useState(false);
  const [title, setTitle] = useState("");
  const [danger, setDanger] = useState(false);
  const [success, setSucess] = useState(false);
  const [editagent, showEditAgentModal] = useState(false);
  const [agentDetails, setAgentDetails] = useState([]);

  const { state } = props.location;
  const row = state?.row || {};
  const agent = row.agent || {};
  const agentUser = agent.user || {};
  const bank = agent.bank || {};
  const singleAgent = agents[0] ? agents[0].user : "";
  const activationcodenumber = agents[0] ? agents[0].activationCode : "";
  const accountInformation = [agent.accountNumber, agent.accountName]
    .filter(Boolean)
    .join(", ");

  React.useEffect(() => {
    if (row.UserName) {
      FetchSingleAgents(row.UserName);
    }
  }, [FetchSingleAgents, row.UserName]);

  React.useEffect(() => {
    if (activateDeacivate) {
      setSmShow(true);
      setTitle("Action performed successfully");
      setDanger(false);
      setSucess(true);
    }
  }, [activateDeacivate]);

  useEffect(() => {
    if (activateDeacivate === false) {
      setTitle("Action not perform successfully");
      setDanger(true);
      setSucess(false);
      setSmShow(true);
    }
  }, [activateDeacivate]);

  const ActivateAgent = async (agentId, activationuser) => {
    await ActivateDeactivateUsers(agentId, !activationuser);
  };

  function DeActivateAgent(agentId, activationuser) {
    ActivateDeactivateUsers(agentId, !activationuser);
  }

  const ResetAgentPassword = async (agentId) => {
    await ResetPasswords(agentId);
  };

  useEffect(() => {
    if (resetSuccess) {
      setSmShow(true);
      setTitle("Password has been reset succesfully");
      setDanger(false);
      setSucess(true);
    }
  }, [resetSuccess]);

  useEffect(() => {
    if (resetSuccess === false) {
      setTitle(resetErrorMessage || "Password can't be reset");
      setDanger(true);
      setSucess(false);
      setSmShow(true);
    }
  }, [resetSuccess, resetErrorMessage]);

  function closemodal() {
    setSmShow(false);
    window.location.reload();
  }

  useEffect(() => {
    if (successActivation) {
      setTitle("Activation code generated successfully");
      setDanger(false);
      setSucess(true);
      setSmShow(true);
      return;
    }
  }, [successActivation]);

  useEffect(() => {
    if (successActivation === false) {
      setTitle("Activation code could not be generated ");
      setDanger(true);
      setSucess(false);
      setSmShow(true);
      return;
    }
  }, [successActivation]);

  const EditAgent = (details) => {
    showEditAgentModal(true);
    setAgentDetails(details);
  };

  const closeAgentModal = () => {
    showEditAgentModal(false);
    window.location.reload();
  };

  function ActivatateCode(agentId) {
    ActivatateCodes(agentId);
  }

  return (
    <DashboardTemplate>
      <SweetAlert
        show={smShow}
        success={success}
        danger={danger}
        title={title}
        showCancelButton
        onConfirm={() => {
          closemodal(false);
        }}
        onCancel={() => {
          closemodal(false);
        }}
        onEscapeKey={() => closemodal()}
        onOutsideClick={() => closemodal()}
      />
      <div className="transact-wrapper profile-page-shell">
        {loading && (
          <Loader
            type="Oval"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}
        <div className="header-title profile-page-header">
          <h3>Agent Profile</h3>
        </div>
        <div className="agent-transact-header profile-page-subheader">
          <div>Details of Agents on mCashPoint</div>
        </div>
        <NavLink to="/agents" className="profile-back-link">
          <button className="profile-back-button">
            <AiOutlineArrowLeft /> Back
          </button>
        </NavLink>

        {!state?.row ? (
          <section className="profile-card">
            <p className="profile-card-label">Agent details unavailable</p>
            <p>Open an agent profile from the agents table to view full details.</p>
          </section>
        ) : (
        <section className="profile-card">
          <div className="profile-card-top">
            <p className="profile-card-label">Agent Profile</p>
            <span
              className={`profile-status ${
                singleAgent && singleAgent.enabled
                  ? "profile-status--active"
                  : "profile-status--inactive"
              }`}
            >
              {singleAgent && singleAgent.enabled ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="profile-hero">
            <div className="profile-image-frame">
              <img
                src={image}
                alt="Agent profile"
                className="profile-avatar"
              />
              <span className="profile-image-badge">
                <FiEdit2 />
              </span>
            </div>

            <div className="profile-identity">
              <p className="profile-kicker">Registered agent</p>
              <h4>{formatValue(agentUser.fullName)}</h4>
              <div className="profile-meta">
                <span>
                  <RiSuitcaseLine />
                  {formatValue(row.BusinessName)}
                </span>
                <span>
                  <HiOutlineLocationMarker />
                  {formatValue(agent.businessAddress)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-card profile-info-card--wide">
              <label>Email</label>
              <p>{formatValue(agentUser.email)}</p>
            </div>

            <div className="profile-info-card">
              <label>Gender</label>
              <p>{formatValue(agent.gender)}</p>
            </div>

            <div className="profile-info-card">
              <label>Bank</label>
              <p>{formatValue(bank.name)}</p>
            </div>

            <div className="profile-info-card profile-info-card--wide">
              <label>Account Information</label>
              <p>{formatValue(accountInformation)}</p>
            </div>
          </div>

          <div className="profile-actions">
            {singleAgent && singleAgent.enabled === true ? (
              <button
                disabled={
                  name === "AMBASSADOR" && name === "AGENT" ? true : false
                }
                onClick={() =>
                  DeActivateAgent(agentUser.id, singleAgent.enabled)
                }
                className={`profile-action profile-action--danger ${
                  name === "AMBASSADOR" && name === "AGENT"
                    ? "hideAction"
                    : ""
                }`}
              >
                Deactivate
              </button>
            ) : (
              <button
                disabled={
                  name === "AMBASSADOR" && name === "AGENT" ? true : false
                }
                onClick={() => ActivateAgent(agentUser.id, singleAgent.enabled)}
                className={`profile-action profile-action--success ${
                  name === "AMBASSADOR" && name === "AGENT"
                    ? "hideAction"
                    : ""
                }`}
              >
                Activate
              </button>
            )}

            <button
              disabled={
                name === "AMBASSADOR" && name === "AGENT" ? true : false
              }
              className={`profile-action profile-action--primary ${
                name === "AMBASSADOR" && name === "AGENT" ? "hideAction" : ""
              }`}
              onClick={() => EditAgent(agents[0])}
            >
              Edit Agent
            </button>

            <button
              disabled={
                name === "AMBASSADOR" && name === "AGENT" ? true : false
              }
              className={`profile-action profile-action--primary ${
                name === "AMBASSADOR" && name === "AGENT" ? "hideAction" : ""
              }`}
              onClick={() => ResetAgentPassword(agentUser.id)}
            >
              Reset Password
            </button>

            {activationcodenumber === null ? (
              <button
                onClick={() => ActivatateCode(row.AgentID)}
                className="profile-action profile-action--success"
              >
                Generate Activation Code
              </button>
            ) : (
              <button className="profile-action profile-action--success">
                {activationcodenumber}
              </button>
            )}
          </div>
        </section>
        )}
      </div>
      <EditUser
        load={loading}
        show={editagent}
        close={closeAgentModal}
        agentDetails={agentDetails}
      />
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => {
  return {
    agents: state.agents.agents,
    loading: state.agents.loading,
    error: state.agents.error,
    activateDeacivate: state.agents.activateDeacivate,
    success: state.agents.success,
    resetSuccess: state.agents.resetSuccess,
    resetErrorMessage: state.agents.resetErrorMessage,
    successActivation: state.agents.successActivation,
  };
};

export default connect(mapStateToProps, {
  ActivateDeactivateUser,
  ResetPassword,
  FetchSingleAgent,
  ActivatateCode,
})(Profile);
