import React, { useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateAgentModal from "./CreateAgent";
// import FetchAgentsManager from "./fetchAgentsManager";
// import Settlement from "./settlement";

import "./style.css";
import FetchAgents from "./FetchAgents";

const AgentsWrapper = () => {
  const [createModalActive, showCreateModal] = React.useState(false);
  const [active, showActive] = React.useState("home");
  const [ExportModalActive, showExportModal] = React.useState(false);
  const [FilterModalActive, showFilterModal] = React.useState(false);
  
  const initialState = {
    startDate: "",
    endDate: "",
    username: "",
    businessName: "",
    phone: "",
    agentId: "",
  };
  const [filterValues, setFilterValues] = useState(initialState);

  // useEffect(() => {
  //   console.log(active);
  //   renderTab();
  // }, [active]);

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
        key === "profile" ? showCreateModal(true) : showActive("home");
      }}
    >
      <Tab eventKey={"home"} title="View Agents">
        <FetchAgents
          initialState={initialState}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          ExportModalActive={ExportModalActive}
          FilterModalActive={FilterModalActive}
          showExportModal={showExportModal}
          showFilterModal={showFilterModal}
        />
      </Tab>
      <Tab eventKey={"profile"} title="Create Agent ">
        <CreateAgentModal show={createModalActive} close={onclose} />
      </Tab>
      {/* <Tab eventKey={"contact"} title="Settlement">
        <Settlement />
      </Tab> */}
    </Tabs>
  );

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

            <span
              onClick={() =>OpenFilter()}
            >
              <img src={Filter} alt="Filter" />
              Filter
            </span>

            <span onClick={() => showExportModal(true)}>
              <img src={Upload} alt="Export" />
              Export
            </span>
          </div>
        </div>

        {renderTab()}
      </div>
    </DashboardTemplate>
  );
};
export default AgentsWrapper;
