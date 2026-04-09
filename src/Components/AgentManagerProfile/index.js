import React from "react";
import DashboardTemplate from "../../Views/template/dashboardtemplate";
import Loader from "../../Components/secondLoader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiSuitcaseLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import image from "../../Assets/img/agentimage.png";

// import "./style.css";
const Profile = (props) => {
    const { loading } = props;


    const { state } = props.location;

    const { Agent } = state.row;
    console.log(Agent);
    return (
        <DashboardTemplate>


            <div className="transact-wrapper">
                {loading && (
                    <Loader
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
                <NavLink to="/agentsmanager">
                    <button className="butn btns">
                        <AiOutlineArrowLeft /> Back
            </button>
                </NavLink>

                <div className="profile-wrapper">
                    <p className="header">Agent Profile</p>
                    <hr />
                    <div className="edit"><FiEdit2 /></div>
                    <div className="biodata">
                        <div className="address">
                            <div className="profile-image">
                                <img src={image} alt="Agent profile" />
                            </div>
                            <div className="info">
                            <h6>{Agent ? Agent.user.fullName : ''}</h6>
                                <label>
                                    {" "}
                                    <RiSuitcaseLine />
                                    {Agent? Agent.user.username : ''}

                                </label>
                                <label>
                                    {" "}
                                    <HiOutlineLocationMarker />
                                    {Agent ? Agent.address : ''}
                                </label>
                            </div>
                        </div>
                        <div className="emailgender">
                            <div className="email">
                                <label>Email</label>
                                <p>
                                    <b>{Agent?Agent.user.email:''}</b>
                                </p>
                            </div>
                            <div className="gender">
                                <label>Gender</label>
                                <p>{Agent.gender}</p>
                            </div>
                        </div>
                        <div className="bank">
                            <div className="bank-name">
                                <label>Bank</label>
                                <p>{Agent.bank?Agent.bank.name:''}</p>
                            </div>
                            <div className="bank-acct">
                                <label>Account Information</label>
                                <p>{Agent.accountName} {Agent.accountNumber}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </DashboardTemplate>
    );
};



export default Profile
