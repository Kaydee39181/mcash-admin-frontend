import React from "react";
import DashboardTemplate from "../../template/dashboardtemplate";

import "./style.css";
import SelectBank from "./SelectBank";

const AccountOpening = () => {
  return (
    <DashboardTemplate>
      <SelectBank />
      {/* <Gtb /> */}
    </DashboardTemplate>
  );
};
export default AccountOpening;
