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
  const { handleFilterValue, submitFilter, transactionStatus } = props;

  const isTransaction = props.name === "transaction";
  const isVirtualAccount = props.name === "virtualAccount";
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
              {props.name === "agentPurse" ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                    <Form.Label>Bussiness Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Bussines Name"
                      name="businessName"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>

              </Row>
              :

              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      size="sm"
                      type="date"
                      placeholder="Start Date"
                      name="startDate"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      size="sm"
                      type="date"
                      placeholder="Enter End Date"
                      name="endDate"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
                {isTransaction || isVirtualAccount ?
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Select Status</Form.Label>
                      <Form.Control
                        size="sm"
                        as="select"
                        name="status"
                        onChange={handleFilterValue}
                      >
                        <option>Select Status</option>
                        {transactionStatus.map((tranStatus, i) => {
                          return (
                            <option key={i} value={tranStatus.statusCode}>
                              {tranStatus.statusMessage}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  : ''}
              </Row>
            }

            {isTransaction || props.name === "centralpurse" ?
              <Row>


                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>{props.type} Type</Form.Label>
                    <Form.Control
                      size="sm"
                      as="select"
                      name='transactionType'
                      onChange={handleFilterValue}
                    >
                      <option>{props.typetext}</option>
                      <option value="card">card</option>
                      {props.transactionsType.map((transType, i) => {
                        return (
                          <option key={i} value={transType.id}>
                            {transType.type}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>{props.type} ID</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name='transactionId'
                      placeholder="Enter Transaction ID"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
              </Row>
              : ''
            }

            {isVirtualAccount ? (
              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Transaction ID</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="transactionId"
                      placeholder={props.idtext || "Enter Transaction ID"}
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ) : (
              ""
            )}
            {
              isTransaction ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>RRN</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="rrn"
                        placeholder="Enter RRN"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>PAN</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Enter PAN"
                        name="pan"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>STAN</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="stan"
                        placeholder="STAN"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                </Row> : ''

            }



            {
              props.name === "agent" || props.name === "agentmanager" || props.name === "centralpurse" ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Enter user Name"
                        name="username"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  {props.name === "centralpurse" ?
                    <Col md={4} sm={12}>
                      <Form.Group controlId="">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="businessName"
                          placeholder="Enter business Name"
                          onChange={handleFilterValue}
                        />
                      </Form.Group>
                    </Col>
                    : (<Col md={4} sm={12}>
                      <Form.Group controlId="">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="businessName"
                          placeholder="Enter business Name"
                          onChange={handleFilterValue}
                        />
                      </Form.Group>
                    </Col>)
                  }

                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="phone"
                        placeholder="phone number"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                </Row> :
                ""
            }


            {
              isTransaction ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Enter Terminal ID</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        // variant="light"
                        name="terminalId"
                        placeholder="Enter Terminal ID"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Agent ID</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="agentId"
                        placeholder="Enter Agent ID"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Agent Manager ID</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="agentManagerId"
                        placeholder="Enter Agent Manager ID"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                : ''
            }

            {
              isTransaction ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Agent Manager Name</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="agentManagerName"
                        placeholder="Enter Agent Manager Name"
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                  {/* <Col md={4} sm={12}>
                <Form.Group controlId="">
                  <Form.Label>Period</Form.Label>
                  <Form.Control
                    size="sm"
                    name="period"
                    as="select"
                    onChange={handleFilterValue}
                  >
                    <option>Select Period</option>
                  </Form.Control>
                </Form.Group>
              </Col> */}
                </Row>
                : ''
            }
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
