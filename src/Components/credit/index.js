import React, { useState, useEffect } from "react";
import { Modal, Form, Container, Button, Row, Col, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import Loader from "../secondLoader"
import {
  CreditDebitPurse
} from "../../Redux/requests/agentPurseRequest";
import Cancel from "../../Assets/img/x.png";
import "./style.css";

const CreditDebit = ({ show, close,CreditDebitPurse:CreditDebitPurses,idAgent,businessName ,loading,error,success}) => {
  console.log(idAgent)
  const [CreditDebitData, setCreditDebitData] = useState({
    agentId:idAgent,
    amount: "" ,
    action: "" ,
    reason: "" ,
    transactionId: "" ,
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);


  useEffect(() => { 
    if(error){
        return setErrors(['There was an error sending your request, please try again later.']);
    }
}, [error]);

  useEffect(() => { 
    if(success){
      return SetSuccessMessage(['operatrion Successful']);

    }
}, [success]);

  const onSubmit = (event) => {
    console.log(idAgent)
    console.log(CreditDebitData,idAgent)
    event.preventDefault();  
    CreditDebitPurses(CreditDebitData,idAgent);
  
  }
  const updateInput = (event) => {
    setCreditDebitData({
      ...CreditDebitData,
      [event.target.name]:  event.target.value,
    });
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={close}
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
            <div className="modal-header">Credit/Debit Purse</div>
            <div onClick={close} className="align-item-center  pt-3">
              <img src={Cancel} />
            </div>
          </div>
        </Container>
        <hr />

        <Container>
          <Form onSubmit={onSubmit}>
             {
            success ? <Alert variant="success">{successMessage}</Alert> : null
          }
          {
            error ? <Alert variant="danger">{error}</Alert> : null
          }
            <Row>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Business Name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Chinweoke Adolphus Williams"
                    onChange={updateInput}
                    disabled
                    value={businessName}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Action</Form.Label>
                  <Form.Control
                    size="sm"
                    as="select"
                    name="action"
                    onChange={updateInput}
                    required
                  >
                    <option>Select action</option>
                    <option value="credit">Credit</option>
                    <option value="debit"> Debit </option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter amount"
                    name="amount"
                    onChange={updateInput}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter reason"
                    name="reason"
                    onChange={updateInput}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs="6">
                <Form.Group controlId="">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter Transaction ID"
                    name="transactionId"
                    onChange={updateInput}
                    required
                  ></Form.Control>
                </Form.Group>
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

const mapStateToProps = state => (console.log(state),{
  agentPurse:state.purse.agentPurse,
  loading:state.purse.loading,
  error:state.purse.error,
  success:state.purse.cdsuccess
  
});

export default connect(
  mapStateToProps,
  {
     CreditDebitPurse
  }
)(CreditDebit);
