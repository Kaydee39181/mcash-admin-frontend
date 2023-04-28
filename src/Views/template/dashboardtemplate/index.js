import React, { Component } from "react";
import Header from "../../../Components/Header";
import SideNav from "../../../Components/SideNav";
import "./style.css";
import { createHashHistory } from "history";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

class DashboardTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSideNav: false,
    };
  }

  render() {
    return (
      <div className="dashboardTemplate-wrap">
        <div className="row-wrapper">
          <SideNav />
        </div>
        <div className="mainwrapper">
          <Header />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardTemplate);
