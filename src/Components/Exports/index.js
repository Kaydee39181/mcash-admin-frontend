import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Modal, Form, Container, Button, Row } from "react-bootstrap";
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

const buildRowsFromHeaders = (headers = [], item = []) => {
  const headerRow = Array.isArray(headers?.[0]) ? headers[0] : [];
  if (!headerRow.length || !Array.isArray(item)) return [];

  return item.map((row = []) =>
    headerRow.reduce((acc, columnName, index) => {
      acc[columnName] = row[index] ?? "";
      return acc;
    }, {})
  );
};

const sanitizeFallbackRows = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((row) =>
    Object.entries(row || {}).reduce((acc, [key, value]) => {
      if (value === null || value === undefined) {
        acc[key] = "";
        return acc;
      }

      if (typeof value === "object") {
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {})
  );

const buildExportRows = (headers, item, products) => {
  const headerRows = buildRowsFromHeaders(headers, item);
  if (headerRows.length > 0) {
    return headerRows;
  }

  return sanitizeFallbackRows(products);
};

const escapeCsvValue = (value) => {
  const normalized = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const exportToCsv = (rows, fileName = "export.csv") => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const columns = Array.from(
    safeRows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const csvLines = [];
  if (columns.length > 0) {
    csvLines.push(columns.map(escapeCsvValue).join(","));
    safeRows.forEach((row) => {
      csvLines.push(columns.map((key) => escapeCsvValue(row?.[key])).join(","));
    });
  }

  const csvContent = `\uFEFF${csvLines.join("\n")}`;
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(downloadUrl);
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
  requestExportData,
}) => {
  const [isPreparingExport, setIsPreparingExport] = useState(false);

  const resolveExportPayload = async () => {
    if (typeof requestExportData !== "function") {
      return {
        title,
        headers,
        item,
        products,
        filterValues,
        filename,
      };
    }

    setIsPreparingExport(true);

    try {
      const requestedPayload = (await requestExportData()) || {};
      return {
        title: requestedPayload.title ?? title,
        headers: requestedPayload.headers ?? headers,
        item: requestedPayload.item ?? item,
        products: requestedPayload.products ?? products,
        filterValues: requestedPayload.filterValues ?? filterValues,
        filename: requestedPayload.filename ?? filename,
      };
    } finally {
      setIsPreparingExport(false);
    }
  };

  const exportPDF = ({
    exportTitle,
    exportHeaders,
    exportItems,
    exportName,
    exportFilters,
  }) => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const pdfFileBase = buildExportFileBase(exportName, exportFilters);

    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);

    const content = {
      startY: 50,
      head: exportHeaders, // should be like: [["Col1","Col2",...]]
      body: exportItems, // should be like: [[v1,v2,...], ...]
    };

    doc.text(exportTitle || "Export", marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${pdfFileBase}.pdf`);
  };

  const exportExcel = ({ exportRows, exportName, exportFilters }) => {
    const safeName = `${buildExportFileBase(exportName, exportFilters)}.xlsx`;
    exportToExcel(exportRows, safeName, "Report");
  };

  const exportCSV = ({ exportRows, exportName, exportFilters }) => {
    const safeName = `${buildExportFileBase(exportName, exportFilters)}.csv`;
    exportToCsv(exportRows, safeName);
  };

  const copyToClipboard = async ({ exportRows }) => {
    try {
      const text = JSON.stringify(exportRows ?? [], null, 2);
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard ✅");
    } catch (e) {
      console.error(e);
      alert("Copy failed ❌ (browser blocked clipboard access)");
    }
  };

  const handleExport = async (exportType) => {
    try {
      const payload = await resolveExportPayload();
      const exportRows = buildExportRows(
        payload.headers,
        payload.item,
        payload.products
      );
      const exportName = payload.filename || filename;
      const exportFilters = payload.filterValues ?? filterValues;
      const exportHeaders = payload.headers ?? headers;
      const exportItems = payload.item ?? item;
      const exportTitle = payload.title ?? title;

      if (exportType === "pdf") {
        exportPDF({
          exportTitle,
          exportHeaders,
          exportItems,
          exportName,
          exportFilters,
        });
        return;
      }

      if (exportType === "excel") {
        exportExcel({
          exportRows,
          exportName,
          exportFilters,
        });
        return;
      }

      if (exportType === "csv") {
        exportCSV({
          exportRows,
          exportName,
          exportFilters,
        });
        return;
      }

      if (exportType === "clipboard") {
        await copyToClipboard({ exportRows });
      }
    } catch (error) {
      console.error(error);
      alert(error?.message || "Export failed. Please try again.");
    }
  };

  const exportActionLabel = isPreparingExport ? "Preparing..." : null;

  return (
    <Modal
      size="lg"
      show={show}
      onHide={close}
      centered={true}
      aria-labelledby="edit-profile-modal"
      className="app-modal export-modal rounded border"
    >
      <Modal.Body>
        <Container>
          <div className="header-wrapper">
            <div className="modal-header">Export</div>
            <button
              type="button"
              onClick={close}
              className="modal-close-btn"
              aria-label="Close export modal"
            >
              <img src={Cancel} alt="Close" />
            </button>
          </div>
        </Container>

        <hr />

        <Container>
          <h3>Select Export Type</h3>

          <Form>
            <Row className="export-actions-row">
              <Button
                onClick={() => handleExport("pdf")}
                className="pdf export-btn"
                variant="light"
                type="button"
                disabled={isPreparingExport}
              >
                {exportActionLabel || "Export PDF"}
              </Button>

              <Button
                className="excel export-btn"
                variant="light"
                type="button"
                onClick={() => handleExport("excel")}
                disabled={isPreparingExport}
              >
                {exportActionLabel || "Export Excel"}
              </Button>

              <Button
                className="csv export-btn"
                variant="light"
                type="button"
                onClick={() => handleExport("csv")}
                disabled={isPreparingExport}
              >
                {exportActionLabel || "Export CSV"}
              </Button>

              <Button
                className="clip export-btn"
                type="button"
                onClick={() => handleExport("clipboard")}
                disabled={isPreparingExport}
              >
                {exportActionLabel || "Copy info"}
              </Button>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ExportLink;
