import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
// import Cancel from "../../../Assets/img/x.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  FetchState,
  FetchLga,
  FetchBank,
} from "../../../Redux/requests/agentManagerRequest";
import { CreateAgent } from "../../../Redux/requests/agentRequest";
import Loader from "../../../Components/secondLoader";
import "./style.css";
import moment from "moment";
import axios from "axios";
import { AgentConstant } from "../../../constants/constants";
import AsyncSelect from "react-select/async";
import { safeParseStoredAuth } from "../../../utils/auth";

const initialCreateAgentData = {
  accountNumber: "",
  accountName: "",
  accountBvn: "",
  businessName: "",
  dateOfBirth: "",
  businessPhone: "",
  businessAddress: "",
  gender: "",
  firstname: "",
  middlename: "",
  lastname: "",
  email: "",
  username: "",
  stateId: "",
  lgaId: "",
  bankId: "",
  agentManagerId: "",
};

const getRequestErrorMessage = (requestError) => {
  if (!requestError) {
    return "There was an error sending your request, please try again later.";
  }

  if (typeof requestError === "string") {
    return requestError;
  }

  return (
    requestError?.response?.data?.responseMessage ||
    requestError?.response?.data?.message ||
    requestError?.message ||
    "There was an error sending your request, please try again later."
  );
};

