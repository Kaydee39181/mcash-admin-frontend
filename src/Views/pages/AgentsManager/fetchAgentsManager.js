import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import { NavLink } from "react-router-dom";
import { FetchAgentManager } from "../../../Redux/requests/agentManagerRequest";
import Loader from "../../../Components/secondLoader";
import DashboardTemplate from "../../template/dashboardtemplate";
import { connect } from "react-redux";
import ExportModal from "../../../Components/Exports/index";
//import FilterModal from "../../../Components/Filter/index";
import FilterModal from "../../../Components/AgentFilter/index";

import Pagination from "react-js-pagination";

import "./style.css";
import { DropdownButton, Dropdown } from "react-bootstrap";

const FetchAgentsManager = (props) => {
  const {
    FetchAgentManager: FetchAgentManagers,
    agentmanager,
    loading,
    showFilterModal,
    FilterModalActive,
    showExportModal,
    ExportModalActive,
    agentManagerTotal,
    initialState,
    filterValues,
    setFilterValues,
  } = props;
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  //const [filterValues, setFilterValues] = useState({});
  useEffect(() => {
    FetchAgentManagers(nextPage, length, filterValues);
  }, []);

  const closeExport = () => {
    showExportModal(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };
  function _handleFilterValue(event) {
    console.log(event);
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    showExportModal(false);
  }
  const onFilterSubmit = (event) => {
    console.log(filterValues);
    event.preventDefault();
    FetchAgentManagers(0, length, filterValues);
    showExportModal(false);
  };

  const _handlePageChange = (pageNumber) => {
    FetchAgentManagers(pageNumber - 1, length, filterValues);
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  function ViewAgent(agentId) {
    // setActivation(null);
    localStorage.setItem("viewagentId", agentId);
    window.location = "/getagents";
  }

  const handleSelect = (e) => {
    setLength(e);
  };

  const title = "AgentManager page";
  const headers = [
    [
      "Agent ID",
      "Name",
      "User Name",
      "Phone Number",
      "State",
      "LGA",
      "Date Created",
    ],
  ];

  const item = agentmanager.map((agent) => [
    agent.id,
    agent.name,
    agent.user.username,
    agent.phone,
    agent.state.stateName,
    agent.lga.lga,
    agent.createdAt,
  ]);

  const products = agentmanager.map((agent, index) => {
    //console.log(agent);
    return {
      id: index,
      Agent: agent,
      AgentID: agent.user.id === null ? "" : agent.user.id,
      Name: agent.user.fullName === null ? "" : agent.user.fullName,
      UserName: agent.user.username === null ? "" : agent.user.username,
      PhoneNumber: agent.phone === null ? "" : agent.phone,
      State: agent.state.stateName === null ? "" : agent.state.stateName,
      LGA: agent.lga.lga === null ? "" : agent.lga.lga,
      DateCreated: agent.createdAt === null ? "" : agent.createdAt,
    };
  });

  const columns = [
    // { dataField: 'id', text: 'Id'},
    {
      dataField: "AgentID",
      text: "Agent ID",
      formatter: (cellContent, row) => {
        console.log(row.Agent);
        return (
          <NavLink
            to={{
              pathname: `/agentmanagerprofile`,
              state: { row },
            }}
            className=" editadmin"
          >
            {row.AgentID}
          </NavLink>
        );
      },
    },
    {
      dataField: "Name",
      text: " Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "UserName",
      text: "User Name",
      style: {
        width: "20em",
        whiteSpace: "normal",
        wordWrap: "break-word",
        padding: "10px",
      },
      headerStyle: (colum, colIndex) => {
        return { width: "200px", textAlign: "center" };
      },
    },
    { dataField: "PhoneNumber", text: "Phone Number" },

    { dataField: "State", text: "State" },

    { dataField: "LGA", text: "LGA" },
    { dataField: "DateCreated", text: "Date Created" },
    {
      dataField: "transactionHistory",
      text: "View Agent",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => ViewAgent(row.Agent.id)}
              className="viewTransac"
            >
              Agents
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
    <div>
      {loading && (
        <Loader
          type="TailSpin"
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
          defaultSorted={defaultSorted}
          bordered={false}
          hover
          condensed
        />
      </div>
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
        </DropdownButton>
        <p>Showing 1 to 10 of {agentManagerTotal}</p>
        <div className="pagination">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={10}
            totalItemsCount={agentManagerTotal}
            pageRangeDisplayed={5}
            onChange={_handlePageChange}
          />
        </div>
      </div>
      <FilterModal
        type={"Agent Manager "}
        typetext={"Enter Agent Manager Type"}
        idtext={"Enter Agent Manager ID"}
        show={FilterModalActive}
        name={"agentmanager"}
        close={closeFilter}
        nextPage={nextPage}
        length={length}
        loadPage={FetchAgentManager}
        handleFilterValue={_handleFilterValue}
        submitFilter={onFilterSubmit}
      />
      <ExportModal
        show={ExportModalActive}
        close={closeExport}
        filename="AgentManager file"
        title={title}
        headers={headers}
        item={item}
        products={products}
        columns={columns}
      />
    </div>
  );
};
const mapStateToProps = (state) => (
  console.log(state),
  {
    agentmanager: state.agentmanager.agentmanager,
    loading: state.agentmanager.loading,
    error: state.agentmanager.error,
    agentManagerTotal: state.agentmanager.agentManagerTotal,
  }
);

export default connect(mapStateToProps, {
  FetchAgentManager,
})(FetchAgentsManager);
