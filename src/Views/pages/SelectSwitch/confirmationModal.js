import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AgentConstant } from "../../../constants/constants";


function ConfirmationModal({ show, message, onYes, onNo, onClose }) {

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onNo(); onClose(); }}>
          No
        </Button>
        <Button variant="primary" onClick={() => { onYes(); onClose(); }}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
