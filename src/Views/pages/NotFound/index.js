import React from "react";
import { Link } from "react-router-dom";
import DashboardTemplate from "../../template/dashboardtemplate";
import { isLoggedIn } from "../../../utils/isLoggedIn";

const NotFound = () => {
  const content = (
    <div className="transact-wrapper">
      <div className="header-title">
        <h3>Page Not Found</h3>
      </div>
      <div className="agent-transact-header">
        <div>The page you requested does not exist or is no longer available.</div>
      </div>
      <div className="mt-4">
        <Link to={isLoggedIn() ? "/dashboard" : "/"}>Go back</Link>
      </div>
    </div>
  );

  return isLoggedIn() ? <DashboardTemplate>{content}</DashboardTemplate> : content;
};

export default NotFound;
