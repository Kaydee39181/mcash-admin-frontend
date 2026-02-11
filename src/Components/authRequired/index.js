import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { isLoggedIn } from "../../utils/isLoggedIn";
import DashboardTemplate from "../../Views/template/dashboardtemplate";

const safeGetToken = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const AuthRequired = ({
  component: Component,
  role,
  roleCode,
  adminRequred,
  ...rest
}) => {
  const token = safeGetToken();
  if (!token?.user?.roleGroup) return <Redirect to="/" />;

  const roleGroup = token.user.roleGroup;
  const name = roleGroup.name;

  if (name === "AMBASSADOR") {
    roleGroup.role = [{ roleCode: "ROLE_VIEW_ALL_AGENT" }];
  }
  if (name === "AGENT") {
    roleGroup.role = [
      { roleCode: "ROLE_VIEW_ALL_AGENT" },
      { roleCode: "ROLE_VIEW_ALL_TRANSACTION" },
    ];
  }

  const roles = Array.isArray(roleGroup.role) ? roleGroup.role : [];

  if (adminRequred && name !== "ADMIN") {
    return <Redirect to="/" />;
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
        isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  role: state.users.role,
});

export default connect(mapStateToProps, {})(AuthRequired);