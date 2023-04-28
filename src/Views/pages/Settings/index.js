import React, { Component } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Tab from "react-bootstrap/Tab";
import { Container, Row, Col, Nav, Form, Button } from "react-bootstrap";
import DashboardTemplate from "../../template/dashboardtemplate";
import Profile from "../../../Assets/img/settingsuser.png";
import Password from "../../../Assets/img/settingslocked.png";
import Role from "../../../Assets/img/settingusers.png";
import Notifications from "../../../Assets/img/settingnotifications.png";
import ProfileSettings from "./Profile";
import NotificationSettings from "./Notification";
import ChangePassword from "./changePassword";

import "./style.css";
import RoleGroups from "./RoleGroups";
import CreatePin from "./CreatePin";
import ResetPIN from "./ResetPIN";

const Settings = () => {
  const [key, setKey] = React.useState("first");
  const token = JSON.parse(localStorage.getItem("data"));

  const { name } = token.user.roleGroup;

  const isVisibleToUser = (roleCode, user) =>
    user.roleGroup.role.some((role) => role.roleCode === roleCode);

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        <h2 className="settings-header">Settings</h2>
        <p className="settings-text">Set controls on mCashPoint</p>

        <div className="tabs-wrap">
          <Tab.Container id="left-tabs-example" defaultActiveKey={key}>
            <Row>
              <Col sm={3} className="side-tab">
                <Nav variant="pills" className="flex-column">
                  {name == "ADMIN" ||
                  name == "Senior Management " ||
                  name == "Product" ? (
                    <Nav.Item>
                      <Nav.Link eventKey="first">
                        <div className="tab-navs">
                          <div>
                            <img src={Profile} />
                          </div>
                          <div>
                            <p>Profile</p>
                            <p>Personal information</p>
                          </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  ) : (
                    ""
                  )}

                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      <div className="tab-navs">
                        <div>
                          <img src={Password} />
                        </div>
                        <div>
                          <p>Password</p>
                          <p>Change password</p>
                        </div>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  {isVisibleToUser("ROLE_CREATE_ROLEGROUP", token.user) && (
                    <Nav.Item>
                      <Nav.Link eventKey="third">
                        <div className="tab-navs">
                          <div>
                            <img src={Role} />
                          </div>
                          <div>
                            <p>Role Groups</p>
                            <p>View and create user roles</p>
                          </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  )}

                  {name === "AGENT" && (
                    <Nav.Item>
                      <Nav.Link eventKey="fifth">
                        <div className="tab-navs">
                          <div>
                            <img src={Password} alt="create-pin" />
                          </div>
                          <div>
                            <p>Create Pin</p>
                          </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {name === "AGENT" && (
                    <Nav.Item>
                      <Nav.Link eventKey="sixth">
                        <div className="tab-navs">
                          <div>
                            <img src={Password} alt="reset-pin" />
                          </div>
                          <div>
                            <p>Reset Pin</p>
                          </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {name == "ADMIN" ||
                  name == "Senior Management " ||
                  name == "Product" ? (
                    <Nav.Item>
                      <Nav.Link eventKey="fourth">
                        <div className="tab-navs">
                          <div>
                            <img src={Notifications} />
                          </div>
                          <div>
                            <p>Notifications</p>
                            <p>Notification preferences </p>
                          </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  ) : (
                    ""
                  )}
                </Nav>
              </Col>
              <Col sm={6}>
                <Tab.Content>
                  {name == "ADMIN" ||
                  name == "Senior Management " ||
                  name == "Product" ? (
                    <Tab.Pane eventKey="first">
                      <ProfileSettings></ProfileSettings>
                    </Tab.Pane>
                  ) : (
                    ""
                  )}
                  <Tab.Pane eventKey="second">
                    <ChangePassword></ChangePassword>
                  </Tab.Pane>
                  {isVisibleToUser("ROLE_CREATE_ROLEGROUP", token.user) && (
                    <Tab.Pane eventKey="third">
                      <RoleGroups></RoleGroups>
                    </Tab.Pane>
                  )}
                  {name == "ADMIN" ||
                  name == "Senior Management " ||
                  name == "Product" ? (
                    <Tab.Pane eventKey="fourth">
                      <NotificationSettings></NotificationSettings>
                    </Tab.Pane>
                  ) : (
                    ""
                  )}

                  {name === "AGENT" && (
                    <Tab.Pane eventKey="fifth">
                      <CreatePin></CreatePin>
                    </Tab.Pane>
                  )}
                  {name === "AGENT" && (
                    <Tab.Pane eventKey="sixth">
                      <ResetPIN></ResetPIN>
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </DashboardTemplate>
  );
};
export default Settings;
