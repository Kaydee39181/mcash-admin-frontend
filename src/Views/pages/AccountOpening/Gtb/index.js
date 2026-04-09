import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import KycForm from "./KycForm";
import DashboardTemplate from "../../../template/dashboardtemplate";
import LinkCard from "./LinkCard";
import NDPRCOnsentPage from "./NDPRConsentPage";
import "./style.css";

const Gtb = () => {
  const [selected, setSelected] = useState(null);
  const updateInput = (e) => {
    setSelected(e.target.value);
  };

  return (
    <DashboardTemplate>
      <div className="transact-wrapper gtb-page-shell">
        <div className="gtb-page-inner">
          <div className="gtb-flow-shell">
            <Row className="gtb-select-row">
              <Col lg={7} md={9} sm={12} className="gtb-select-col">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select an action</Form.Label>
                  <Form.Control as="select" name="Gender" onChange={updateInput}>
                    <option>Select Operation</option>
                    <option value={"B"}>Open New account with BVN</option>
                    {/* <option value={"F"}>Open account without BVN</option> */}
                    <option value={"O"}>Link your Tier 1 card to your account</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <div className="gtb-section-content">
              {selected === "F" && <KycForm />}
              {selected === "B" && <NDPRCOnsentPage IDtype={"BVN"} />}
              {selected === "O" && <LinkCard />}
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Gtb;
