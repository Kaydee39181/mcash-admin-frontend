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
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { JSEncrypt } from "jsencrypt";
import Loader from "../../../../Components/secondLoader";

const LinkCard = ({ accountNumber }) => {
  //console.log(accountNumber);
  const [otp, setOtp] = useState("");
  const [sequenceNumber, setSequenceNumber] = useState("");
  const [lastSixDigits, setLastSixDigits] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [clicked, setClicked] = useState(false);
  const handleSubmit = (e) => {
    setClicked(true);
    setLoading(true);
    setResponse([]);
    e.preventDefault();
    const {
      UserId,
      SessionId,
      RequestId,
      AuthMode,
      AuthValue,
      AccountNumber,
      CustomerNumber,
      LastSixDigits,
      Otp,
      SecretAnswer,
    } = handleEncryption();
    const ndata = {
      sequenceNo: `GTB-${sequenceNumber}`,
      SecretAnswer,
      channel: "TP-MICROSYSTEMS",
      UserId,
      SessionId,
      RequestId,
      AuthMode,
      AuthValue,
      AccountNumber,
      CustomerNumber,
      LastSixDigits,
      Otp,
    };
    console.log(accountNumber);
    console.log(ndata);
    const data = axios.post(
      `https://collection.gtbank.com/Appservices/GTBCustomerService_pilot/Api/LinkTier1Card`,
      ndata
    );
    data.then((res) => {
      setLoading(false);
      setResponse([res.data]);
      console.log(res.data);
    });
  };
  const getToken = JSON.parse(localStorage.getItem("data"));
  const handleEncryption = () => {
    let encrypt = new JSEncrypt();
    let req = new Date();
    const publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClT/VkFXEgAFj1U1EM6KK5pdUw
    T7J7ckmBfeT4+JsGsZDg3KzgTR+3gBZLVYqOd0GcdWsUf9Tm/U5fCjOZ2hHJ7ceC
    H2sm0SHUcDR7TnEyZET3uBgc/O0DHEp66HP9HANt6uEI0auv4O9vylgPLhqmtASL
    wBuG6adTq9Ddqy+0qwIDAQAB
  -----END PUBLIC KEY-----`;
    let nreq = req.getTime();
    encrypt.setPublicKey(publicKey);
    let UserId = encrypt.encrypt("22780625001");
    let SessionId = encrypt.encrypt(`${getToken.user.id}${nreq}`);
    let RequestId = encrypt.encrypt(`${nreq}`);
    let AuthMode = encrypt.encrypt("MPIN");
    let AuthValue = encrypt.encrypt("1234");
    let AccountNumber = encrypt.encrypt(accountNumber);
    let CustomerNumber = encrypt.encrypt("22780625001");
    let LastSixDigits = encrypt.encrypt(lastSixDigits);
    let SecretAnswer = encrypt.encrypt(secretAnswer);
    let Otp = encrypt.encrypt(otp);
    return {
      UserId,
      SessionId,
      RequestId,
      AuthMode,
      AuthValue,
      AccountNumber,
      CustomerNumber,
      LastSixDigits,
      Otp,
      SecretAnswer,
    };
  };
  return (
    <div>
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      {clicked && response.length > 0 ? (
        response[0]?.responseCode == "00" ? (
          <Modal
            show={clicked}
            onHide={() => {
              setClicked(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Card Linked Successfully. Your pin has been sent to your phone
                number
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        ) : (
          <Modal
            show={clicked}
            onHide={() => {
              setClicked(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>An Error Occurred. Please try again later</Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setClicked(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                placeholder="Enter OTP"
                name="otp"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>
                Enter The Last Six Digits of your Card (Optional)
              </Form.Label>
              <Form.Control
                type="text"
                value={lastSixDigits}
                placeholder="Enter The Last Six Digits of your Card"
                name="Card Number"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setLastSixDigits(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Secret Answer (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={secretAnswer}
                placeholder="Enter Secret Answer"
                name="secretAnswer"
                onChange={(e) => {
                  setSecretAnswer(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Sequence Number</Form.Label>

              <InputGroup>
                <InputGroup.Text>
                  <span
                    style={{
                      fontWeight: "300",
                      fontSize: "14px",
                      color: "#999",
                    }}
                  >
                    GTB-
                  </span>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={sequenceNumber}
                  placeholder="123456789"
                  name="Sequence Number"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  prefix="GTB-"
                  onChange={(e) => {
                    setSequenceNumber(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Button variant="primary" className="text-white " type="submit">
            Link Card
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LinkCard;
