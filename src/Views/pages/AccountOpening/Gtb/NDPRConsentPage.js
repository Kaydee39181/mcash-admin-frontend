import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { AgentConstant } from "../../../../constants/constants";
import axios from "axios";
import Loader from "../../../../Components/secondLoader";
import BVNForm from "./BVNForm";

const NDPRCOnsentPage = ({ IDtype }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pcCode, setPcCode] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("By proceeding, you agree to share your data with GTB Bank for verification purposes. Your data will be securely processed and not shared with third parties without your consent.");
  const [showAgreeButton, setShowAgreeButton] = useState(true);
  const getToken = JSON.parse(localStorage.getItem("data"));
  const [auxInfo, setAuxInfo] = useState({});
  const [display, setDisplay] = useState(false)
  const [ndprCode, setNdprCodde] = useState("");
  const [switchPage, setSwitchPage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the modal first
  };

  const handleAgree = async () => {
    setShowAgreeButton(false); // Hide agree button
    await fetchDetails(); // Call the API only after user agrees
  };

  const fetchDetails = async () => {
    setLoading(true);
    let req = new Date();
    const cdata = {
      Channel: "TP-MICROSYSTEMS",
      AgentId: `${getToken.user.id}`,
      ReferenceNumber: `${req.getTime()}${getToken.user.id}`,
      PhoneNumber: phoneNumber,
      PcCode: pcCode,
      UserId: "22780625001",
      AuthMode: "MPIN",
      AuthValue: "1234",
      RequestId: `MCS${req.getTime()}`,
    };
    setAuxInfo(cdata);

    const testData = {
      AgentId: "56780012",
      ReferenceNumber: "3366990814560720",
      PhoneNumber: "08100000000",
      Channel: "ITEX",
      PcCode: "3145",
      UserId: "282690989",
      AuthMode: "MPIN",
      AuthValue: "1234",
      RequestId: "3366990814560789",
    };
    
    await axios
      .post(`${AgentConstant.GET_NDPRCODE}?${cdata.RequestId}`, cdata)
      .then((data) => {
        console.log(data.data.ResponseCode);
        if (data.data.ResponseCode === "00"){
            setModalMessage(
                `An OTP has been sent to your phone number. Please enter the OTP in the field below.`);
            setDisplay(true)
        }
        else{
            setModalMessage("The Phone Number provided is invalid.");
        }
        
        //setClicked(true);
      })
      .catch((error) => {
        setModalMessage("An Error Occurred");
      })
      .finally(() => {
        setLoading(false);
        setShowAgreeButton(false);
      });
  };

  return (
    <div>
      {loading && <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />}
      {!clicked && !loading && (
        <Form onSubmit={handleSubmit}>
            {!display && !switchPage && (<>
            <Row>

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
            <Button variant="primary" className="text-white" type="submit">
              Continue
            </Button>
          </div>
        
        </>)}
            {display && !switchPage &&(<>
            <Row>
                <Col md={4} sm={12}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                        type="text"
                    placeholder="Enter the OTP sent to your phone number"
                    name="ndprCode"
                    onChange={(e) => {
                        setNdprCodde(e.target.value);
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
                <Button variant="primary" className="text-white" type="button" onClick={()=>{setSwitchPage(true)}}>
                Submit
                </Button>
          </div>
        
        </>)}
         
        </Form>
      )}
      {switchPage && IDtype === "BVN" && <BVNForm auxInfo={auxInfo} ndprCode={ndprCode} />}

      {/* Terms & Conditions Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {showAgreeButton ? (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAgree}>
                Agree
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowModal(false)}>
              OK
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NDPRCOnsentPage;