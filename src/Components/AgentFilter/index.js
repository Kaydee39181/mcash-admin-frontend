import React from "react";
import {
  Modal,
  Form,
  Container,
  Button,
  Row,
  Col,
} from "react-bootstrap";

import Cancel from "../../Assets/img/x.png";
import "./style.css";

const Filter = ({ show, close, ...props }) => {
  const {
    handleFilterValue,
    submitFilter,
  } = props;
  console.log(props.name);
  return (
    <Modal
      size="xl"
      show={show}
      onHide={close}
      centered={true}
      aria-labelledby="edit-profile-modal"
      className="app-modal filter-modal rounded border"
    >
      <Modal.Body>
        <Container>
          <div className="header-wrapper">
            <div className="modal-header">Filter by</div>
            <button
              type="button"
              onClick={close}
              className="modal-close-btn"
              aria-label="Close filter modal"
            >
              <img src={Cancel} alt="Close" />
            </button>
          </div>
        </Container>
        <hr />

        <Container>
          <h3>Enter Filter Parameters</h3>
          <Form onSubmit={submitFilter}>
            <Row>
              <Col md={4} sm={12}>
                <Form.Group controlId="">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder=" Username"
                    name="username"
                    onChange={handleFilterValue}
                  />
                </Form.Group>
              </Col>
              <Col md={4} sm={12}>
                <Form.Group controlId="">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder=" Phone"
                    name="phone"
                    onChange={handleFilterValue}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="filter-btns">
              <Button
                variant="outline-primary"
                className="filter-btn"
                type="reset"
                size="sm"
                // onClick={resetFilter}
              >
                CLEAR FILTER
              </Button>

              <Button
                variant="outline-primary"
                className="filter-btn filter"
                type="submit"
                size="sm"
                onClick={close}
              >
                FILTER
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default Filter;
