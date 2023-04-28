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

import { CreateAdmin } from "../../../Redux/requests/adminRequest";
import Loader from "../../../Components/secondLoader";
import "./style.css";
const CreateAdminModal = ({
  CreateAdmin: handleCreateAdmin,
  FetchRoleGroup: FetchRoleGroups,  
  success,
  error,
  loading,
  erroMessage,
  roleGroups,
}) => {
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [CreateAdminData, setCreateAdminData] = useState({
   
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    roleGroupName: "",
   
  });

  useEffect(() => {
    FetchRoleGroups();
    SetSuccessMessage([])

  }, []);

console.log(roleGroups)
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
    setCreateAdminData({
      ...CreateAdminData,
      [event.target.name]: event.target.value,
    });
  };

  const _handleSelectRoles = (e) => {
    setCreateAdminData({
      ...CreateAdminData, [e.target.name]: e.target.value
    });
  };
  
  const onSubmit = (event) => {
    event.preventDefault();
    console.log();
    handleCreateAdmin(CreateAdminData);
  };

  return (
    <div>
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
        <h5>Create Admin</h5>
        <hr />
        <Form onSubmit={onSubmit}>
          {success ? <Alert variant="success">{successMessage}</Alert> : null}
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
                  required
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
                  required
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
                  required
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
                  required
                >
                  <option>Select your Role Group</option>
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
    </div>
  );
};

CreateAdminModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    createAdmin: state.admins.createAdmin,
    roleGroups: state.settings.roleGroups,
    loading: state.admins.loading,
    erroMessage: state.admins.errorMessage,
    success: state.admins.createAdminsuccess,
    error: state.admins.error,
  }
);

export default connect(mapStateToProps, {
    FetchRoleGroup,
  CreateAdmin,
})(CreateAdminModal);
