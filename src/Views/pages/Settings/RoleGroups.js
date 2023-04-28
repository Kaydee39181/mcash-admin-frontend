import React, { Component, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Button } from "react-bootstrap";
import RoleModal from "./RoleModal";
import UpdateModal from "./updateRole";

import "./style.css";
import { connect } from "react-redux";

import { FetchRoleGroup } from "../../../Redux/requests/settingsRequest";

const RoleGroups = ({ FetchRoleGroup: FetchRoleGroups, roleGroups }) => {
  const [createModalActive, showCreateModal] = React.useState(false);
  const [EditModal, showEditModal] = React.useState(false);
  const [udatedetails, Setudatedetails] = React.useState([]);

  const [active, showActive] = React.useState("home");

  useEffect(() => {
    FetchRoleGroups();
  }, []);
  console.log(roleGroups);
  useEffect(() => {
    console.log(active);
  }, [active]);

  const onclose = () => {
    showCreateModal(false);
  };
  const oncloses = () => {
    showEditModal(false);
    window.location.reload();
  };

  const onOpenUdateRoles = (details) => {
    console.log(details);
    showEditModal(true);
    Setudatedetails(details);
  };

  return (
    <div>
      <Button className="role" onClick={() => showCreateModal(true)}>
        Create Role Group
      </Button>

      <RoleModal show={createModalActive} close={onclose} />
      <UpdateModal
        show={EditModal}
        close={oncloses}
        udatedetails={udatedetails}
      />

      <div className="Role-overview-wrapper">
        {roleGroups.map((role, index) => {
          return (
            <div className="role-box " onClick={() => onOpenUdateRoles(role)}>
              <div>
                <div>
                  <h5>{role.id}</h5>
                </div>
                <div>{role.name} </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    roleGroups: state.settings.roleGroups,
    loading: state.settings.loading,
    error: state.settings.error,
    success: state.settings.successRoleGroup,
    erroMessage: state.settings.errorMessage,
  }
);

export default connect(mapStateToProps, {
  FetchRoleGroup,
})(RoleGroups);
