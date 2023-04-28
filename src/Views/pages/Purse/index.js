import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CentralPurse from "./centralPurse";
import AgentPurse from "./agentpurse";
import { FetchPurseBalance } from "../../../Redux/requests/agentPurseRequest";

import "./style.css";

const AgentsPurses = (props) => {
  const [key, showActive] = React.useState("centralPurse");

  const { FetchPurseBalance: FetchPurseBalances, centralPurseBalance } = props;
  const [createModalActive, showCreateModal] = React.useState(false);
  const [ExportModalActive, showExportModal] = React.useState(false);
  const [FilterModalActive, showFilterModal] = React.useState(false);
  const [ExportModalActive2, showExportModal2] = React.useState(false);
  const [FilterModalActive2, showFilterModal2] = React.useState(false);

  const initialState = {
    startDate: "",
    endDate: "",
    transactionId: "",
    transactionType: "",
  };
  const initialState2 = {
    agentName: "",
  };
  const [filterValues, setFilterValues] = React.useState(initialState);
  const [filterValues2, setFilterValues2] = React.useState(initialState2);

  useEffect(() => {
    FetchPurseBalances()
  }, []);

  //console.log(key)
  const onclose = () => {
    showActive("centralPurse");
    showCreateModal(false);
  };
  const OpenFilter = () => {
    console.log(key)
    if (key === "centralPurse") {
      showFilterModal(true);
      setFilterValues(initialState);

    } else {
      showFilterModal2(true);
      setFilterValues2(initialState2);
    }

  };
  const OpenModal = () => {
    if (key === "centralPurse") {
      showExportModal(true);

    } else {
      showExportModal2(true);
    }

  };
  const { totalAgentBalance, walletBalance } = centralPurseBalance

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>Purse</h3>
        </div>
        <div className="agent-transact-header">
          View all purse details on mCashPoint
        </div>
        <div className="Dashboard-overview-wrapper">
          <div className="flex-box p-1">
            <div className="person-background"></div>
            <div>
              <div>{totalAgentBalance && totalAgentBalance.toLocaleString()}</div>
              <div>Total Agent Balance </div>
            </div>
          </div>
          <div className="flex-box">
            <div className="mark-background"></div>
            <div>
              <div>{walletBalance && walletBalance.toLocaleString()}</div>
              <div>Wallet Balance</div>
            </div>
          </div>
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

            <span onClick={() => OpenModal()}>
              <img src={Upload} />
              Export
            </span>
          </div>
        </div>

        <Tabs defaultActiveKey={key} id="uncontrolled-tab-example" onSelect={(e) => { showActive(e) }}>
          <Tab eventKey={"centralPurse"} title="Central Purse" >
            <CentralPurse
              initialState={initialState}
              ExportModalActive={ExportModalActive}
              FilterModalActive={FilterModalActive}
              showExportModal={showExportModal}
              showFilterModal={showFilterModal}
              filterValues={filterValues}
              setFilterValues={setFilterValues} />
          </Tab>

          <Tab eventKey={"AgentPurse"} title="Agent Purse">
            <AgentPurse
              initialState={initialState2}
              ExportModalActives={ExportModalActive2}
              FilterModalActive={FilterModalActive2}
              showExportModals={showExportModal2}
              showFilterModals={showFilterModal2}
              filterValues={filterValues2}
              setFilterValues={setFilterValues2}

            />
          </Tab>
        </Tabs>
      </div>
    </DashboardTemplate>
  );
}; const mapStateToProps = (state) => (
  console.log(state),
  {
    loading: state.purse.loading,
    error: state.purse.error,
    centralPurseBalance: state.purse.centralPurseBalance,
  }
);

export default connect(mapStateToProps, { FetchPurseBalance })(AgentsPurses);
