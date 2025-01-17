import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { JSEncrypt } from "jsencrypt";
import { AgentConstant } from "../../../../constants/constants";
import axios from "axios";
import EditBvnDetails from "./EditBvnDetails";
import Loader from "../../../../Components/secondLoader";

const BVNForm = () => {
  const [bvn, setBvn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bvnData, setBvnData] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchDetails();
    setClicked(true);
  };

  const fetchDetails = async () => {
    setLoading(true);
    const { UserId, RequestId, BVN, PhoneNumber } = handleEncryption();

    const ndata = {
      Channel: "TP-MICROSYSTEMS",
      BVN,
      UserId,
      PhoneNumber,
      RequestId,
    };
    //console.log(ndata);
    await axios
      .post(`${AgentConstant.FETCH_BVN}`, ndata)
      .then((data) => {
        setBvnData({ ...data.data.responseObject });
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
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
    let UserId = encrypt.encrypt("22780625001");
    let RequestId = encrypt.encrypt(req.getTime());
    let BVN = encrypt.encrypt(bvn);
    let PhoneNumber = encrypt.encrypt(phoneNumber);

    return { UserId, RequestId, BVN, PhoneNumber };
  };
  return (
    <div>
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      {!clicked && !loading &&  Object.keys(bvnData).length < 1 && (
        <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>BVN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your BVN"
                name="bvn"
                onChange={(e) => {
                  setBvn(e.target.value);
                  setClicked(false);
                }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phonenumber"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setClicked(false);
                }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Button variant="primary" className="text-white " type="submit">
            Submit
          </Button>
        </div>
      </Form>)}
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      {clicked && !loading && bvnData && Object.keys(bvnData).length > 0 && (
        <EditBvnDetails data={bvnData} />
      )}
      {clicked && !loading && Object.keys(bvnData).length <= 0 && (
        <p style={{ marginTop: "10px", color: "red" }}>An Error Occurred</p>
      )}
    </div>
  );
};

export default BVNForm;
