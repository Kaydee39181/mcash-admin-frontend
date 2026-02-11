import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Modal, Form, Container, Button, Row } from "react-bootstrap";
import { CSVLink } from "react-csv";
import Cancel from "../../Assets/img/x.png";
import "./style.css";
import XLSX from "xlsx";

/**
 * Exports an array of objects to an Excel file using xlsx.
 * - rows: Array<object>
 * - fileName: string (should end with .xlsx)
 * - sheetName: string
 */
const exportToExcel = (rows, fileName = "export.xlsx", sheetName = "Sheet1") => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const ws = XLSX.utils.json_to_sheet(safeRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};

const ExportLink = ({
  show,
  close,
  title,
  headers,
  item,
  products,
  filename,
  columns, // kept for compatibility even if unused
}) => {
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;

    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);

    const content = {
      startY: 50,
      head: headers, // should be like: [["Col1","Col2",...]]
      body: item, // should be like: [[v1,v2,...], ...]
    };

    doc.text(title || "Export", marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${filename || "export"}.pdf`);
  };

  const exportExcel = () => {
    // Use the same data you already export to CSV
    const safeName = filename ? `${filename}.xlsx` : "export.xlsx";
    exportToExcel(products, safeName, "Report");
  };

  const copyToClipboard = async () => {
    try {
      const text = JSON.stringify(products ?? [], null, 2);
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard ✅");
    } catch (e) {
      console.error(e);
      alert("Copy failed ❌ (browser blocked clipboard access)");
    }
  };

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
          <div className="header-wrapper d-flex justify-content-between align-item-center justify-content-center">
            <div className="modal-header">Export</div>
            <div onClick={close} style={{ cursor: "pointer" }}>
              <img src={Cancel} alt="Close" />
            </div>
          </div>
        </Container>

        <hr />

        <Container>
          <h3>Select Export Type</h3>

          <Form>
            <Row>
              <Button
                onClick={exportPDF}
                className="pdf export-btn"
                variant="light"
                type="button"
              >
                Export PDF
              </Button>

              <Button
                className="excel export-btn"
                variant="light"
                type="button"
                onClick={exportExcel}
              >
                Export Excel
              </Button>

              <CSVLink
                filename={`${filename || "export"}.csv`}
                className="btn csv export-btn"
                data={products || []}
              >
                Export CSV
              </CSVLink>

              <Button
                className="clip export-btn"
                type="button"
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </Button>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ExportLink;
