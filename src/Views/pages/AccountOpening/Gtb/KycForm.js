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

const KycForm = ({
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
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [logvt, setIsLogvt] = useState({});
  const [CreateAgentData, setCreateAgentData] = useState({
    RequestId: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    Channel: "",
    DateOfBirth: "",
    StreetName: "",
    City: "",
    EmailAddress: "",
    PhoneNumber: "",
    AccountOpeningBalance: "",
    AgentAcc: "",
    AuthMode: "",
    AuthValue: "",
    BankVerificationNumber: "",
    UserId: "",
    stateOfOrigin: "",
    LocalGovtArea: "",
    MothersMaidenName: "",
    PCCode: "",
    AgentWalletID: "",
  });
  const [allAgents, setAllAgents] = useState();
  const [accountDetails, setAccountDetails] = useState([]);
  const getToken = JSON.parse(localStorage.getItem("data"));
  const [clicked, setClicked] = useState(false);
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
    handleSubmit(CreateAgentData);
  };

  const handleSubmit = async (odata) => {
    setClicked(true);
    setLoading(true);
    let req = new Date();

    let ndata = {
      ...odata,
      RequestId: req.getTime(),
      Channel: "TP-MICROSYSTEMS",
      AccountOpeningBalance: "0",
      AgentAcc: "227806250",
      AuthMode: "MPIN",
      AuthValue: "1234",
      UserId: "22780625001",
      AgentWalletID: getToken.user.id,
    };
    const data = axios.post(`${AgentConstant.OPEN_GTB_ACCOUNT}`, ndata);
    /*  let ndata = {
      ...odata,
      RequestId: `${req.getTime()}`,
      Channel: "TP-MICROSYSTEMS",
      AccountOpeningBalance: "0",
      AgentAcc: "0320232115",
      AuthMode: "MPIN",
      AuthValue: "1234",
      UserId: "20516781701  ",
      AgentWalletID: `${getToken.user.id}`,
    };
    console.log(ndata);
    const data = axios.post(
      `http://gtweb6.gtbank.com/WEBAPIs/PubEncrypt4/AccountOpeningNew/Api/AccountOpening3`,
      ndata
    );
 */
    data.then(async (res) => {
      //console.log(res.data);
      setLoading(false);
      setAccountDetails([res.data]);
      if (res?.data?.ResponseCode == "00") {
        await axios
          .post(`http://165.22.35.35:8000/api/gtaccounts/create-record`, {
            agentCode: `${getToken.user.username}`,
            accountCreated: `${res.data.AccountNumber}`,
          })
          .then((data) => {
            console.log(data);
          });
      }
    });

    //console.log(data);
  };
  //console.log(accountDetails);
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
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Account Created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Your Account Number is : ${accountDetails[0].AccountNumber}</p>
              <p>
                Please use your POS to fund your new account with at least 1000
                naira
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
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
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>An Error Occurred. Please try again later</Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
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
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter middle name"
                  name="MiddleName"
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
                  required
                  type="date"
                  placeholder="date of birth"
                  name="DateOfBirth"
                  onChange={updatedob}
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
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="Gender"
                  onChange={updateInput}
                  required
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
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={updateInput}
                />
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
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>State</Form.Label>
                <Form.Control
                  required
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
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Local Govt Area</Form.Label>
                <Form.Control
                  required
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
            </Col>
          </Row>

          <br />
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

KycForm.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
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
})(KycForm);