const CreateAgentModal = ({
  create,
  show,
  CreateAgent: handleCreateAgent,
  close,
  FetchState: FetchStates,
  FetchLga: FetchLgas,
  FetchBank: FetchBankS,
  success,
  error,
  loading,
  erroMessage,
  agentStates,
  agentLgas,
  agentLgaLoading,
  agentLgaError,
  agentLgaErrorMessage,
  agentBanks,
  createAgent,
}) => {
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedAgentManager, setSelectedAgentManager] = useState(null);
  const [CreateAgentData, setCreateAgentData] = useState(initialCreateAgentData);
  const getToken = safeParseStoredAuth();
  const access_token = getToken?.access_token || "";

  useEffect(() => {
    FetchStates();
    FetchBankS();
  }, [FetchStates, FetchBankS]);

  useEffect(() => {
    if (error && erroMessage) {
      setErrors([getRequestErrorMessage(erroMessage.error)]);
      SetSuccessMessage([]);
    }
  }, [error, erroMessage]);

  useEffect(() => {
    if (success) {
      SetSuccessMessage(["Operation successful."]);
      setErrors([]);
      setSelectedStateCode("");
      setSelectedAgentManager(null);
      setCreateAgentData(initialCreateAgentData);
    }
  }, [success]);

  useEffect(() => {
    if (!selectedStateCode) {
      return;
    }

    FetchLgas(selectedStateCode);
  }, [FetchLgas, selectedStateCode]);

  const SearchAgentManagers = async (searchQuery) => {
    try {
      const res = await axios.get(
        `${AgentConstant.FETCH_ALL_AGENT_MANAGERS}?username=${searchQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${access_token}`,
          },
        }
      );
      const agentData = res?.data?.data?.map((agent) => ({
        label: agent.user.fullName,
        value: agent.id,
      }));
      return agentData;
    } catch (error) {
      console.log("error ===> ", error?.response);
    }
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(SearchAgentManagers(inputValue));
      }, 1000);
    });

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, "");
    return inputValue;
  };

  const updateInput = (event) => {
    const { name, value } = event.target;

    setErrors([]);
    setCreateAgentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const _handleSelectState = (e) => {
    const selectedState = agentStates.find(
      (stateItem) => String(stateItem.id) === e.target.value
    );

    setErrors([]);
    setSelectedStateCode(selectedState ? selectedState.stateCode : "");
    setCreateAgentData((prevState) => ({
      ...prevState,
      stateId: selectedState ? String(selectedState.id) : "",
      lgaId: "",
    }));
  };

  const _handleSelectBank = (e) => {
    const { name, value } = e.target;

    setErrors([]);
    setCreateAgentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const validationErrors = [];

    if (!CreateAgentData.stateId) {
      validationErrors.push("Select a state before submitting.");
    }

    if (!CreateAgentData.lgaId) {
      validationErrors.push("Select an LGA before submitting.");
    }

    if (agentLgaError) {
      validationErrors.push(
        agentLgaErrorMessage || "Unable to load LGAs for the selected state."
      );
    }

    if (
      selectedStateCode &&
      !agentLgaLoading &&
      !agentLgaError &&
      agentLgas.length === 0
    ) {
      validationErrors.push("No LGAs available for the selected state.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      SetSuccessMessage([]);
      return;
    }

    handleCreateAgent(CreateAgentData);
  };

  const visibleLgas = selectedStateCode ? agentLgas : [];
  const lgaUnavailable =
    !!selectedStateCode &&
    !agentLgaLoading &&
    !agentLgaError &&
    visibleLgas.length === 0;
  const lgaPlaceholder = !selectedStateCode
    ? "Select a state first"
    : agentLgaLoading
      ? "Loading LGAs..."
      : agentLgaError
        ? "Unable to load LGAs"
      : lgaUnavailable
        ? "No LGAs available"
        : "Select your LGA";
  const lgaSelectDisabled =
    !selectedStateCode || agentLgaLoading || agentLgaError || lgaUnavailable;

  return (
    <div>
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}

      <div className="agent-table-wrapper">
        <h5>Create Agent</h5>
        <hr />
        <Form onSubmit={onSubmit}>
          {successMessage.length > 0 ? (
            <Alert variant="success">{successMessage.join(" ")}</Alert>
          ) : null}
          {errors.length > 0 ? (
            <Alert variant="danger">{errors.join(" ")}</Alert>
          ) : null}
          <h6>Personal Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstname"
                  value={CreateAgentData.firstname}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter middle name"
                  name="middlename"
                  value={CreateAgentData.middlename}
                  onChange={updateInput}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastname"
                  value={CreateAgentData.lastname}
                  onChange={updateInput}
                  required
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
                  placeholder="date of birth"
                  name="dateOfBirth"
                  value={CreateAgentData.dateOfBirth}
                  onChange={updateInput}
                  max={moment().locale("en").format("YYYY-MM-DD")}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  value={CreateAgentData.email}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={CreateAgentData.gender}
                  onChange={updateInput}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option>MALE</option>
                  <option>FEMALE</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <label>Agent Manager</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={promiseOptions}
                  defaultOptions
                  value={selectedAgentManager}
                  isClearable
                  onChange={(val) => {
                    setSelectedAgentManager(val || null);
                    updateInput({
                      target: {
                        value: val ? val.value : "",
                        name: "agentManagerId",
                      },
                    });
                  }}
                  name="agentManagerId"
                  onInputChange={handleInputChange}
                  className="mb-3"
                />
              </Form.Group>
            </Col>
          </Row>
          <h6>Business Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="businessName"
                  value={CreateAgentData.businessName}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={8} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Business Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Business address"
                  name="businessAddress"
                  value={CreateAgentData.businessAddress}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Business Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business phone number"
                  name="businessPhone"
                  value={CreateAgentData.businessPhone}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="stateId"
                  as="select"
                  value={CreateAgentData.stateId}
                  onChange={_handleSelectState}
                  required
                >
                  <option value="" disabled>
                    Select your state
                  </option>
                  {agentStates.map((state, i) => {
                    return (
                      <option key={i} value={state.id}>
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
                  as="select"
                  name="lgaId"
                  value={CreateAgentData.lgaId}
                  onChange={updateInput}
                  disabled={lgaSelectDisabled}
                  required
                >
                  <option value="" disabled>
                    {lgaPlaceholder}
                  </option>
                  {visibleLgas.map((lga, i) => {
                    return (
                      <option value={String(lga.id)} key={i}>
                        {lga.lga}
                      </option>
                    );
                  })}
                </Form.Control>
                {agentLgaError ? (
                  <Form.Text className="text-danger">
                    {agentLgaErrorMessage || "Unable to load LGAs for the selected state."}
                  </Form.Text>
                ) : lgaUnavailable ? (
                  <Form.Text className="text-danger">
                    No LGAs available for the selected state.
                  </Form.Text>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <br />
          <h6>Account Information</h6>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Account Number"
                  name="accountNumber"
                  value={CreateAgentData.accountNumber}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Account Name </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter account name"
                  name="accountName"
                  value={CreateAgentData.accountName}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  name="bankId"
                  as="select"
                  value={CreateAgentData.bankId}
                  onChange={_handleSelectBank}
                  required
                >
                  <option value="" disabled>
                    Select your bank
                  </option>
                  {agentBanks.map((bank, i) => {
                    return (
                      <option key={i} value={bank.id}>
                        {bank.name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Account BVN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Account BVN"
                  name="accountBvn"
                  value={CreateAgentData.accountBvn}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={CreateAgentData.username}
                  onChange={updateInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
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

CreateAgentModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    createAgent: state.agents.createAgent,
    agentStates: state.agentmanager.agentStates,
    agentLgas: state.agentmanager.agentLga,
    agentLgaLoading: state.agentmanager.agentLgaLoading,
    agentLgaError: state.agentmanager.agentLgaError,
    agentLgaErrorMessage: state.agentmanager.agentLgaErrorMessage,
    agentBanks: state.agentmanager.agentBanks,
    loading: state.agents.loading,
    erroMessage: state.agents.errorMessage,
    success: state.agents.createAgentsuccess,
    error: state.agents.error,
  };
};

export default connect(mapStateToProps, {
  FetchState,
  FetchLga,
  FetchBank,
  CreateAgent,
})(CreateAgentModal);
