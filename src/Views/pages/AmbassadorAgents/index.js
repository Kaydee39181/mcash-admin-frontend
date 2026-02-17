import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import AssignTerminal from "../../../Components/Assign Terminal";
import Loader from "../../../Components/secondLoader";
import { Modal, DropdownButton, Dropdown } from "react-bootstrap";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import DashboardTemplate from "../../template/dashboardtemplate";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";


import {
  FetchambassadorAgent,
  ActivatateCode,
  FetchBankTerminal,
  UnAssignTerminal,
} from "../../../Redux/requests/agentRequest";

import { connect } from "react-redux";
import "./style.css";
import Pagination from "react-js-pagination";

const Agents = (props) => {
  const {
    FetchBankTerminal: FetchBankTerminals,
    FetchambassadorAgent: FetchambassadorAgents,
    UnAssignTerminal: UnAssignTerminals,
    ActivatateCode: ActivatateCodes,
    bankTerminal,
    agents,
    loading,
    activationCode,
    success,
    unassignSuccess,
    successActivation,
    agentTotal,
    history,
  } = props;
  const [businessName, setBusinessName] = useState("");
  const [ExportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);

  const initialState = {
    startDate: "",
    endDate: "",
    username: "",
    businessName: "",
    phone: "",
    agentId: "",
  };

  const [filterValues, setFilterValues] = useState(initialState);

  const [smShow, setSmShow] = useState(false);
  const [activation, setActivation] = useState(null);
  const [terminalID, showTerminalID] = useState(false);
  const [agentID, setAgentId] = useState("");
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const reload = () => {
    FetchambassadorAgents(nextPage, length, filterValues);
    FetchBankTerminals();
  };
  const closeExport = () => {
    showExportModal(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };

  useEffect(() => {
    setSmShow(false);
    FetchambassadorAgents(nextPage, length, filterValues);
    FetchBankTerminals();
  }, [nextPage, length, filterValues]);

  function _handleFilterValue(event) {
    event.preventDefault();
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    setNextPage(0);
    showExportModal(false);
  }
  const OpenFilter = () => {
    showFilterModal(true);
    setFilterValues(initialState);
  };

  useEffect(() => {
    console.log(successActivation, activationCode);
    if (successActivation && activationCode != null) {
      setSmShow(true);
      setActivation(activationCode);
      return;
    }
  }, [successActivation, activationCode]);

  useEffect(() => {
    if (unassignSuccess) {
      // FetchambassadorAgents(nextPage, length, filterValues);
      reload();
    }
  }, [unassignSuccess, success]);

  function ActivatateCode(agentId) {
    // setActivation(null);
    ActivatateCodes(agentId);
  }

  function ViewTransaction(agentId) {
    // setActivation(null);
    localStorage.setItem("agentId", agentId);
    window.location = "/agenttransactions";
  }
  const AssignTerminals = (agentId, businessName) => {
    setBusinessName(businessName);

    showTerminalID(true);
    setAgentId(agentId);
    FetchBankTerminals(agentId);
  };

  const UnAssignTerminal = (agentId) => {
    UnAssignTerminals(agentId);

    FetchambassadorAgents(nextPage, length, initialState);
  };

  const closeAssignTerminal = () => {
    showTerminalID(false);
  };

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  const handleSelect = (e) => {
    setLength(Number(e));
    setNextPage(0);
    setActivePage(1);
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchambassadorAgents(nextPage, length, filterValues);
    closeFilter();
    setNextPage(0);
  };

  const title = "Agents page";
  const headers = [
    [
      "Agent ID",
      "Business Name",
      "User Name",
      "Phone Number",
      "Terminal ID",
      "Date Created",
    ],
  ];

  const item = agents.map((agent) => [
    agent.id,
    agent.businessName,
    agent.user.username,
    agent.businessPhone,
    agent.bankTerminal === null ? "" : agent.bankTerminal.terminalId,
    agent.createdAt,
  ]);

  const products = agents.map((agent, index) => {
    return {
      agent: agent ? agent : "",
      id: index,
      AgentID: agent.id === null ? "" : agent.id,
      BusinessName: agent.businessName === null ? "" : agent.businessName,
      UserName: agent.user.username === null ? "" : agent.user.username,
      PhoneNumber: agent.businessPhone === null ? "" : agent.businessPhone,
      Action: "",
      TerminalID:
        agent.bankTerminal === null ? "" : agent.bankTerminal.terminalId,
      DateCreated: agent.createdAt === null ? "" : agent.createdAt,
    };
  });

  const columns = [
    // { dataField: 'id', text: 'Id'},
    { dataField: "AgentID", text: "Agent ID" },
    {
      dataField: "BusinessName",
      text: "Business Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "UserName",
      text: "User Name",
      style: { width: "20em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: (colum, colIndex) => {
        return { width: "200px", textAlign: "center" };
      },
    },
    { dataField: "PhoneNumber", text: "Phone Number" },
    
   
    
    { dataField: "DateCreated", text: "Date Created" },
  ];
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>Agents</h3>
        </div>

        <div className="agent-transact-header">
          <div>
            <div>A list of all agents on McashPoint</div>
          </div>
          <div className="manage-agent">
            <span>
              <img src={Print} />
              Print
            </span>

            <span onClick={() => OpenFilter()}>
              <img src={Filter} />
              Filter
            </span>

            <span onClick={() => showExportModal(true)}>
              <img src={Upload} />
              Export
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <Modal
            size="sm"
            show={smShow}
            onHide={() => setSmShow(false)}
            aria-labelledby="example-modal-sizes-title-sm"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>{activationCode}</Modal.Body>
          </Modal>
          {loading && (
            <Loader
              type="TailSpin"
              type="Oval"
              height={60}
              width={60}
              color="#1E4A86"
            />
          )}
          <h4>All Agents</h4>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={products}
            columns={columns}
            defaultSorted={defaultSorted}
            bordered={false}
            hover
            condensed
          />
          {/* <button onClick={() => showTerminalID(true)}>Assign</button> */}
          <AssignTerminal
            bankTerminals={bankTerminal}
            reload={reload}
            load={loading}
            show={terminalID}
            close={closeAssignTerminal}
            agentsId={agentID}
            businessName={businessName}
          />
          <div className="pagination_wrap">
            <DropdownButton
              menuAlign="right"
              title={length}
              id="dropdown-menu-align-right"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
              <Dropdown.Item eventKey="20">20</Dropdown.Item>
              <Dropdown.Item eventKey="30">30</Dropdown.Item>
              <Dropdown.Item eventKey="50">50</Dropdown.Item>
              <Dropdown.Item eventKey="100">100</Dropdown.Item>
              <Dropdown.Item eventKey={agentTotal ? String(agentTotal) : "0"}>
                All
              </Dropdown.Item>
            </DropdownButton>
            <p>Showing 1 to {length} of {agentTotal}</p>
            <div className="pagination">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={length}
                totalItemsCount={agentTotal}
                pageRangeDisplayed={5}
                onChange={_handlePageChange}
              />
            </div>
          </div>
          <FilterModal
            type={"Agent  "}
            typetext={"Enter Agent  Type"}
            idtext={"Enter Agent  ID"}
            show={FilterModalActive}
            name={"agent"}
            close={closeFilter}
            nextPage={nextPage}
            length={length}
            loadPage={FetchambassadorAgents}
            handleFilterValue={_handleFilterValue}
            submitFilter={onFilterSubmit}
          />
          <ExportModal
            show={ExportModalActive}
            close={closeExport}
            filename="Agent file"
            title={title}
            headers={headers}
            item={item}
            products={products}
            columns={columns}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
const mapStateToProps = (state) => (
  console.log(state),
  {
    agents: state.agents.agents,
    activationCode: state.agents.activationCode,
    bankTerminal: state.agents.bankTerminal,
    loading: state.agents.loading,
    error: state.agents.error,
    success: state.agents.success,
    unassignSuccess: state.agents.unassignSuccess,
    successActivation: state.agents.successActivation,
    agentTotal: state.agents.agentTotal,
  }
);

export default connect(mapStateToProps, {
  FetchambassadorAgent,
  ActivatateCode,
  FetchBankTerminal,
  UnAssignTerminal,
})(Agents);
