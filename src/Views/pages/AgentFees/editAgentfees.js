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

import { UpdateFee } from "../../../Redux/requests/agentFeesRequest";
import Loader from "../../../Components/secondLoader";
import "./style.css";
const EditFeeModal = ({
  UpdateFee: UpdateFees,
  success,
  error,
  loading,
  erroMessage,
  show,
  close,
  load,
  feeDetails,
}) => {
  // console.log(feeDetails);

  // const { ID, FirstName,LastName, UserName, RoleGroup, email } = feeDetails;
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const [editFeeData, seteditFeeData] = useState([]);

  const { id, fee, rangeType, ambassadorCut } = editFeeData;

  // console.log(editFeeData,fee,rangeType,ambassadorCut)

  useEffect(() => {
    seteditFeeData(feeDetails);
  }, [feeDetails]);

  // console.log(editFeeData);
  useEffect(() => {
    // console.log(error, erroMessage);
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
    seteditFeeData({
      ...editFeeData,
      [event.target.name]: event.target.value,
    });
  };

  const _handleSelectRoles = (e) => {
    seteditFeeData({
      ...editFeeData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // console.log();
    UpdateFees(editFeeData);
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
            <h5>Update Agent Fees</h5>
            <hr />
            <Form onSubmit={onSubmit}>
              {success ? (
                <Alert variant="success">{successMessage}</Alert>
              ) : null}
              {error ? <Alert variant="danger">{errors}</Alert> : null}

              <Row>
                <Col md={12} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>New Agent Fee</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="fee"
                      onChange={updateInput}
                      value={fee}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>New Agent Manager's Cut</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      name="ambassadorCut"
                      onChange={updateInput}
                      value={ambassadorCut}
                    />
                  </Form.Group>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Range Type</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      name="rangeType"
                      onChange={updateInput}
                      value={rangeType}
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
        </Container>
      </Modal.Body>
    </Modal>
  );
};

EditFeeModal.propTypes = {
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

const mapStateToProps = (state) =>
  // console.log(state),
  ({
    roleGroups: state.settings.roleGroups,
    loading: state.agentfees.loading,
    erroMessage: state.agentfees.errorMessage,
    success: state.agentfees.successUpdate,
    error: state.agentfees.error,
  });

export default connect(mapStateToProps, {
  UpdateFee,
})(EditFeeModal);
