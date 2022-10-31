import React, { Component, useEffect, useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
//import Plus from "../../../Assets/img/+.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateAgentModal from "./Gtb";
// import FetchAgentsManager from "./fetchAgentsManager";
// import Settlement from "./settlement";

import "./style.css";
import FetchAgents from "../Agents/FetchAgents";
import SelectBank from "./SelectBank";

const AccountOpening = () => {
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

  return (
    <DashboardTemplate>
      <SelectBank />
      {/* <Gtb /> */}
    </DashboardTemplate>
  );
};
export default AccountOpening;
