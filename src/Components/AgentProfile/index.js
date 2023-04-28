import React, { useState, useEffect } from "react";
import DashboardTemplate from "../../Views/template/dashboardtemplate";
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "../../Components/secondLoader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiSuitcaseLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { Container, Button, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Upload from "../../Assets/img/upload.png";
import Filter from "../../Assets/img/filter.png";
import Print from "../../Assets/img/printer.png";
import Success from "../../Assets/img/success.svg";
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

import "./style.css";
const Profile = (props) => {
  const token = JSON.parse(localStorage.getItem("data"));
  let { name } = token.user.roleGroup;
  const {
    loading,
    ActivateDeactivateUser: ActivateDeactivateUsers,
    ResetPassword: ResetPasswords,
    resetSuccess,
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

  const singleAgent = agents[0] ? agents[0].user : "";
  const activationcodenumber = agents[0] ? agents[0].activationCode : "";

  React.useEffect(() => {
    FetchSingleAgents(state.row.UserName);
  }, []);

  React.useEffect(() => {
    if (activateDeacivate) {
      setSmShow(true);
      setTitle("Action performed successfully");
      setDanger(false);
      setSucess(true);
    }
  }, [activateDeacivate]);

  useEffect(() => {
    if (activateDeacivate == false) {
      setTitle("Action not perform successfully");
      setDanger(true);
      setSucess(false);
      setSmShow(true);
    }
  }, [activateDeacivate]);

  const ActivateAgent = async (agentId, activationuser) => {
    // ActivateDeactivateUsers(agentId, !activationuser)
    const res = await ActivateDeactivateUsers(agentId, !activationuser);
    console.log(res);
  };
  function DeActivateAgent(agentId, activationuser) {
    ActivateDeactivateUsers(agentId, !activationuser);
  }

  const ResetAgentPassword = async (agentId) => {
    const res = await props.ResetPassword(agentId);
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
    if (resetSuccess == false) {
      setTitle("Password can't be reset");
      setDanger(true);
      setSucess(false);
      setSmShow(true);
    }
  }, [resetSuccess]);

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
    if (successActivation == false) {
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
    // setActivation(null);
    ActivatateCodes(agentId);
  }

  return (
    <DashboardTemplate>
      {/* <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body >
          <div class="d-flex align-items-center justify-content-center  flex-column">
            <img src={Success} />
            <p className=''>Password Reset Successfully</p>
            <button class='okaybotton' onClick={() => setSmShow(false)} >OK</button>
          </div>

        </Modal.Body>
      </Modal> */}
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
      <div className="transact-wrapper">
        {loading && (
          <Loader
            type="TailSpin"
            type="Oval"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}
        <div className="header-title">
          <h3>Agent Profile</h3>
        </div>
        <div className="agent-transact-header">
          <div>Details of Agents on mCashPoint</div>
        </div>
        <NavLink to="/agents">
          <button className="butn btns">
            <AiOutlineArrowLeft /> Back
          </button>
        </NavLink>

        <div className="profile-wrapper">
          <p className="header">Agent Profile</p>
          <hr />

          <div className="biodata">
            <div className="address">
              <div className="profile-image">
                <div className="edit">
                  <FiEdit2 />
                </div>
                <img src={image}></img>
              </div>
              <div className="info">
                <h6>{state.row ? state.row.agent.user.fullName : ""}</h6>
                <label>
                  {" "}
                  <RiSuitcaseLine />
                  {state.row ? state.row.BusinessName : ""}
                </label>
                <label>
                  {" "}
                  <HiOutlineLocationMarker />
                  {state.row.agent ? state.row.agent.businessAddress : ""}
                </label>
              </div>
            </div>
            <div className="emailgender">
              <div className="email">
                <label>Email</label>
                <p>
                  <b>{state.row ? state.row.agent.user.email : ""}</b>
                </p>
              </div>
              <div className="gender">
                <label>Gender</label>
                <p>{state.row ? state.row.agent.gender : ""}</p>
              </div>
            </div>
            <div className="bank">
              <div className="bank-name">
                <label>Bank</label>
                <p>{state.row ? state.row.agent.bank.name : ""}</p>
              </div>
              <div className="bank-acct">
                <label>Account Information</label>
                <p>
                  {state.row ? state.row.agent.accountNumber : ""},{" "}
                  {state.row ? state.row.agent.accountName : ""}
                </p>
              </div>
            </div>
            <div className="btn-group">
              {console.log(singleAgent)}
              {singleAgent && singleAgent.enabled == true ? (
                <button
                  disabled={
                    name == "AMBASSADOR" && name == "AGENT" ? true : false
                  }
                  onClick={() =>
                    DeActivateAgent(
                      state.row.agent.user.id,
                      singleAgent.enabled
                    )
                  }
                  className={`btn1 btns ${
                    name == "AMBASSADOR" && name == "AGENT" ? "hideAction" : ""
                  }`}
                >
                  DEACTIVATE
                </button>
              ) : (
                <button
                  disabled={
                    name == "AMBASSADOR" && name == "AGENT" ? true : false
                  }
                  onClick={() =>
                    ActivateAgent(state.row.agent.user.id, singleAgent.enabled)
                  }
                  className={`btn3 btns ${
                    name == "AMBASSADOR" && name == "AGENT" ? "hideAction" : ""
                  }`}
                >
                  ACTIVATE
                </button>
              )}

              <button
                disabled={
                  name == "AMBASSADOR" && name == "AGENT" ? true : false
                }
                className={`btn2 btns ${
                  name == "AMBASSADOR" && name == "AGENT" ? "hideAction" : ""
                }`}
                onClick={() => EditAgent(agents[0])}
              >
                Edit Agent
              </button>

              <button
                disabled={
                  name == "AMBASSADOR" && name == "AGENT" ? true : false
                }
                className={`btn2 btns ${
                  name == "AMBASSADOR" && name == "AGENT" ? "hideAction" : ""
                }`}
                onClick={() => ResetAgentPassword(state.row.agent.user.id)}
              >
                RESET PASSWORD
              </button>
              {state.row ? state.row.agent.activationCode : ""}
              {activationcodenumber == null ? (
                <button
                  onClick={() => ActivatateCode(state.row.AgentID)}
                  className="btn3 btns"
                >
                  GENERATE ACTIVATION CODE
                </button>
              ) : (
                <button className="btn3 btns">{activationcodenumber}</button>
              )}
            </div>
          </div>
        </div>
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

const mapStateToProps = (state) => (
  console.log(state),
  {
    agents: state.agents.agents,
    loading: state.agents.loading,
    error: state.agents.error,
    activateDeacivate: state.agents.activateDeacivate,
    success: state.agents.success,
    resetSuccess: state.agents.resetSuccess,
    agents: state.agents.agents,
    successActivation: state.agents.successActivation,
  }
);

export default connect(mapStateToProps, {
  ActivateDeactivateUser,
  ResetPassword,
  FetchSingleAgent,
  ActivatateCode,
})(Profile);
