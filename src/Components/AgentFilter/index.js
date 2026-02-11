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
      className="rounded border"
    >
      <Modal.Body>
        <Container>
          <div
            className="header-wrapper d-flex justify-content-between align-item-center  justify-content-center"
            justify-content-center
          >
            <div className="modal-header">Filter by</div>
            <div onClick={close} className="align-item-center  pt-3">
              <img src={Cancel} alt="Close" />
            </div>
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
                className="filter-btn btn "
                type="reset"
                size="sm"
                // onClick={resetFilter}
              >
                CLEAR FILTER
              </Button>

              <Button
                variant="outline-primary"
                className="btn filter"
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
