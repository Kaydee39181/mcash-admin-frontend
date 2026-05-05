import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { isLoggedIn } from "../../utils/isLoggedIn";
import DashboardTemplate from "../../Views/template/dashboardtemplate";
import {
  getEffectiveRoleGroup,
  isVirtualAccountAccessRestricted,
  safeParseStoredAuth,
} from "../../utils/auth";

const AuthRequired = ({
  component: Component,
  role,
  roleCode,
  adminRequred,
  restrictVirtualAccount,
  ...rest
}) => {
  if (!isLoggedIn()) {
    return <Redirect to="/" />;
  }

  const token = safeParseStoredAuth();
  if (!token?.user?.roleGroup) return <Redirect to="/" />;

  const roleGroup = getEffectiveRoleGroup(token);
  const name = roleGroup.name;

  const roles = Array.isArray(roleGroup.role) ? roleGroup.role : [];

  if (adminRequred && name !== "ADMIN") {
    return <Redirect to="/" />;
  }

  if (restrictVirtualAccount && isVirtualAccountAccessRestricted(token)) {
    return (
      <DashboardTemplate>
        <h2>You do not have permissions to view this page</h2>
      </DashboardTemplate>
    );
  }

  if (!roles.some((role) => role.roleCode === roleCode)) {
    return (
      <DashboardTemplate>
        <h2>You do not have permissions to view this page</h2>
      </DashboardTemplate>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        <Component {...props} />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  role: state.users.role,
});

export default connect(mapStateToProps, {})(AuthRequired);
