import React, { useState, useEffect, useRef } from "react";
import { Modal, Container, Button } from "react-bootstrap";
import ReactToPdf from "react-to-pdf";

import Cancel from "../../Assets/img/x.png";
import "./style.css";

const ViewReceipt = ({ show, close, details }) => {
  const ref = React.createRef();

  return (
    <Modal
      size="lg"
      show={show}
      onHide={close}
      centered={true}
      aria-labelledby="edit-profile-modal"
      className="rounded border"
    >
      <Modal.Body>
        <Container>
          <div
            className="header-wrapper d-flex justify-content-between align-item-center  justify-content-center"
            justify-content-center
          >
            <div className="modal-header">Transaction Receipt</div>
            <div onClick={close} className="align-item-center  pt-3">
              <img src={Cancel} />
            </div>
          </div>
        </Container>

        <Container>
          <div style={{ paddingLeft: "40px" }} ref={ref}>
            <div className="receipt-header">
              <div className="receipt-head">
                <div>Agent Name</div>
                <div>{details.Agent}</div>
              </div>
              <div className="receipt-head">
                <div>Total Amount</div>
                <div>{details.totalAmount}</div>
              </div>
              <div className="receipt-head">
                <div>Transaction type</div>
                <div>{details.Type}</div>
              </div>
            </div>

            <div className="receipt-body">
              <div>Transaction ID</div>
              <div>{details.TransactionID}</div>
            </div>
            <div className="receipt-body">
              <div>Terminal ID</div>
              <div>{details.TerminalID}</div>
            </div>
            <div className="receipt-body">
              <div>Status </div>
              <div>
                {details.transact ? details.transact.statusMessage : ""}
              </div>
            </div>
            <div className="receipt-body">
              <div>RRN</div>
              <div>{details.RRN}</div>
            </div>
            <div className="receipt-body">
              <div>STAN</div>
              <div>{details.STAN}</div>
            </div>
            <div className="receipt-body">
              <div>PAN</div>
              <div>{details.transact ? details.transact.pan : ""}</div>
            </div>
            <div className="receipt-body">
              <div>Card Holder</div>
              <div>{details.transact ? details.transact.cardHolder : ""}</div>
            </div>
          </div>

          <div className="filter-btns">
            <Button
              variant="outline-primary"
              className="filter-btn  "
              type="submit"
              onClick={close}
            >
              CANCEL
            </Button>

            <ReactToPdf targetRef={ref} filename="receipt.pdf">
              {({ toPdf }) => (
                <button
                  className="filter-btn  "
                  variant="outline-primary"
                  onClick={toPdf}
                >
                  Download Receipt
                </button>
              )}
            </ReactToPdf>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ViewReceipt;
