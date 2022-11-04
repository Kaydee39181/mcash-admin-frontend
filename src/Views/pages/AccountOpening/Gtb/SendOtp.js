import React, { useState } from "react";
import { JSEncrypt } from "jsencrypt";
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
import Loader from "../../../../Components/secondLoader";

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
  /* loading, */
  erroMessage,
  agentStates,
  agentLgas,
  agentBanks,
  createAgent,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseCode, setResponseCode] = useState("");

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setClicked(true);
    const { AccountNumber, RequestId } = handleEncryption();

    const ndata = {
      AccountNumber,
      Channel: "TP-MICROSYSTEMS",
      RequestId,
      sendOtpTo: 1,
    };

    //setLoading(false);

    const data = axios.post(
      `https://collection.gtbank.com/AppServices/GTBRequestService/API/Send-Otp`,
      ndata
    );
    data.then((res) => {
      setLoading(false);
      setResponseMessage(
        res.data.responseDescription ? res.data.responseDescription : null
      );
      setResponseCode(res.data.responseCode ? res.data.responseCode : null);
    });
  };

  const handleEncryption = () => {
    var encrypt = new JSEncrypt();
    let req = new Date();
    const publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClT/VkFXEgAFj1U1EM6KK5pdUw
    T7J7ckmBfeT4+JsGsZDg3KzgTR+3gBZLVYqOd0GcdWsUf9Tm/U5fCjOZ2hHJ7ceC
    H2sm0SHUcDR7TnEyZET3uBgc/O0DHEp66HP9HANt6uEI0auv4O9vylgPLhqmtASL
    wBuG6adTq9Ddqy+0qwIDAQAB
  -----END PUBLIC KEY-----`;
    //console.log(req.getTime());
    encrypt.setPublicKey(publicKey);
    let AccountNumber = encrypt.encrypt(accountNumber);
    let RequestId = encrypt.encrypt(req.getTime());

    return { AccountNumber, RequestId };
  };

  return (
    <div>
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      <h5>Link your card to your Account</h5>
      <hr />
      <Form onSubmit={handleSubmit}>
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
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
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
            Get Otp
          </Button>
        </div>
      </Form>

      <p>{responseMessage}</p>
      {clicked && loading == false && responseCode == "00" && (
        <div style={{ marginTop: "10px" }}>
          <LinkCard accountNumber={accountNumber} />
        </div>
      )}
      {clicked && loading == false && responseCode != "00" && (
        <p style={{ marginTop: "10px" }}>An error occurred</p>
      )}
      {/* <LinkCard accountNumber={accountNumber} /> */}
    </div>
  );
};

export default SendOtp;
