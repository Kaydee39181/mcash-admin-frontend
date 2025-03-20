import React from 'react';
import DashboardTemplate from "../../template/dashboardtemplate";
import 'bootstrap/dist/css/bootstrap.min.css';
import MCP from '../../../Assets/img/mCP-logo 1.svg';
import GLB2 from '../../../Assets/img/globus-bank-logo-png_seeklogo-487524.png';
import { Card } from "react-bootstrap";

export default function VirtualAccount() {
  return (
    <DashboardTemplate>
      <div className="d-flex flex-column align-items-center justify-content-center bg-gradient">
        <div className="card shadow-lg text-center mb-5 p-5">
          <h3>🚀 Introducing !!!</h3>

          <Card.Img
            variant="top"
            src={MCP}
            className='ml-5'
            style={{ width: "25rem", height: "12em", marginBottom: "-30px" }}
          />

          <Card.Body className="p-0">
            <h1 style={{ fontSize: "60px", color: "#24497d", marginTop: "0px" }}>
              Virtual Account
            </h1>
          </Card.Body>

          <p className="fs-5 mt-3">
            We are excited to introduce <strong>Virtual Account</strong>
          </p>
          <p className="text-muted">
            A Secure, fast, and easy-to-use platform for your transactions. Stay tuned for updates!
          </p>

          <div className="d-flex align-items-center justify-content-center mt-3">
            <p className="mb-0 text-lg fw-semibold me-2">Powered by</p>
            <Card.Img 
              src={GLB2}  
              className="ms-2" 
              style={{ width: "12rem", height: "auto" }} 
            />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}
