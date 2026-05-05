import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Container,
  Button,
  // Image,
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
  CreateAgentManager,
} from "../../../Redux/requests/agentManagerRequest";
import Loader from "../../../Components/secondLoader";
import moment from "moment";
import ErrorAlert from "../../../Components/alerts";

const CreateAgentModal = ({
  create,
  show,
  CreateAgentManager: handleCreateAgentManager,
  close,
  FetchState: FetchStates,
  FetchLga: FetchLgas,
  FetchBank: FetchBankS,
  loading,
  agentStates,
  agentLgas,
  agentBanks,
  success,
  error,
  errorMessage,
  agentLgaLoading,
  agentLgaError,
  agentLgaErrorMessage,
}) => {
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([
    "Create Agent Manager",
  ]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const formRef = useRef(null);

  const [CreateAgentData, setCreateAgentData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    phone: "",
    accountName: "",
    accountNumber: "",
    address: "",
    accountBvn: "",
    dateOfBirth: moment().locale("en").format("YYYY-MM-DD"),
    username: "",
    nationality: "",
    identityType: "",
    stateId: "",
    lgaId: "",
    bankId: "",
  });

  useEffect(() => {
    FetchStates();
    FetchBankS();
  }, [FetchBankS, FetchStates]);

  useEffect(() => {
    if (error) {
      return setErrors([
        error
          ? error.error
          : "There was an error sending your request, please try again later.",
      ]);
    }
  }, [error, errorMessage]);

  useEffect(() => {
    if (success) {
      formRef.current?.reset();
      setSelectedStateCode("");
      setCreateAgentData({
        firstname: "",
        lastname: "",
        gender: "",
        email: "",
        phone: "",
        accountName: "",
        accountNumber: "",
        address: "",
        accountBvn: "",
        dateOfBirth: moment().locale("en").format("YYYY-MM-DD"),
        username: "",
        nationality: "",
        identityType: "",
        stateId: "",
        lgaId: "",
        bankId: "",
      });
      return SetSuccessMessage(["operation Successful"]);
    }
  }, [success]);

  useEffect(() => {
    if (!selectedStateCode) {
      return;
    }

    FetchLgas(selectedStateCode);
  }, [FetchLgas, selectedStateCode]);

  const updateInput = (event) => {
    setCreateAgentData({
      ...CreateAgentData,
      [event.target.name]: event.target.value,
    });
  };

  const _handleSelectState = (e) => {
    const selectedState = agentStates.find(
      (stateItem) => String(stateItem.id) === e.target.value
    );
    setCreateAgentData({
      ...CreateAgentData,
      [e.target.name]: selectedState ? String(selectedState.id) : "",
      lgaId: "",
    });
    setSelectedStateCode(selectedState ? selectedState.stateCode : "");
  };

  const _handleSelectBank = (e) => {
    let bankCode = e.target.value;
    setCreateAgentData({
      ...CreateAgentData,
      [e.target.name]: bankCode,
    });
  };

  const onSubmit = (event) => {
    setErrors([]);
    SetSuccessMessage([]);
    event.preventDefault();

    const nextErrors = [];
    if (!CreateAgentData.stateId) {
      nextErrors.push("Select a state before submitting.");
    }
    if (!CreateAgentData.lgaId) {
      nextErrors.push("Select an LGA before submitting.");
    }
    if (agentLgaError) {
      nextErrors.push(
        agentLgaErrorMessage || "Unable to load LGAs for the selected state."
      );
    }
    if (
      selectedStateCode &&
      !agentLgaLoading &&
      !agentLgaError &&
      agentLgas.length === 0
    ) {
      nextErrors.push("No LGAs available for the selected state.");
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    handleCreateAgentManager(CreateAgentData);
  };

  const lgaUnavailable =
    !!selectedStateCode &&
    !agentLgaLoading &&
    !agentLgaError &&
    agentLgas.length === 0;
  const lgaPlaceholder = !selectedStateCode
    ? "Select your state first"
    : agentLgaLoading
      ? "Loading LGAs..."
      : agentLgaError
        ? "Unable to load LGAs"
        : lgaUnavailable
          ? "No LGAs available"
          : "Select your LGA";

  return (
    <Modal
      size="lg"
      show={show}
      onHide={close}
      aria-labelledby="edit-profile-modal"
      className="rounded border"
    >
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}

      <Modal.Body>
        <Container>
          <div
            className="header-wrapper d-flex justify-content-between align-item-center  justify-content-center"
            justify-content-center
          >
            <div className="modal-header">Add Agent Manager</div>
            <div onClick={() => close()} className="align-item-center  pt-3">
              <img src={Cancel} alt="Close" />
            </div>
          </div>
        </Container>
        <hr />
        <Container>
          <Form ref={formRef} onSubmit={onSubmit}>
            {error ? (
              <ErrorAlert errors={errors} />
            ) : (
              <Alert variant="success">{successMessage}</Alert>
            )}

            {/* {
                            success ? <Alert variant="success">{successMessage}</Alert> : null
                        }
                        {
                            error ? <Alert variant="danger">{errors}</Alert> : null
                        } */}
            <div>Personal Infromation</div>
            <br />
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>FIRST NAME</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    name="firstname"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>MIDDLE NAME</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter middle name"
                    name="middlename"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>LAST NAME</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    name="lastname"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>USER NAME</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>EMAIL</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>PHONE NUMBER</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phone"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    onChange={updateInput}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option>MALE</option>
                    <option>FEMALE</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    name="address"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="stateId"
                    as="select"
                    onChange={_handleSelectState}
                    required
                  >
                    <option value="">Select your state</option>
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
                    onChange={updateInput}
                    disabled={!selectedStateCode || agentLgaLoading || agentLgaError || lgaUnavailable}
                    required
                  >
                    {[{ id: "", lga: lgaPlaceholder }, ...agentLgas].map(
                      (lga, i) => {
                        return (
                          <option value={lga.id} key={i}>
                            {lga.lga}
                          </option>
                        );
                      }
                    )}
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
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ID type</Form.Label>
                  <Form.Control
                    as="select"
                    name="identityType"
                    onChange={updateInput}
                    required
                  >
                    <option value="">Choose an ID type</option>
                    <option value="National id">National id</option>
                    <option value="voters id">voters id</option>
                    <option value="international passport">
                      international passport
                    </option>
                    <option value="Drivers licences">Drivers licences</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Date of birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <div>Account Information</div>
            <br />
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    name="bankId"
                    as="select"
                    onChange={_handleSelectBank}
                    required
                  >
                    <option value="">Select your bank</option>
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
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountNumber"
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
                    name="accountName"
                    onChange={updateInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Account BVN</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountBvn"
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
        </Container>
      </Modal.Body>
    </Modal>
  );
};

CreateAgentModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    agentStates: state.agentmanager.agentStates,
    agentLgas: state.agentmanager.agentLga,
    agentLgaLoading: state.agentmanager.agentLgaLoading,
    agentLgaError: state.agentmanager.agentLgaError,
    agentLgaErrorMessage: state.agentmanager.agentLgaErrorMessage,
    agentBanks: state.agentmanager.agentBanks,
    loading: state.agentmanager.loading,
    errorMessage: state.agentmanager.errorMessage,
    success: state.agentmanager.createAgentMansuccess,
    error: state.agentmanager.error,
  };
};

export default connect(mapStateToProps, {
  FetchState,
  FetchLga,
  FetchBank,
  CreateAgentManager,
})(CreateAgentModal);
