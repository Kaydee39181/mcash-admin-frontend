import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import AssignTerminal from "../../../Components/Assign Terminal";
import HardwareModal from "../../../Components/hardware";

import { DropdownButton, Dropdown } from "react-bootstrap";
import Loader from "../../../Components/secondLoader";
import { Modal } from "react-bootstrap";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import { FetchHardWare } from "../../../Redux/requests/hardwareRequest";
import {
  FetchAgent,
  ActivatateCode,
  FetchBankTerminal,
  UnAssignTerminal,
} from "../../../Redux/requests/agentRequest";
import { connect } from "react-redux";
import "./style.css";
import Pagination from "react-js-pagination";
import { isAgentManagerRole } from "../../../utils/roleLabel";

const resolveFullName = (person) => {
  if (!person || typeof person !== "object") return "";

  if (person.fullName) return person.fullName;

  return [person.firstname, person.middlename, person.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const getAgentManagerId = (agentManager) => {
  if (agentManager === null || agentManager === undefined) return "";

  if (typeof agentManager !== "object") {
    return String(agentManager);
  }

  return String(agentManager?.id ?? agentManager?.user?.id ?? "");
};

const getAgentManagerName = (agentManager) => {
  if (!agentManager || typeof agentManager !== "object") return "";

  return (
    agentManager?.accountName ||
    resolveFullName(agentManager?.user) ||
    resolveFullName(agentManager) ||
    ""
  );
};

const getAgentEmail = (agent) => {
  if (!agent || typeof agent !== "object") return "";

  return agent?.user?.email || "";
};

const getAgentDateOfBirth = (agent) => {
  const value = agent?.dateOfBirth;

  if (!value) return "";
  if (typeof value !== "string") return String(value);

  return value.split("T")[0].split(" ")[0];
};

const getGlobusVirtualAccount = (agent) => {
  if (!agent || typeof agent !== "object") return "";

  return agent?.globusVirtualAccount || "";
};

const Agents = (props) => {
  const token = JSON.parse(localStorage.getItem("data"));
  let { name } = token.user.roleGroup;

  console.log("token", name);

  const {
    FetchBankTerminal: FetchBankTerminals,
    FetchAgent: FetchAgents,
    UnAssignTerminal: UnAssignTerminals,
    ActivatateCode: ActivatateCodes,
    FetchHardWare: FetchHardWares,
    bankTerminal,
    agents,
    loading,
    activationCode,
    success,
    unassignSuccess,
    successActivation,
    agentTotal,
    showFilterModal,
    FilterModalActive,
    showExportModal,
    ExportModalActive,
    initialState,
    filterValues,
    setFilterValues,
  } = props;
  const [businessName, setBusinessName] = useState("");
  const [memberID, setmemberID] = useState("");
  const [showhardware, setshowhardware] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [terminalID, showTerminalID] = useState(false);
  const [agentID, setAgentId] = useState("");
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [type, SetType] = useState("assigndevice");
  const columnHidden = isAgentManagerRole(name);

  const closehardware = () => {
    setshowhardware(false);
    setmemberID("");
    window.location.reload();
  };

  function AssignDevice(agentId) {
    SetType("assigndevice");
    setmemberID(agentId);
    setshowhardware(true);
  }

  function UnAssignDevice(agentId) {
    SetType("unassigndevice");
    setmemberID(agentId);
    setshowhardware(true);
  }
  const reload = useCallback(() => {
    FetchAgents(nextPage, length, filterValues);
    FetchBankTerminals();
  }, [FetchAgents, FetchBankTerminals, filterValues, length, nextPage]);
  const closeExport = () => {
    showExportModal(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };

  useEffect(() => {
    FetchHardWares();
    // console.log(hardwares)
  }, [FetchHardWares]);

  useEffect(() => {
    setSmShow(false);
    FetchAgents(nextPage, length, filterValues);
    FetchBankTerminals();
  }, [FetchAgents, FetchBankTerminals, filterValues, length, nextPage]);

  function _handleFilterValue(event) {
    event.preventDefault();
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    setNextPage(0);
    showExportModal(false);
  }

  useEffect(() => {
    console.log(successActivation, activationCode);
    if (successActivation && activationCode != null) {
      setSmShow(true);
      return;
    }
  }, [successActivation, activationCode]);

  useEffect(() => {
    if (unassignSuccess) {
      // FetchAgents(nextPage, length, filterValues);
      reload();
    }
  }, [reload, success, unassignSuccess]);

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

    FetchAgents(nextPage, length, initialState);
  };

  const closeAssignTerminal = () => {
    showTerminalID(false);
  };

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  const handleSelect = (e) => {
    const selectedLength = Number(e);
    setLength(selectedLength);
    setNextPage(0);
    setActivePage(1);
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchAgents(nextPage, length, filterValues);
    closeFilter();
    setNextPage(0);
  };

  const title = "Agents page";
  const headers = [
    [
      "Agent ID",
      "Business Name",
      "User Name",
      "Email",
      "Date Of Birth",
      "Globus Virtual Account",
      "Phone Number",
      "Terminal ID",
      "Date Created",
    ],
  ];

  const item = agents.map((agent) => [
    agent.id,
    agent.businessName,
    agent?.user?.username || "",
    getAgentEmail(agent),
    getAgentDateOfBirth(agent),
    getGlobusVirtualAccount(agent),
    agent.businessPhone,
    agent.bankTerminal === null ? "" : agent.bankTerminal.terminalId,
    agent.createdAt,
  ]);

  const managerNameByManagerId = agents.reduce((acc, agent) => {
    const managerId = getAgentManagerId(agent?.agentManager);
    const managerName = getAgentManagerName(agent?.agentManager);

    if (managerId && managerName && !acc.has(managerId)) {
      acc.set(managerId, managerName);
    }

    return acc;
  }, new Map());

  const products = agents.map((agent, index) => {
    const managerId = getAgentManagerId(agent?.agentManager);
    const resolvedManagerName =
      getAgentManagerName(agent?.agentManager) ||
      (managerId ? managerNameByManagerId.get(managerId) || "" : "");

    return {
      agent: agent ? agent : "",
      id: index,
      AgentID: agent.id === null ? "" : agent.id,
      BusinessName: agent.businessName === null ? "" : agent.businessName,
      UserName: agent?.user?.username === null ? "" : agent?.user?.username || "",
      Email: getAgentEmail(agent),
      DateOfBirth: getAgentDateOfBirth(agent),
      GlobusVirtualAccount: getGlobusVirtualAccount(agent),
      PhoneNumber: agent.businessPhone === null ? "" : agent.businessPhone,
      Action: "",
      TerminalID:
        agent.bankTerminal === null ? "" : agent.bankTerminal.terminalId,
      AgentManager: resolvedManagerName,
      DateCreated: agent.createdAt === null ? "" : agent.createdAt,
    };
  });

  const noDataIndication = () => {
    if (loading) return "Loading agents...";
    return "No agents are available for the selected request. Try changing the filters.";
  };

  const totalAgentsCount = Number(agentTotal) || 0;
  const startItem = totalAgentsCount > 0 ? (activePage - 1) * length + 1 : 0;
  const endItem = totalAgentsCount > 0 ? Math.min(activePage * length, totalAgentsCount) : 0;
  const allAgentsEventKey = String(totalAgentsCount > 0 ? totalAgentsCount : length || 10);

  const columns = [
    // { dataField: 'id', text: 'Id'},
    {
      dataField: "AgentID",
      text: "Agent ID",
      formatter: (cellContent, row) => {
        return (
          <NavLink
            to={{
              pathname: `/agentprofile`,
              state: { row },
            }}
            className=" editadmin"
          >
            {row.agent.id}
          </NavLink>
        );
      },
    },
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
    {
      dataField: "Email",
      text: "Email",
      style: { width: "20em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => {
        return { width: "240px", textAlign: "center" };
      },
    },
    {
      dataField: "DateOfBirth",
      text: "Date Of Birth",
      style: { width: "12em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => {
        return { width: "150px", textAlign: "center" };
      },
    },
    {
      dataField: "GlobusVirtualAccount",
      text: "Globus Virtual Account",
      style: { width: "18em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => {
        return { width: "220px", textAlign: "center" };
      },
    },
    { dataField: "PhoneNumber", text: "Phone Number" },
    {
      dataField: "Action",
      text: "Action",
      hidden: columnHidden,
      formatter: (cellContent, row) => {
        console.log(row.agent.bankTerminal);
        return (
          <h5>
            {row.agent.bankTerminal === null ? (
              <button
                type="button"
                className="assign-terminal"
                onClick={() => AssignTerminals(row.AgentID, row.BusinessName)}
              >
                Assign Terminal
              </button>
            ) : (
              <button
                type="button"
                className="unassign-terminal"
                onClick={() => UnAssignTerminal(row.AgentID)}
              >
                Unassign Terminal
              </button>
            )}
          </h5>
        );
      },
    },
    { dataField: "TerminalID", text: "Terminal ID" },
    {
      dataField: "transactionHistory",
      text: "Transaction History",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => ViewTransaction(row.AgentID)}
              className="viewTransac"
            >
              Transaction
            </button>
          </h5>
        );
      },
    },
    {
      dataField: "ActivationCode",
      text: "Activation Code",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => ActivatateCode(row.AgentID)}
              className=" generate-code"
            >
              Generate
            </button>
          </h5>
        );
      },
    },
    // { dataField: 'AgentManager', text: 'Agent Manager'},
    { dataField: "DateCreated", text: "Date Created" },
    { dataField: "AgentManager", text: "Agent Manager" },
    {
      dataField: "AssignDevice",
      text: "Assign Device",
      hidden: columnHidden,
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => AssignDevice(row.agent.user.memberId)}
              className=" generate-code"
            >
              Assign Device
            </button>
          </h5>
        );
      },
    },
    {
      dataField: "UnAssignDevice",
      text: "Unassign Device",
      hidden: columnHidden,
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => UnAssignDevice(row.agent.user.memberId)}
              className=" unassign-terminal"
            >
              UAssign Device
            </button>
          </h5>
        );
      },
    },
  ];
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  return (
    <div className="agents-page">
      <HardwareModal
        show={showhardware}
        close={closehardware}
        memberId={memberID}
        type={type}
      />
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
          type="Oval"
          height={60}
          width={60}
          color="#1E4A86"
        />
      )}
      <div className="table-wrapper">
        <h4>All Agents</h4>
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={products}
          columns={columns}
          noDataIndication={noDataIndication}
          defaultSorted={defaultSorted}
          bordered={false}
          hover
          condensed
        />
      </div>
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
          <Dropdown.Item eventKey={allAgentsEventKey}>All</Dropdown.Item>
        </DropdownButton>
        <p>
          Showing {startItem} to {endItem} of {totalAgentsCount}
        </p>
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
        loadPage={FetchAgents}
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
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    hardwares: state.hardwaredevice.hardwares,
    agents: state.agents.agents,
    activationCode: state.agents.activationCode,
    bankTerminal: state.agents.bankTerminal,
    loading: state.agents.loading,
    error: state.agents.error,
    success: state.agents.success,
    unassignSuccess: state.agents.unassignSuccess,
    successActivation: state.agents.successActivation,
    agentTotal: state.agents.agentTotal,
  };
};

export default connect(mapStateToProps, {
  FetchAgent,
  ActivatateCode,
  FetchBankTerminal,
  UnAssignTerminal,
  FetchHardWare,
})(Agents);
