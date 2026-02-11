import React from "react";
import {Row, Col, Form, Button } from "react-bootstrap";

function Profile() {
  return (
    <div className="main-tabs">
      <div>
        <Form>
          <div className="d-flex justify-content-between">
            <div>Personal Information</div>
            <div>Edit Details</div>
          </div>
          <br />
          <Row>
            <Col md={12} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Full NAME</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={12} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={12} sm={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>
          <div className="form-note">
            <big>NOTE: </big>If you decide to change the phone number attached
            to your PayPad account, an OTP will be sent to the registered
            number.
          </div>
          <div className=" text-right">
            <Button
              variant="primary"
              className="text-white profile-submit-btn "
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Profile;
