import React, { useCallback, useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Loader from "../../../Components/secondLoader";
import { DropdownButton, Dropdown } from "react-bootstrap";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import DashboardTemplate from "../../template/dashboardtemplate";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";


import {
  FetchambassadorAgent,
  FetchBankTerminal,
  buildAmbassadorAgentUrl,
} from "../../../Redux/requests/agentRequest";

import { connect } from "react-redux";
import "./style.css";
import Pagination from "react-js-pagination";
import { fetchAllPaginatedData } from "../../../utils/exportRequests";

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

const getAmbassadorAgentExportData = (agents = []) => {
  const safeAgents = Array.isArray(agents) ? agents : [];

  const item = safeAgents.map((agent) => [
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

  const products = safeAgents.map((agent, index) => ({
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
    DateCreated: agent.createdAt === null ? "" : agent.createdAt,
  }));

  return {
    item,
    products,
  };
};

const Agents = (props) => {
  const {
    FetchBankTerminal: FetchBankTerminals,
    FetchambassadorAgent: FetchambassadorAgents,
    agents,
    loading,
    agentTotal,
  } = props;
  const [ExportModalActive, showExportModal] = useState(false);
  const [downloadAllMode, setDownloadAllMode] = useState(false);
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

  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const closeExport = () => {
    showExportModal(false);
    setDownloadAllMode(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };

  useEffect(() => {
    FetchambassadorAgents(nextPage, length, filterValues);
    FetchBankTerminals();
  }, [FetchBankTerminals, FetchambassadorAgents, filterValues, length, nextPage]);

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

  const openCurrentExport = () => {
    setDownloadAllMode(false);
    showExportModal(true);
  };

  const openDownloadAll = () => {
    setDownloadAllMode(true);
    showExportModal(true);
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
  const headers = useMemo(
    () => [
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
    ],
    []
  );

  const { item, products } = useMemo(
    () => getAmbassadorAgentExportData(agents),
    [agents]
  );

  const noDataIndication = () => {
    if (loading) return "Loading agents...";
    return "No agents are available for the selected request. Try changing the filters.";
  };

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
    
   
    
    { dataField: "DateCreated", text: "Date Created" },
  ];
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  const requestAllAmbassadorAgentsExport = useCallback(async () => {
    const agentManagerId = localStorage.getItem("viewagentId");
    const { data } = await fetchAllPaginatedData({
      buildUrl: (pageNumber, chunkSize) =>
        buildAmbassadorAgentUrl(agentManagerId, pageNumber, chunkSize, filterValues),
    });

    return {
      ...getAmbassadorAgentExportData(data),
      title,
      headers,
      filename: "Agent file",
      filterValues,
    };
  }, [filterValues, headers, title]);

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
              <img src={Print} alt="Print" />
              Print
            </span>

            <span onClick={() => OpenFilter()}>
              <img src={Filter} alt="Filter" />
              Filter
            </span>

            <span onClick={openCurrentExport}>
              <img src={Upload} alt="Export" />
              Export
            </span>

            <span onClick={openDownloadAll}>
              <img src={Upload} alt="Download all" />
              Download all
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          {loading && (
            <Loader
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
            noDataIndication={noDataIndication}
            defaultSorted={defaultSorted}
            bordered={false}
            hover
            condensed
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
            filterValues={filterValues}
            requestExportData={
              downloadAllMode ? requestAllAmbassadorAgentsExport : undefined
            }
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    agents: state.agents.agents,
    loading: state.agents.loading,
    error: state.agents.error,
    agentTotal: state.agents.agentTotal,
  };
};

export default connect(mapStateToProps, {
  FetchambassadorAgent,
  FetchBankTerminal,
})(Agents);
