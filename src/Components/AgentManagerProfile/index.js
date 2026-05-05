import React from "react";
import DashboardTemplate from "../../Views/template/dashboardtemplate";
import Loader from "../../Components/secondLoader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiSuitcaseLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import image from "../../Assets/img/agentimage.png";

import "../AgentProfile/style.css";

const FALLBACK_TEXT = "Not available";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return FALLBACK_TEXT;
  }

  return value;
};

const Profile = (props) => {
  const { loading } = props;
  const { state } = props.location;
  const row = state?.row || {};
  const agentManager = row.Agent || {};
  const user = agentManager.user || {};
  const bank = agentManager.bank || {};
  const accountInformation = [agentManager.accountNumber, agentManager.accountName]
    .filter(Boolean)
    .join(", ");
  const locationText = [row.LGA, row.State].filter(Boolean).join(", ");

  return (
    <DashboardTemplate>
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
          <h3>Agent Manager Profile</h3>
        </div>
        <div className="agent-transact-header profile-page-subheader">
          <div>Details of Agent Managers on mCashPoint</div>
        </div>
        <NavLink to="/agentsmanager" className="profile-back-link">
          <button className="profile-back-button">
            <AiOutlineArrowLeft /> Back
          </button>
        </NavLink>

        {!state?.row ? (
          <section className="profile-card profile-card--manager">
            <p className="profile-card-label">Agent manager details unavailable</p>
            <p>Open an agent manager profile from the list to view full details.</p>
          </section>
        ) : (
        <section className="profile-card profile-card--manager">
          <div className="profile-card-top">
            <p className="profile-card-label">Agent Manager Profile</p>
          </div>

          <div className="profile-hero">
            <div className="profile-image-frame">
              <img
                src={image}
                alt="Agent manager profile"
                className="profile-avatar"
              />
              <span className="profile-image-badge">
                <FiEdit2 />
              </span>
            </div>

            <div className="profile-identity">
              <p className="profile-kicker">Regional manager</p>
              <h4>{formatValue(user.fullName)}</h4>
              <div className="profile-meta">
                <span>
                  <RiSuitcaseLine />
                  {formatValue(user.username)}
                </span>
                <span>
                  <HiOutlineLocationMarker />
                  {formatValue(agentManager.address || locationText)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-card profile-info-card--wide">
              <label>Email</label>
              <p>{formatValue(user.email)}</p>
            </div>

            <div className="profile-info-card">
              <label>Gender</label>
              <p>{formatValue(agentManager.gender)}</p>
            </div>

            <div className="profile-info-card">
              <label>Phone Number</label>
              <p>{formatValue(agentManager.phone)}</p>
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
        </section>
        )}
      </div>
    </DashboardTemplate>
  );
};

export default Profile;
