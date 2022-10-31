import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

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
import Cancel from "../../../Assets/img/x.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  FetchState,
  FetchLga,
  FetchBank,
} from "../../../Redux/requests/agentManagerRequest";
import { UpdateAgent } from "../../../Redux/requests/agentRequest";
import Loader from "../../../Components/secondLoader";
import "./style.css";
const CreateAgentModal = ({
  create,
  show,
  UpdateAgent: handleUpdateAgent,
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
  agentBanks,
  createAgent,
  agentDetails,
  load,
}) => {
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [logvt, setIsLogvt] = useState({});
  const [CreateAgentData, setCreateAgentData] = useState([]);
  const {
    dateOfBirth,
    businessName,
    businessAddress,
    accountName,
    accountNumber,
    accountBvn,
    businessPhone,
    user,
    gender,
    state,
    lga,
    bank,
  } = agentDetails;

  console.log(agentDetails);

  useEffect(() => {
    FetchStates();
    FetchBankS();
  }, []);

  useEffect(() => {
    console.log(error, erroMessage);
    if (erroMessage) {
      if (error && erroMessage.error != "Already registered user") {
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

  const _handleSelectState = (e) => {
    agentStates.map((state, i) => {
      let stateId = state.id;

      setCreateAgentData({
        ...CreateAgentData,
        [e.target.name]: stateId,
      });
    });
    let stateCode = e.target.value;
    FetchLgas(stateCode);
  };

  const _handleSelectBank = (e) => {
    let stateCode = e.target.value;
    FetchLgas(stateCode);

    setCreateAgentData({
      ...CreateAgentData,
      [e.target.name]: stateCode,
    });
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    handleUpdateAgent(data);
  };

  return (
    <div>
      <Modal
        size="lg"
        show={show}
        onHide={close}
        centered={true}
        aria-labelledby="edit-profile-modal"
        className="rounded border"
      >
        <Modal.Body>
          {load && (
            <Loader
              type="TailSpin"
              type="Oval"
              height={60}
              width={60}
              color="#1E4A86"
            />
          )}
          {loading && (
            <Loader
              type="TailSpin"
              type="Oval"
              height={60}
              width={60}
              color="#1E4A86"
            />
          )}

          <div className="agent-table-wrapper">
            <h5>Create Agent</h5>
            <hr />
            <Form onSubmit={handleSubmit(onSubmit)}>
              {success ? (
                <Alert variant="success">{successMessage}</Alert>
              ) : null}
              {error ? <Alert variant="danger">{errors}</Alert> : null}
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
                      onChange={updateInput}
                      defaultValue={user ? user.firstname : ""}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={user ? user.middlename : ""}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={user ? user.lastname : ""}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={
                        dateOfBirth ? dateOfBirth.split(" ")[0] : ""
                      }
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={user ? user.email : ""}
                      ref={register({ required: true })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      onChange={updateInput}
                      ref={register({ required: true })}
                    >
                      <option>{gender}</option>
                      <option>MALE</option>
                      <option>FEMALE</option>
                    </Form.Control>
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
                      onChange={updateInput}
                      defaultValue={businessName}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={businessAddress}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={businessPhone}
                      ref={register({ required: true })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      name="stateId"
                      as="select"
                      onChange={_handleSelectState}
                      ref={register({ required: true })}
                    >
                      <option value={state ? state.id : ""}>
                        {state ? state.stateName : ""}
                      </option>
                      {agentStates.map((states, i) => {
                        console.log(state);
                        return (
                          <option key={i} value={states.stateCode}>
                            {states.stateName}
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
                      onChange={updateInput}
                      ref={register({ required: true })}
                    >
                      <option value={lga ? lga.id : ""}>
                        {lga ? lga.lga : ""}
                      </option>
                      {agentLgas.map((lga, i) => {
                        return (
                          <option value={lga.id} key={i}>
                            {lga.lga}
                          </option>
                        );
                      })}
                    </Form.Control>
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
                      onChange={updateInput}
                      ref={register({ required: true })}
                      defaultValue={accountNumber}
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
                      onChange={updateInput}
                      defaultValue={accountName}
                      ref={register({ required: true })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      name="bankId"
                      as="select"
                      onChange={_handleSelectBank}
                      ref={register({ required: true })}
                    >
                      <option value={bank ? bank.id : ""}>
                        {bank ? bank.name : ""}
                      </option>
                      {agentBanks.map((bank, i) => {
                        console.log(bank);
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
                      onChange={updateInput}
                      defaultValue={accountBvn}
                      ref={register({ required: true })}
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
                      onChange={updateInput}
                      defaultValue={user ? user.username : ""}
                      ref={register({ required: true })}
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

CreateAgentModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    updateAgent: state.agents.updateAgent,
    agentStates: state.agentmanager.agentStates,
    agentLgas: state.agentmanager.agentLga,
    agentBanks: state.agentmanager.agentBanks,
    loading: state.agents.loading,
    erroMessage: state.agents.errorMessage,
    success: state.agents.updateAgentsuccess,
    error: state.agents.error,
  }
);

export default connect(mapStateToProps, {
  FetchState,
  FetchLga,
  FetchBank,
  UpdateAgent,
})(CreateAgentModal);
