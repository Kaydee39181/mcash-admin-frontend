import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import BVNForm from "./BVNForm";
import KycForm from "./KycForm";
import DashboardTemplate from "../../../template/dashboardtemplate";
import SendOtp from "./SendOtp";

const Gtb = () => {
  const [selected, setSelected] = useState(null);
  const [createModalActive, showCreateModal] = React.useState(false);
  const [active, showActive] = React.useState("home");
  const [ExportModalActive, showExportModal] = React.useState(false);
  const [FilterModalActive, showFilterModal] = React.useState(false);
  const initialState = {
    startDate: "",
    endDate: "",
    username: "",
    businessName: "",
    phone: "",
    agentId: "",
  };
  const [filterValues, setFilterValues] = useState(initialState);
  const onclose = () => {
    showActive("home");
    showCreateModal(false);
  };
  const OpenFilter = () => {
    showFilterModal(true);
    setFilterValues(initialState);
  };
  const updateInput = (e) => {
    setSelected(e.target.value);
  };

  return (
    <DashboardTemplate>
      
      <Row style={{marginLeft:"30px"}}>
        <Col md={4} sm={12}>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select an action</Form.Label>
            <Form.Control as="select" name="Gender" onChange={updateInput}>
              <option>Select Operation</option>
              <option value={"B"}>Open New account (BVN Required)</option>
              {/* <option value={"F"}>Open account without BVN</option> */}
              <option value={"O"}>Link your Tier 1 card to your account</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <div style={{marginLeft:"30px"}}>
      {selected == "F" && <KycForm />}
      {selected == "B" && <BVNForm />}
      {selected == "O" && <SendOtp />}
      </div>
      
    </DashboardTemplate>
  );
};

export default Gtb;