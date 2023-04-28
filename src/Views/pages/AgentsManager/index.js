import React, { Component, useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import Plus from "../../../Assets/img/+.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateAgentModal from "./CreateAgent";
import FetchAgentsManager from "./fetchAgentsManager";
import Settlement from "./settlement";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";

import "./style.css";

const AgentsManager = () => {
  const [createModalActive, showCreateModal] = React.useState(false);
  const [active, showActive] = React.useState("home");
  const [ExportModalActive, showExportModal] = React.useState(false);
  const [FilterModalActive, showFilterModal] = React.useState(false);

  const initialState = {
    username: "",
    phone: "",
  };

  const [filterValues, setFilterValues] = useState(initialState);

  useEffect(() => {
    console.log(active);
    renderTab();
  }, [active]);

  const onclose = () => {
    showActive("home");
    showCreateModal(false);
  };
  const OpenFilter = () => {
    showFilterModal(true);
    setFilterValues(initialState);
  };

  const renderTab = () => (
    <Tabs
      defaultActiveKey={active}
      id="uncontrolled-tab-example"
      onSelect={(key) => {
        key == "profile" ? showCreateModal(true) : showActive("home");
      }}
    >
      <Tab eventKey={"home"} title="View Agent Manager">
        <FetchAgentsManager
          initialState={initialState}
          ExportModalActive={ExportModalActive}
          FilterModalActive={FilterModalActive}
          showExportModal={showExportModal}
          showFilterModal={showFilterModal}
          filterValues={filterValues}
          setFilterValues={setFilterValues}

        />
      </Tab>
      <Tab eventKey={"profile"} title="Create Agent Manager">
        <CreateAgentModal show={createModalActive} close={onclose} />
      </Tab>
      <Tab eventKey={"contact"} title="Settlement">
        <Settlement />
      </Tab>
    </Tabs>
  );

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>Agent Manager</h3>
        </div>

        <div className="agent-transact-header">
          <div>
            <div>
              <div>Manage all agents on mCashPoint</div>
            </div>
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

        {renderTab()}
      </div>
    </DashboardTemplate>
  );
};
export default AgentsManager;
