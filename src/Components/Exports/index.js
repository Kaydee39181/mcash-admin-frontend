import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Modal, Form, Container, Button, Row } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import Cancel from "../../Assets/img/x.png";
import "./style.css";
import XLSX from "xlsx";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportLink = ({
  show,
  close,
  title,
  headers,
  item,
  products,
  filename,
  columns,
}) => {
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    let content = {
      startY: 50,
      head: headers,
      body: item,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${filename}.pdf`);
  };
  // const handleFile = (file) => {
  //   /* Boilerplate to set up FileReader */
  //   const reader = new FileReader();
  //   const rABS = !!reader.readAsBinaryString;
  //   reader.onload = (e) => {
  //     /* Parse data */
  //     const bstr = e.target.result;
  //     const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
  //     /* Get first worksheet */
  //     const wsname = wb.SheetNames[0];
  //     const ws = wb.Sheets[wsname];
  //     /* Convert array of arrays */
  //     const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  //     /* Update state */
  //     this.setState({ data: data, cols: make_cols(ws["!ref"]) });
  //   };
  //   if (rABS) reader.readAsBinaryString(file);
  //   else reader.readAsArrayBuffer(file);
  // };
  const exportFile = (file) => {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
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
          <div
            className="header-wrapper d-flex justify-content-between align-item-center  justify-content-center"
            justify-content-center
          >
            <div className="modal-header">Export</div>
            <div onClick={close}>
              <img src={Cancel} />
            </div>
          </div>
        </Container>
        <hr />

        <Container>
          <h3>Select Export Type</h3>
          <Form>
            <Row>
              <Button
                onClick={() => exportPDF()}
                className="pdf export-btn"
                variant="light"
                type="submit"
              >
                Export PDF
              </Button>
              {/* <DragDropFile handleFile={handleFile}>
                <div className="row">
                  <div className="col-xs-12">
                    <DataInput handleFile={handleFile} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <button
                      disabled={!products.length}
                      className="btn btn-success"
                      onClick={exportFile}
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <OutTable data={this.state.data} cols={columns} />
                  </div>
                </div>
              </DragDropFile> */}
              {/* <ExcelFile filename="test" element={<button className="excel export-btn btn">Export Excel</button>}>
                <ExcelSheet data={item} name="Test" >
                  {item.map((ite) => {
                    return <ExcelColumn label={ite} value={ite} />;
                  })}
                </ExcelSheet>
              </ExcelFile>  */}
              {/* <ReactHTMLTableToExcel
                className="btn excel export-btn"
                table="emp"
                filename="ReportExcel"
                sheet="Sheet"
                buttonText="Export excel"
              /> */}
              {/* <Button
                className="excel export-btn"
                variant="light"
                type="submit"
                onClick={() => exportFile()}

              >
                Export Excel
              </Button> */}
              {/* <Button className="csv export-btn" variant="light" type="submit"> */}
              <CSVLink
                variant="light"
                filename={`${filename}.csv`}
                className="btn csv export-btn"
                data={products}
              >
                Export CSV
              </CSVLink>
              ;{/* </Button> */}
              <Button className="clip export-btn" type="submit">
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
