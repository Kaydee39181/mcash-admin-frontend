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
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FetchRoleGroup } from "../../../Redux/requests/settingsRequest";

import { UpdateAdmin } from "../../../Redux/requests/adminRequest";
import Loader from "../../../Components/secondLoader";
import "./style.css";
const EditAdminModal = ({
  UpdateAdmin: handleUpdateAdmin,
  FetchRoleGroup: FetchRoleGroups,
  success,
  error,
  loading,
  erroMessage,
  roleGroups,
  show,
  close,
  load,
  adminDetails,
}) => {
  console.log(adminDetails);

  // const { ID, FirstName,LastName, UserName, RoleGroup, email } = adminDetails;
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [editAdminData, setEditAdminData] = useState([])
  const { id, firstname,lastname, username, roleGroupName, email } = editAdminData;

  console.log(setEditAdminData)

  useEffect(() => {
    FetchRoleGroups();
  }, []);

  useEffect(() => {
    setEditAdminData(adminDetails);
 }, [adminDetails])

  useEffect(() => {
    FetchRoleGroups();
  }, []);

  console.log(editAdminData);
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
    setEditAdminData({
      ...editAdminData,
      [event.target.name]: event.target.value,
    });
  };

  const _handleSelectRoles = (e) => {
    setEditAdminData({
      ...editAdminData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log();
    handleUpdateAdmin(editAdminData);
  };


  return (
    <Modal
      size="lg"
      show={show && SetSuccessMessage}
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
        <Container>
          <div className="agent-table-wrapper">
            <h5>Update Admin</h5>
            <hr />
            <Form onSubmit={onSubmit}>
              {success ? (
                <Alert variant="success">{successMessage}</Alert>
              ) : null}
              {error ? <Alert variant="danger">{errors}</Alert> : null}

              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="firstname"
                      onChange={updateInput}
                      value={firstname}
                      required
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
                      value={lastname}
                      
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      name="username"
                      onChange={updateInput}
                      value={username}
                      
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      onChange={updateInput}
                      value={email}
                      
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Role Group</Form.Label>
                    <Form.Control
                      name="roleGroupName"
                      as="select"
                      onChange={_handleSelectRoles}
                      
                    >
                      <option>{roleGroupName}</option>
                      {roleGroups.map((role, i) => {
                        return (
                          <option key={i} value={role.name}>
                            {role.name}
                          </option>
                        );
                      })}
                    </Form.Control>
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
        </Container>
      </Modal.Body>
    </Modal>
  );
};

EditAdminModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    roleGroups: state.settings.roleGroups,
    loading: state.admins.loading,
    erroMessage: state.admins.errorMessage,
    success: state.admins.successUpdate,
    error: state.admins.error,
  }
);

export default connect(mapStateToProps, {
  FetchRoleGroup,
  UpdateAdmin,
})(EditAdminModal);
