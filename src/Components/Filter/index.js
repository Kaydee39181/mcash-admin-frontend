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
    transactionStatus = [],
    transactionsType = [],
    resetFilter,
    filterValues = {},
  } = props;

  const isTransaction = props.name === "transaction";
  const isVirtualAccount = props.name === "virtualAccount";
  const isAgent = props.name === "agent";
  const getFieldValue = (fieldName) =>
    Object.prototype.hasOwnProperty.call(filterValues, fieldName)
      ? filterValues[fieldName]
      : undefined;
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

              !isAgent ? (
              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      size="sm"
                      type="date"
                      placeholder="Start Date"
                      name="startDate"
                      value={getFieldValue("startDate")}
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
                      value={getFieldValue("endDate")}
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
                        value={getFieldValue("status")}
                        onChange={handleFilterValue}
                      >
                        <option value="">{isVirtualAccount ? "All" : "Select Status"}</option>
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
              ) : null
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
                      value={getFieldValue("transactionType")}
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
                      value={getFieldValue("transactionId")}
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
              </Row>
              : ''
            }

            {isVirtualAccount ? (
              <>
              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Transaction ID</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="transactionId"
                      value={getFieldValue("transactionId")}
                      placeholder="Search Transaction ID"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Reference</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="reference"
                      value={getFieldValue("reference")}
                      placeholder="Search Reference"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      size="sm"
                      as="select"
                      name="type"
                      value={getFieldValue("type")}
                      onChange={handleFilterValue}
                    >
                      <option value="">All</option>
                      {transactionsType.map((transactionType, index) => (
                        <option key={index} value={transactionType.type}>
                          {transactionType.type}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="accountNumber"
                      value={getFieldValue("accountNumber")}
                      placeholder="Search Account Number"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Account Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="accountName"
                      value={getFieldValue("accountName")}
                      placeholder="Search Account Name"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="bankName"
                      value={getFieldValue("bankName")}
                      placeholder="Search Bank Name"
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                </Col>
              </Row>
              </>
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
                      value={getFieldValue("rrn")}
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
                      value={getFieldValue("pan")}
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
                      value={getFieldValue("stan")}
                      onChange={handleFilterValue}
                    />
                  </Form.Group>
                  </Col>
                </Row> : ''

            }



            {
              isAgent ? (
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Enter user Name"
                        name="username"
                        value={getFieldValue("username")}
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="phone"
                        placeholder="phone number"
                        value={getFieldValue("phone")}
                        onChange={handleFilterValue}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ) : props.name === "agentmanager" || props.name === "centralpurse" ?
                <Row>
                  <Col md={4} sm={12}>
                    <Form.Group controlId="">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Enter user Name"
                        name="username"
                        value={getFieldValue("username")}
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
                        value={getFieldValue("businessName")}
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
                        value={getFieldValue("businessName")}
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
                        value={getFieldValue("phone")}
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
                        value={getFieldValue("terminalId")}
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
                        value={getFieldValue("agentId")}
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
                        value={getFieldValue("agentManagerId")}
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
                        value={getFieldValue("agentManagerName")}
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
                type={resetFilter ? "button" : "reset"}
                size="sm"
                onClick={resetFilter}
              >
                CLEAR FILTER
              </Button>

              <Button
                variant="outline-primary"
                className="filter-btn filter"
                type="submit"
                size="sm"
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
