import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../template/dashboardtemplate";
import { Form, Row, Col, Button } from "react-bootstrap";
import ConfirmationModal from "./confirmationModal";
import Loader from "../../../Components/secondLoader";

export default function SelectSwitch() {
  const [currentProcessor, setCurrentProcessor] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const processors = {
    "POSTBRIDGE":"Interswitch",
    "UP":"Unified Payment",
    "3LINE":"3 Line Card"
  }

  useEffect(() => {
    const url = "https://cashout.mcashpoint.com/processor/all";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0;i<data.length;i++){
          if (data[i].environment === "LIVE" && data[i].active === true){
            setCurrentProcessor(data[i].route);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching current switch:', error);
      });
  }, []);

  const handleConfirmation = (confirmed) => {
        if (confirmed) {
          setLoading(true);          
          const seturl = `https://cashout.mcashpoint.com/processor/activate?processor=${selectedProcessor}`;
          fetch(seturl)
            .then((response) => {
              if (response.ok){
                setCurrentProcessor(selectedProcessor);
                setLoading(false);
                alert(`Successfully Switched to ${processors[selectedProcessor]}`)
              }
            })
            .catch((error) => {
              console.error('Error changing switch:', error);
            });
        }
        setShowConfirmation(false);
      };


  const handleShowModal = () => {
    if (selectedProcessor !== currentProcessor) {
      setShowConfirmation(true);
    } else {
      // If the selected switch is the same as the current switch, show a different pop-up
      alert('No change to make');
    }
   
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
    setSelectedProcessor(newProcessor);
  };
    return (
      <div>
        {loading && (
        <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
      )}
     
  <DashboardTemplate>
      <Row>
        <div className="header-title" style={{margin:"40px"}}>
          <h3><span style={{fontSize:"20px"}}>Current Processor: </span>{processors[currentProcessor]}</h3>
        </div>
      </Row>
      <Row>
          <Col md={4} sm={12} style={{margin:"40px"}}>
          
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Switch</Form.Label>
              <Form.Control as="select" name={selectedProcessor} onChange={(e) => handleSwitchChange(e.target.value)}>
                <option>Select Processor</option>
                <option value="POSTBRIDGE">{processors.POSTBRIDGE}</option>
                <option value="UP">{processors.UP}</option>
                <option value="3LINE">{processors["3LINE"]}</option>

              </Form.Control>
              <Button variant="primary" className="text-white " type="submit" style={{margin:"20px"}} onClick={handleShowModal}>
                Confirm
              </Button>
            </Form.Group>
          </Col>
        </Row>
      
        {showConfirmation && <ConfirmationModal
          show={showConfirmation}
          message= {`Are you sure you want to switch from ${processors[currentProcessor]} to ${processors[selectedProcessor]}?`}
          onYes={handleYes}
          onNo={handleNo}
          onClose={handleCloseModal}
        />}
  </DashboardTemplate>
      
      
    </div>
    );
  };
