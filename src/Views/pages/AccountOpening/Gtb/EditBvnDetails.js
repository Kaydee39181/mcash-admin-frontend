import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
  Modal,
  Form,
  Container,
  Button,
  Image,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
//import Cancel from "../../../Assets/img/x.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  FetchState,
  FetchLga,
  FetchBank,
} from "../../../../Redux/requests/agentManagerRequest";
import Loader from "../../../../Components/secondLoader";
import "./style.css";
import moment from "moment";
import axios from "axios";
import { AgentConstant } from "../../../../constants/constants";
import AsyncSelect from "react-select/async";

const EditBvnDetails = ({
  create,
  CreateAgent: handleCreateAgent,
  close,
  FetchState: FetchStates,
  FetchLga: FetchLgas,
  FetchBank: FetchBankS,
  success,
  error,
  erroMessage,
  agentStates,
  agentLgas,
  data,
}) => {
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [accountDetails, setAccountDetails] = useState([]);
  const [logvt, setIsLogvt] = useState({});
  const [loading, setLoading] = useState(false);
  const [CreateAgentData, setCreateAgentData] = useState({
    RequestId: "",
    FirstName: data?.firstName,
    MiddleName: data?.middleName,
    LastName: data?.lastName,
    Gender: data?.gender,
    Channel: "",
    DateOfBirth: data?.dateOfBirth,
    StreetName: data?.residentialAddress,
    City: "",
    EmailAddress: data?.email,
    PhoneNumber: data?.phoneNumber,
    AccountOpeningBalance: "",
    AgentAcc: "",
    AuthMode: "",
    AuthValue: "",
    BankVerificationNumber: data?.bvn,
    UserId: "",
    stateOfOrigin: data?.stateOfOrigin,
    LocalGovtArea: data?.lgaOfOrigin,
    MothersMaidenName: "",
    PCCode: "",
    NDPRConsentFlag: "YES",
    AgentWalletID: "",
  });
  console.log(data);
  const [allAgents, setAllAgents] = useState();
  const getToken = JSON.parse(localStorage.getItem("data"));
  const [clicked, setClicked] = useState(false);
  const { access_token } = getToken;
  useEffect(() => {
    FetchStates();
    FetchBankS();
  }, []);

  useEffect(() => {
    if (erroMessage) {
      if (error && erroMessage.error !== "Already registered user") {
        return (
          setErrors([
            "There was an error sending your request, please try again later.",
          ]),
          SetSuccessMessage([])
        );
      } else if (erroMessage) {
        return setErrors(erroMessage.error);
      }
    }
  }, [error, erroMessage]);

  useEffect(() => {
    if (success) {
      return SetSuccessMessage(["operation Successful"]), setErrors([]);
    }
  }, [success]);

  const updateInput = (event) => {
    setCreateAgentData({
      ...CreateAgentData,
      [event.target.name]: event.target.value,
    });
  };
  const updatedob = (e) => {
    setCreateAgentData({
      ...CreateAgentData,
      [e.target.name]: moment(e.target.value).locale("en").format("MM/DD/YYYY"),
    });
  };
  const _handleSelectState = (e) => {
    const optionValue = JSON.parse(e.target.value);
    setCreateAgentData({
      ...CreateAgentData,
      [e.target.name]: optionValue.stateName,
    });
    FetchLgas(optionValue.stateCode);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const newData = {
      ...CreateAgentData,
      Gender: CreateAgentData.Gender == "Male" ? "M" : "F",
      DateOfBirth: moment(new Date(CreateAgentData.DateOfBirth))
        .locale("en")
        .format("MM/DD/YYYY"),
    };
    handleSubmit(newData);
  };

  const handleSubmit = (odata) => {
    setClicked(true);
    setLoading(true);
    let req = new Date();
    let ndata = {
      ...odata,
      RequestId: `${req.getTime()}`,
      Channel: "TP-MICROSYSTEMS",
      AccountOpeningBalance: "0",
      AgentAcc: "227806250",
      AuthMode: "MPIN",
      AuthValue: "1234",
      UserId: "22780625001",
      AgentWalletID: `${getToken.user.id}`,
    };
    console.log("dATA IS",ndata);
    const response = axios.post(`${AgentConstant.OPEN_GTB_ACCOUNT}`, ndata);
    response.then((res) => {
      console.log(res.data);
      setAccountDetails([res.data]);
      if (res?.data?.ResponseCode == "00") {
        axios
          .post(
            `https://account-opening-production.up.railway.app/api/gtaccounts/create-record`,
            {
              agentCode: `${getToken.user.username}`,
              accountCreated: `${res.data.AccountNumber}`,
            }
          )
          .then((data) => {
            setLoading(false);
            console.log(data);
          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
          });
      } else {
        setLoading(false);
      }
    });
  };
  console.log(accountDetails);
  return (
    <div>
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      {clicked && accountDetails.length > 0 ? (
        accountDetails[0]?.ResponseCode == "00" ? (
          <Modal
            show={clicked}
            onHide={() => {
              setClicked(false);
              window.location.reload();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Account Created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your Account Number is : {accountDetails[0].AccountNumber}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
                  window.location.reload();
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        ) : (
          <Modal
            show={clicked}
            onHide={() => {
              setClicked(false);
              window.location.reload();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>{accountDetails[0].ResponseDescription}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
                  window.location.reload();
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )
      ) : null}
      <div className="agent-table-wrapper">
        <h5>Open Bank Account</h5>
        <hr />
        <Form onSubmit={onSubmit}>
          {success ? <Alert variant="success">{successMessage}</Alert> : null}
          {error ? <Alert variant="danger">{errors}</Alert> : null}
          <h6>Personal Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter first name"
                  name="FirstName"
                  value={CreateAgentData.FirstName}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter middle name"
                  name="MiddleName"
                  value={CreateAgentData.MiddleName}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter last name"
                  name="LastName"
                  value={CreateAgentData.LastName}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  type="date"
                  required
                  placeholder="date of birth"
                  name="DateOfBirth"
                  defaultValue={moment(
                    new Date(CreateAgentData.DateOfBirth)
                  ).format("YYYY-MM-DD")}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email address"
                  name="EmailAddress"
                  value={CreateAgentData.EmailAddress}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="Gender"
                  onChange={updateInput}
                  value={CreateAgentData.Gender == "Male" ? "M" : "F"}
                >
                  <option>Select Gender</option>
                  <option value={"M"}>MALE</option>
                  <option value={"F"}>FEMALE</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Mother's Maiden Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter Mother's Maiden Name"
                  name="MothersMaidenName"
                  onChange={updateInput}
                  value={CreateAgentData.MothersMaidenName}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>PCCode</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter PCCode"
                  name="PCCode"
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label> NDPR Consent</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="NDPRConsentFlag"
                  onChange={updateInput}
                >
                  <option value={"YES"}>Yes</option>
                  <option value={"NO"}>No</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <h6>Business Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Street Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter street name"
                  name="StreetName"
                  onChange={updateInput}
                  value={CreateAgentData.StreetName}
                />
              </Form.Group>
            </Col>
            <Col md={8} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>City</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter City"
                  name="City"
                  onChange={updateInput}
                  value={CreateAgentData.City}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter phone number"
                  name="PhoneNumber"
                  value={CreateAgentData.PhoneNumber}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>State of Origin</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your state of origin"
                  name="PhoneNumber"
                  value={CreateAgentData.stateOfOrigin}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Local Government Area</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter phone number"
                  name="PhoneNumber"
                  value={CreateAgentData.LocalGovtArea}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            {/* <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="stateOfOrigin"
                  as="select"
                  onChange={_handleSelectState}
                >
                  <option>Select your state</option>
                  {agentStates.map((state, i) => {
                    return (
                      <option
                        key={i}
                        value={`{ "stateName": "${state.stateName}","stateCode": "${state.stateCode}", "stateId": ${state.id} }`}
                      >
                        {state.stateName}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col> */}
            {/* <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Local Govt Area</Form.Label>
                <Form.Control
                  as="select"
                  name="LocalGovtArea"
                  onChange={updateInput}
                >
                  <option disabled>Select your LGA</option>
                  {agentLgas.map((lga, i) => {
                    return (
                      <option value={lga.lga} key={i}>
                        {lga.lga}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col> */}
          </Row>

          <br />
          {/* <h6>Account Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Account BVN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Account BVN"
                  name="BankVerificationNumber"
                  onChange={updateInput}
                  value={CreateAgentData.BankVerificationNumber}
                />
              </Form.Group>
            </Col>
          </Row> */}
          <div className=" text-right">
            <Button variant="primary" className="text-white " type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    createAgent: state.agents.createAgent,
    agentStates: state.agentmanager.agentStates,
    agentLgas: state.agentmanager.agentLga,
    agentBanks: state.agentmanager.agentBanks,
    loading: state.agents.loading,
    erroMessage: state.agents.errorMessage,
    success: state.agents.createAgentsuccess,
    error: state.agents.error,
    loading: false,
    error: null,
    success: false,
  }
);

export default connect(mapStateToProps, {
  FetchState,
  FetchLga,
  FetchBank,
})(EditBvnDetails);
