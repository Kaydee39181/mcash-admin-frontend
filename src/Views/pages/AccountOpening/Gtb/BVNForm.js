import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { JSEncrypt } from "jsencrypt";
import { AgentConstant } from "../../../../constants/constants";
import axios from "axios";
import EditBvnDetails from "./EditBvnDetails";
import Loader from "../../../../Components/secondLoader";

const BVNForm = ({auxInfo,ndprCode}) => {
  const [bvn, setBvn] = useState("");
  //const [phoneNumber, setPhoneNumber] = useState("");
  const [pcCode, setPcCode] = useState("");
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
    const testData = {
      "AgentId": "56780012",
      "ReferenceNumber": "3366990814560720",
      "PhoneNumber": "08100000000",
      "Channel": "ITEX",
      "PcCode": "3145",
      "UserId": "282690989",
      "AuthMode": "MPIN",
      "AuthValue": "1234",
      "RequestId": "3366990814560789"
     }

    await axios
      .post(`${AgentConstant.FETCH_BVN}`, ndata)
      .then((data) => {
        setBvnData({ ...data.data.responseObject });
        console.log(data)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  

  const handleEncryption = () => {
    var encrypt = new JSEncrypt();
    const publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClT/VkFXEgAFj1U1EM6KK5pdUw
    T7J7ckmBfeT4+JsGsZDg3KzgTR+3gBZLVYqOd0GcdWsUf9Tm/U5fCjOZ2hHJ7ceC
    H2sm0SHUcDR7TnEyZET3uBgc/O0DHEp66HP9HANt6uEI0auv4O9vylgPLhqmtASL
    wBuG6adTq9Ddqy+0qwIDAQAB
  -----END PUBLIC KEY-----`;
    //console.log(req.getTime());
    encrypt.setPublicKey(publicKey);
    let UserId = encrypt.encrypt(auxInfo.UserId);
    let RequestId = encrypt.encrypt(auxInfo.RequestId);
    let BVN = encrypt.encrypt(bvn);    let PhoneNumber = encrypt.encrypt(auxInfo.PhoneNumber);
    let ReferenceNumber = auxInfo.ReferenceNumber;

    return { UserId, RequestId, BVN, PhoneNumber, ReferenceNumber};
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
                          <Form.Label>PCCode</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter PCCode"
                            name="PCCode"
                            onChange={(e) =>{
                              setPcCode(e.target.value);
                              setClicked(false);
                            }}
                          />
                        </Form.Group>
            </Col>
        </Row>
        <div>
          <Button variant="primary" className="text-white " type="submit" >
            Submit
          </Button>
        </div>
      </Form>)}
      {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
      {clicked && !loading && bvnData && Object.keys(bvnData).length > 0 && (
        <EditBvnDetails data={bvnData} info={auxInfo} pcCode={pcCode} ndprCode={ndprCode}/>
      )}
      {clicked && !loading && Object.keys(bvnData).length <= 0 && (
        <p style={{ marginTop: "10px", color: "red" }}>An Error Occurred</p>
      )}
    </div>
  );
};

export default BVNForm;
