import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Container,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { connect } from "react-redux";
import Loader from "../secondLoader";
import {
  DeActivateHardWare,
  ActivateHardWare,
  FetchHardWare,
} from "../../Redux/requests/hardwareRequest";
import Cancel from "../../Assets/img/x.png";
import "./style.css";

const HardwareModal = ({
  ActivateHardWare: ActivateHardWares,
  FetchHardWare: FetchHardWares,
  DeActivateHardWare: DeActivateHardWares,
  show,
  close,
  memberId,
  loading,
  error,
  hardwaresuccess,
  hardwareunassignsuccess,
  hardwaresdeActivate,
  hardwaresActivate,
  type,
  hardwares,
}) => {
  const [assignDevice, setAssignDevice] = useState({ serialNumber: "" });
  const [errors, setErrors] = useState("");
  const [successMessage, SetSuccessMessage] = useState("");
  console.log("type", type);

  const onSubmit = (event) => {
    event.preventDefault();
    if (type == "assigndevice") ActivateHardWares(assignDevice, memberId);
    if (type == "unassigndevice") DeActivateHardWares(assignDevice, memberId);
  };
  const updateInput = (event) => {
    setAssignDevice({
      ...assignDevice,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    console.log("memberId", memberId);
    FetchHardWares(memberId);
  }, [memberId]);

  // useEffect(() => {
  //   console.log("error", error);
  //   if (error) {
  //     return setErrors(hardwaresActivate);
  //   }
  // }, [error, hardwaresActivate]);

  useEffect(() => {
    if (hardwaresuccess) {
      return SetSuccessMessage(hardwaresActivate);
    }
  }, [hardwaresuccess, hardwaresActivate]);

  useEffect(() => {
    console.log("error", error);
    if (error) {
      return setErrors(['There was an error sending your request, please try again later.']);
    }
  }, [error, hardwaresActivate]);

  useEffect(() => {
    if (hardwareunassignsuccess) {
      return SetSuccessMessage(hardwaresdeActivate);
    }
  }, [hardwareunassignsuccess, hardwaresdeActivate]);

  const ResetHardwares = () => {
    // SetSuccessMessage(null);
    // setErrors(null);
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide= {()=>{
        close();
        ResetHardwares()}
      }
      centered={true}
      aria-labelledby="edit-profile-modal"
      className="rounded border"
    >
      <Modal.Body>
        {loading && (
          <Loader
            type="TailSpin"
            type="Oval"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}
        <Container>
          <div
            className="header-wrapper d-flex justify-content-between align-item-center  justify-content-center"
            justify-content-center
          >
            <div className="modal-header">Assign Device</div>
            <div onClick={close} className="align-item-center  pt-3">
              <img src={Cancel} />
            </div>
          </div>
        </Container>
        <hr />

        <Container>
          <Form onSubmit={onSubmit}>
            {hardwaresuccess ? (
              <Alert
                variant={
                  successMessage.responseCode === "00" ? "success" : "danger"
                }
              >
                {successMessage.responseMessage}
              </Alert>
            ) : null}
            {hardwareunassignsuccess ? (
              <Alert
                variant={
                  successMessage.responseCode === "00" ? "success" : "danger"
                }
              >
                {successMessage.responseMessage}
              </Alert>
            ) : null}
            {error ? <Alert variant="danger">{errors}</Alert> : null}
            <Row>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Member ID</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder=""
                    disabled
                    value={memberId}
                    onChange={updateInput}
                    name="memberId"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                {type == "assigndevice" ? (
                  <Form.Group controlId="">
                    <Form.Label>Serial Number</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder=""
                      name="serialNumber"
                      onChange={updateInput}
                      required
                    />
                  </Form.Group>
                ) : type == "unassigndevice" ? (
                  <Form.Group controlId="">
                    <Form.Label>Select device</Form.Label>
                    <Form.Control
                      size="sm"
                      as="select"
                      name="action"
                      onChange={updateInput}
                      name="serialNumber"
                      required
                    >
                      <option>Select your Device</option>
                      {hardwares.length
                        ? hardwares.map((hardware, i) => {
                            console.log(hardware);
                            return (
                              <option
                                key={i}
                                name="bankId"
                                value={hardware.serialNumber}
                              >
                                {hardware.serialNumber}
                              </option>
                            );
                          })
                        : ""}
                    </Form.Control>
                  </Form.Group>
                ) : (
                  ""
                )}
              </Col>
            </Row>

            <div className="filter-btns">
              <Button
                variant="outline-primary"
                className="filter-btn  "
                onClick={close}
              >
                CANCEL
              </Button>

              <Button
                variant="outline-primary"
                className=" filter "
                type="submit"
              >
                SUBMIT
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    hardwares: state.hardwaredevice.hardwares,
    hardwaresActivate: state.hardwaredevice.hardwaresActivate,
    hardwaresdeActivate: state.hardwaredevice.hardwaresdeActivate,
    loading: state.hardwaredevice.loading,
    error: state.hardwaredevice.error,
    hardwaresuccess: state.hardwaredevice.hardwaresuccess,
    hardwareunassignsuccess: state.hardwaredevice.hardwareunassignsuccess,
  }
);

export default connect(mapStateToProps, {
  ActivateHardWare,
  FetchHardWare,
  DeActivateHardWare,
})(HardwareModal);
