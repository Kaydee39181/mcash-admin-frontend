import React, { useEffect, useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Print from "../../../Assets/img/printer.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateAgentModal from "./createAdmin";
import FetchAgentsManager from "./allAdmin";

import "./style.css";

const AdminUsers = (props) => {
    console.log(props)
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
  }, [active, renderTab]);

  const onclose = () => {
    showActive("home");
    showCreateModal(false);
  };

  const renderTab = () => (
    <Tabs
      defaultActiveKey={active}
      id="uncontrolled-tab-example"
      onSelect={(key) => {
        key === "profile" ? showCreateModal(true) : showActive("home");
      }}
    >
      <Tab eventKey={"home"} title="View All Admin's">
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
      <Tab eventKey={"profile"} title="Create Admin's">
        <CreateAgentModal show={createModalActive} close={onclose} />
      </Tab>
      
    </Tabs>
  );

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>Admin</h3>
        </div>

        <div className="agent-transact-header">
          <div>
            <div>
              <div>Manage all admin users on mCashPoint</div>
            </div>
          </div>
          <div className="manage-agent">
            <span>
              <img src={Print} alt="Print" />
              Print
            </span>

            {/* <span onClick={() => OpenFilter()}>
              <img src={Filter} />
              Filter
            </span> */}

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
export default AdminUsers;
