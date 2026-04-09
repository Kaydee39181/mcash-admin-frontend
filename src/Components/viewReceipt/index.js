import React, { useRef } from "react";
import { Modal, Container, Button } from "react-bootstrap";
import ReactToPdf from "react-to-pdf";

import Cancel from "../../Assets/img/x.png";
import Logo from "../../Assets/img/mobile-logo.png";
import "./style.css";

const ViewReceipt = ({ show, close, details }) => {
  const ref = useRef(null);
  const statusMessage = details?.transact?.statusMessage || "N/A";
  const normalizedStatus = String(statusMessage).trim().toUpperCase();
  const statusTone = normalizedStatus.includes("CHARGE")
    ? "charge"
    : normalizedStatus.includes("FAIL")
      ? "failed"
      : "success";

  const summaryItems = [
    { label: "Agent Name", value: details?.Agent || "N/A" },
    { label: "Total Amount", value: details?.totalAmount || "N/A" },
    { label: "Transaction Type", value: details?.Type || "N/A" },
  ];

  const detailRows = [
    { label: "Transaction ID", value: details?.TransactionID || "N/A" },
    { label: "Terminal ID", value: details?.TerminalID || "N/A" },
    { label: "Status", value: statusMessage },
    { label: "RRN", value: details?.RRN || "N/A" },
    { label: "STAN", value: details?.STAN || "N/A" },
    { label: "PAN", value: details?.transact?.pan || "N/A" },
    { label: "Card Holder", value: details?.transact?.cardHolder || "N/A" },
  ];

  return (
    <Modal
      size="lg"
      show={show}
      onHide={close}
      centered={true}
      aria-labelledby="edit-profile-modal"
      className="rounded border"
    >
      <Modal.Body className="receipt-modal-body">
        <Container>
          <div className="receipt-modal-header">
            <div className="receipt-modal-title">Transaction Receipt</div>
            <button
              type="button"
              onClick={close}
              className="receipt-close-btn"
              aria-label="Close receipt"
            >
              <img src={Cancel} alt="Close" />
            </button>
          </div>
        </Container>

        <Container>
          <div className="receipt-sheet" ref={ref}>
            <div className="receipt-brand-bar">
              <div className="receipt-brand">
                <img src={Logo} alt="mCashPoint" className="receipt-brand-logo" />
                <div>
                  <div className="receipt-brand-name">mCashPoint</div>
                  <div className="receipt-brand-caption">
                    Secure transaction acknowledgment
                  </div>
                </div>
              </div>

              <div className={`receipt-status-badge receipt-status-badge--${statusTone}`}>
                {statusMessage}
              </div>
            </div>

            <div className="receipt-summary-grid">
              {summaryItems.map((item) => (
                <div className="receipt-summary-card" key={item.label}>
                  <div className="receipt-summary-label">{item.label}</div>
                  <div className="receipt-summary-value">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="receipt-detail-section">
              {detailRows.map((row) => (
                <div className="receipt-detail-row" key={row.label}>
                  <div className="receipt-detail-label">{row.label}</div>
                  <div className="receipt-detail-value">{row.value}</div>
                </div>
              ))}
            </div>

            <div className="receipt-footer-note">
              Generated from the mCashPoint dashboard.
            </div>
          </div>

          <div className="filter-btns receipt-actions">
            <Button
              variant="outline-primary"
              className="filter-btn"
              type="submit"
              onClick={close}
            >
              CANCEL
            </Button>

            <ReactToPdf targetRef={ref} filename="receipt.pdf">
              {({ toPdf }) => (
                <button
                  type="button"
                  className="filter-btn receipt-download-btn"
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
