import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import GtImage from "../../../Assets/img/guaranty-trust-bank-gtbank-vector-logo .svg";
import { useHistory } from "react-router-dom";

const SelectBank = () => {
  const history = useHistory();
  return (
    <div>
      <Row>
        <Col md={4} sm={12}>
          <p style={{ fontSize: "20px", marginLeft: "3em" }}>Select The Bank</p>
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <Card
            style={{
              width: "18rem",
              height: "18rem",
              cursor: "pointer",
              backgroundColor: "white",
            }}
            className="float mx-auto"
            onClick={() => history.push("/gtb")}
          >
            <Card.Img
              variant="top"
              src={GtImage}
              style={{ width: "15rem", height: "10rem" }}
            />
            <Card.Body className="float mx-auto">
              <Card.Text>
                Open an account with your BVN and also link your card
                to your account
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* {selected == "GTB" && <GTB />} */}
    </div>
  );
};

export default SelectBank;
