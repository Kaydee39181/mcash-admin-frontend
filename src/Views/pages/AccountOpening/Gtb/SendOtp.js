import React, { useState } from "react";
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
import axios from "axios";
import LinkCard from "./LinkCard";

const SendOtp = ({
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
  agentBanks,
  createAgent,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [clicked, setClicked] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, SetSuccessMessage] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setClicked(true);
    let req = new Date();

    const ndata = {
      AccountNumber: accountNumber,
      Channel: "TP-MICROSYSTEMS",
      RequestId: `${req.getTime()}`,
      sendOtpTo: 1,
    };
    console.log(ndata);
    const data = axios.post(
      `https://collection.gtbank.com/AppServices/GTBRequestService/API/Send-Otp`,
      ndata
    );
    data.then((res) => console.log(res.data));
  };

  return (
    <div>
      <h5>Link your card to your Account</h5>
      <hr />
      <Form onSubmit={handleSubmit}>
        {success ? <Alert variant="success">{successMessage}</Alert> : null}
        {error ? <Alert variant="danger">{errors}</Alert> : null}
        <h6>Account Details</h6>
        <br />
        <Row>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                value={accountNumber}
                placeholder="Enter your account number"
                name="Account Number"
                onChange={(e) => {
                  setClicked(false);
                  setAccountNumber(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Button variant="primary" className="text-white " type="submit">
            Send Otp
          </Button>
        </div>
      </Form>

      {clicked && <LinkCard />}
    </div>
  );
};

export default SendOtp;
