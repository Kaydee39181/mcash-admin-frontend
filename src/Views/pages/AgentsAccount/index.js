import React, { useState, useEffect, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import Briefcase from "../../../Assets/img/briefcase.png";
import AgentImage from "../../../Assets/img/agentimage.png";
import Pin from "../../../Assets/img/mappin.png";
import Edit from "../../../Assets/img/edit.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import {
//   ToastsContainer,
//   ToastsStore,
//   ToastsContainerPosition,
// } from "react-toasts";
import { ToastContainer, toast } from "react-toastify";
import {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
} from "../../../Redux/requests/transactionRequest";
import {
  Nav,
  NavItem,
  NavLink,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import Pagination from "react-js-pagination";
import ViewReceipts from "../../../Components/viewReceipt";

import { connect } from "react-redux";

import "./style.css";
import { ActivatateCode } from "../../../Redux/requests/agentRequest";
import SweetAlert from "react-bootstrap-sweetalert";
// import ExportLink from '../Exports/index';

const Transactions = (props) => {
  const token = JSON.parse(localStorage.getItem("data"));
  const [details, setDetails] = useState([]);
  const [title, setTitle] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [danger, setDanger] = useState(false);
  const [success, setSucess] = useState(false);
  const { ActivatateCode: ActivatateCodes, successActivation } = props;

  useEffect(() => {
    axios
      .get(
        `https://api.mcashpoint.com/api/v1/agent/?username=${token.user.username}`,
        {
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const response = res.data;
        setDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
        // dispatch(asyncActions(FETCH_ADMIN_USERS).failure(true, error));
      });
  }, []);

  useEffect(() => {
    if (successActivation) {
      setTitle("Activation code generated successfully");
      setDanger(false);
      setSucess(true);
      setSmShow(true);
    }
  }, [successActivation]);

  function ActivatateCode(agentId) {
    // setActivation(null);
    ActivatateCodes(agentId);
  }

  function closemodal() {
    setSmShow(false);
    window.location.reload();
  }

  return (
    <DashboardTemplate>
      <SweetAlert
        show={smShow}
        success={success}
        danger={danger}
        title={title}
        onConfirm={() => {
          closemodal();
        }}
        onCancel={() => {
          closemodal(false);
        }}
        onEscapeKey={() => closemodal()}
        onOutsideClick={() => closemodal()}
      />
      <div className="container bg-white mt-5 p-0">
        <div
          className="header-title p-4"
          style={{ borderBottom: "0.7px solid #E2E2E2", width: "100%" }}
        >
          <h3>Agents Profile</h3>
        </div>
        {details.map((item) => (
          <div key={item.id} className="container px-5 py-4">
            <div className="row">
              <div className="col-md-3">
                <div style={{ width: "70%", height: "auto" }}>
                  <img
                    src={AgentImage}
                    style={{ position: "relative", width: "100%" }}
                  />
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#9FA2B4",
                      display: "flex",
                      justifyContent: "center",
                      position: "absolute",
                      right: "30%",
                      bottom: "12px",
                    }}
                  >
                    <img
                      src={Edit}
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <h3
                  className="mt-4"
                  style={{
                    fontSize: "26px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {item.accountName}
                </h3>
                <div className="container-fluid pl-0">
                  <img
                    src={Briefcase}
                    style={{ width: "20px", height: "auto" }}
                  />
                  <span
                    className="m-2 mt-5 p-1 pb-0"
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#606060",
                    }}
                  >
                    {item.businessName}
                  </span>
                </div>
                <div className="container-fluid pl-0">
                  <img src={Pin} style={{ width: "20px", height: "auto" }} />
                  <span
                    className="m-2 mt-5 p-1 pb-0"
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#606060",
                    }}
                  >
                    {item.businessAddress}
                  </span>
                </div>
              </div>
              <div className="col-md-12">
                <div className="container-fluid m-0  mt-4 pt-3">
                  <div className="row">
                    <div className="col-md-8">
                      <div
                        className="container bg-light   p-3 mt-4"
                        style={{ borderRadius: "8px" }}
                      >
                        <h3 style={{ fontSize: "18px", color: "#606060" }}>
                          Email
                        </h3>
                        <h3
                          style={{
                            fontSize: "20px",
                            color: "#000000",
                            fontWeight: "600",
                          }}
                        >
                          {item.user.email}
                        </h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="container bg-light br-4 p-3 mt-4"
                        style={{ borderRadius: "8px" }}
                      >
                        <h3 style={{ fontSize: "18px", color: "#606060" }}>
                          Gender
                        </h3>
                        <h3
                          style={{
                            fontSize: "20px",
                            color: "#000000",
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.gender}
                        </h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="container bg-light br-4 p-3 mt-4"
                        style={{ borderRadius: "8px" }}
                      >
                        <h3 style={{ fontSize: "18px", color: "#606060" }}>
                          Bank
                        </h3>
                        <h3
                          style={{
                            fontSize: "20px",
                            color: "#000000",
                            fontWeight: "600",
                          }}
                        >
                          {item.bank.name}
                        </h3>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div
                        className="container bg-light br-4 p-3 mt-4"
                        style={{ borderRadius: "8px" }}
                      >
                        <h3 style={{ fontSize: "18px", color: "#606060" }}>
                          Account Information
                        </h3>
                        <h3
                          style={{
                            fontSize: "20px",
                            color: "#000000",
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.accountNumber} , {item.accountName}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="container-fluid pt-4  mt-5">
                  <div className="row">
                    {/* <div className="col-md-3">
                      <button
                        className="btn btn-block btn-danger p-3 mt-1"
                        style={{
                          width: "80%",
                          margin: "0px auto",
                          borderRadius: "10px",
                        }}
                      >
                        DEACTIVATE
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-block btn-secondary p-3 mt-1"
                        style={{
                          width: "80%",
                          margin: "0px auto",
                          borderRadius: "10px",
                        }}
                      >
                        RESET PASSWORD
                      </button>
                    </div> */}

                    {item.activationCode ? (
                      <div className="col-md-5">
                        <button
                          className="btn  btn-primary p-3 mt-1"
                          style={{
                            width: "80%",
                            margin: "0px auto",
                            borderRadius: "10px",
                            cursor: "text",
                          }}
                        >
                          Activation Code: {item.activationCode}
                        </button>
                      </div>
                    ) : (
                      <div className="col-md-5">
                        <button
                          className="btn btn-primary p-3 mt-1"
                          style={{
                            width: "80%",
                            margin: "0px auto",
                            borderRadius: "10px",
                          }}
                          onClick={() => ActivatateCode(item.id)}
                        >
                          GENERATE ACTIVATION CODE
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardTemplate>
  );
};
const mapStateToProps = (state) => (
  console.log(state),
  {
    transaction: state.transactions.transactions,
    transactionsType: state.transactions.transactionsType,
    transactionStatus: state.transactions.transactionStatus,
    loading: state.transactions.loading,
    error: state.transactions.error,
    transactionTotal: state.transactions.transactionTotal,
    successTransaction: state.transactions.successTransaction,
    successActivation: state.agents.successActivation,
  }
);

export default connect(mapStateToProps, {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
  ActivatateCode,
})(Transactions);
