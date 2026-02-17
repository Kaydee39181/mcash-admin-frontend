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

const sanitizeSegment = (value) => {
  const safeValue = String(value ?? "").trim();
  if (!safeValue) return "na";

  return safeValue
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/_+/g, "_")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 60) || "na";
};

const normalizeFilterValue = (value) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const lowered = trimmed.toLowerCase();
    if (
      lowered === "undefined" ||
      lowered === "null" ||
      lowered.startsWith("select ")
    ) {
      return "";
    }

    return trimmed;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeFilterValue(item))
      .filter(Boolean)
      .join("_");
  }

  return String(value);
};

const formatDateForFilename = (value) => {
  const normalized = normalizeFilterValue(value);
  if (!normalized) return "";

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return sanitizeSegment(normalized);
  }

  return parsed.toISOString().slice(0, 10);
};

const toFileKey = (key) =>
  String(key || "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const pickFirstByKeys = (filterMap, keys = []) => {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(filterMap, key)) continue;
    const value = normalizeFilterValue(filterMap[key]);
    if (!value) continue;
    return value;
  }
  return "";
};

const buildExportFileBase = (baseName, filters = {}) => {
  const fileSegments = [sanitizeSegment(baseName || "export")];
  const normalizedFilterKeyMap = {};

  Object.entries(filters || {}).forEach(([key, rawValue]) => {
    const normalizedValue = normalizeFilterValue(rawValue);
    if (!normalizedValue) return;
    normalizedFilterKeyMap[toFileKey(key)] = normalizedValue;
  });

  const startDate =
    normalizedFilterKeyMap.start_date ||
    normalizedFilterKeyMap.from_date;
  const endDate =
    normalizedFilterKeyMap.end_date ||
    normalizedFilterKeyMap.to_date;

  const formattedStartDate = formatDateForFilename(startDate);
  const formattedEndDate = formatDateForFilename(endDate);
  let qualifierCount = 0;

  if (formattedStartDate && formattedEndDate) {
    fileSegments.push(`date_${formattedStartDate}_to_${formattedEndDate}`);
    qualifierCount += 1;
  } else if (formattedStartDate) {
    fileSegments.push(`from_${formattedStartDate}`);
    qualifierCount += 1;
  } else if (formattedEndDate) {
    fileSegments.push(`to_${formattedEndDate}`);
    qualifierCount += 1;
  }

  // Explicitly ignore status and non-priority fields.
  delete normalizedFilterKeyMap.status;
  delete normalizedFilterKeyMap.status_code;
  delete normalizedFilterKeyMap.draw;

  const prioritizedCandidates = [
    {
      key: "number",
      value: pickFirstByKeys(normalizedFilterKeyMap, [
        "transaction_id",
        "agent_id",
        "terminal_id",
        "phone_number",
        "phone",
        "rrn",
        "stan",
        "pan",
        "agent_manager_id",
        "manager_id",
        "member_id",
        "account_number",
        "number",
      ]),
    },
    {
      key: "username",
      value: pickFirstByKeys(normalizedFilterKeyMap, [
        "username",
        "user_name",
        "agent_manager_name",
        "manager_name",
      ]),
    },
    {
      key: "businessname",
      value: pickFirstByKeys(normalizedFilterKeyMap, [
        "business_name",
        "businessname",
      ]),
    },
  ];

  for (const candidate of prioritizedCandidates) {
    if (qualifierCount >= 2) break;
    if (!candidate.value) continue;
    fileSegments.push(`${candidate.key}-${sanitizeSegment(candidate.value)}`);
    qualifierCount += 1;
  }

  return fileSegments.filter(Boolean).join("__");
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
  filterValues,
}) => {
  const exportFileBase = buildExportFileBase(filename, filterValues);

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
    doc.save(`${exportFileBase}.pdf`);
  };

  const exportExcel = () => {
    // Use the same data you already export to CSV
    const safeName = `${exportFileBase}.xlsx`;
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
                filename={`${exportFileBase}.csv`}
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
