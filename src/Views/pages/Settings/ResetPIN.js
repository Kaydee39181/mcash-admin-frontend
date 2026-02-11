import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import Loader from "../../../Components/secondLoader";
import "./style.css";
import axios from "axios";
import { AgentConstant } from "../../../constants/constants";

const ResetPIN = () => {
  const getToken = JSON.parse(localStorage.getItem("data"));
  const { access_token } = getToken;

  const [userCredentials, setUserCredentials] = useState({
    newTransactionPin: null,
    bvn: null,
  });
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [successMessage, SetSuccessMessage] = useState();

  function handleInputChange(event) {
    setUserCredentials({
      ...userCredentials,
      [event.target.name]: event.target.value,
    });
  }

  const clearField = () => {
    setUserCredentials({ newTransactionPin: "", bvn: "" });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${AgentConstant.RESET_PIN}`,
        userCredentials,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${access_token}`,
          },
        }
      );
      SetSuccessMessage(data.responseMessage);
      setLoading(false);
      clearField();
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrors(error.response.data.data);
    }
  };

  return (
    <div className="main-tabs" style={{ padding: "80px 26px" }}>
      <Form onSubmit={onSubmit}>
        {loading && (
          <Loader
            type="TailSpin"
            // type="Oval"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}
        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}
        {error ? <Alert variant="danger">{errors}</Alert> : null}
        <div className="d-flex ">
          <div>Reset PIN</div>
        </div>
        <br />
        <Row>
          <Col md={12} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Enter new PIN</Form.Label>
              <Form.Control
                type="text"
                name="newTransactionPin"
                maxLength="4"
                onChange={handleInputChange}
                value={userCredentials.newTransactionPin}
                required
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Enter BVN</Form.Label>
              <Form.Control
                type="text"
                name="bvn"
                value={userCredentials.bvn}
                onChange={handleInputChange}
                required
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
  );
};

export default ResetPIN;