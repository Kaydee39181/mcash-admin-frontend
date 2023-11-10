import React, { useEffect, useState } from "react";
import { AgentConstant } from "../../../constants/constants";
import DashboardTemplate from "../../template/dashboardtemplate";
import { Form, Row, Col, Button } from "react-bootstrap";
import ConfirmationModal from "./confirmationModal";


//import { useHistory } from "react-router-dom";

export default function SelectSwitch() {
  const [currentProcessor, setCurrentProcessor] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch the current switch setting when the component mounts
    fetch(`${AgentConstant.GET_CASHOUT_SWITCH}`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCurrentProcessor(data.currentSWitch); // Set the current switch in state
      })
      .catch((error) => {
        console.error('Error fetching current switch:', error);
      });
  }, []);

  const handleConfirmation = (confirmed) => {
        if (confirmed) {
          // Make the API call to change the switch setting
          const seturl = `${AgentConstant.SET_CASHOUT_SWITCH}${selectedProcessor}`;
          console.log("set: ",seturl)
          fetch(seturl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then((response) => {
              if (response.ok){
                setCurrentProcessor(selectedProcessor);
              }
            })
            .catch((error) => {
              console.error('Error changing switch:', error);
            });
        }
        setShowConfirmation(false);
      };


  const handleShowModal = () => {
    setShowConfirmation(true);
  };

  const handleYes = () => {
    handleConfirmation(true);
  };

  const handleNo = () => {
    handleConfirmation(false);
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const handleSwitchChange = (newProcessor) => {
    if (newProcessor !== currentProcessor) {
      setSelectedProcessor(newProcessor)
    } else {
      // If the selected switch is the same as the current switch, show a different pop-up
      alert('No change to make');
    }
  };
    return (
      <div>
     

  <DashboardTemplate>
      <Row>
          <Col md={4} sm={12} style={{margin:"40px"}}>
          <div className="header-title">
            <h3>Current Processor: {currentProcessor}</h3>
          </div>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select an action</Form.Label>
              <Form.Control as="select" name={selectedProcessor} onChange={(e) => handleSwitchChange(e.target.value)}>
                <option>Select Processor</option>
                <option value="Interswitch">Interswitch</option>
                <option value="UP">Unified Payment</option>
                <option value="3Line">3Line Card</option>
              </Form.Control>
              <Button variant="primary" className="text-white " type="submit" style={{margin:"20px"}} onClick={handleShowModal}>
                Confirm
              </Button>
            </Form.Group>
          </Col>
        </Row>
      
        {showConfirmation && <ConfirmationModal
          show={showConfirmation}
          message= {`Are you sure you want to switch from ${currentProcessor} to ${selectedProcessor}?`}
          onYes={handleYes}
          onNo={handleNo}
          onClose={handleCloseModal}
        />}
  </DashboardTemplate>
      
      
    </div>
    );
  };
