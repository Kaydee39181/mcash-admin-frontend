import React from 'react'
import { Form } from "react-bootstrap";
export default function Notification() {
    return (
      <div className="main-tabs">
        <Form>
          <div className="d-flex justify-content-between">
            <div>Notifications</div>
            <div></div>
          </div>
          <br />
          <Form.Check
            label="Desktop Notifications"
            type="switch"
            id="custom-switch"
          />
          <br />
          <div>
            When mCashPoint is closed (but your browser is opened) notifications
            will appear at the corner of your screen.
          </div>
        </Form>
      </div>
    );
}
