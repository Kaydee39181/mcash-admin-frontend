import React, { Component } from "react";
import Header from "../../../Components/Header";
import SideNav from "../../../Components/SideNav";
import "./style.css";
import { withRouter } from "react-router-dom";

class DashboardTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSideNav: false,
    };
  }

  openSideNav = () => {
    this.setState({ showSideNav: true });
  };

  closeSideNav = () => {
    this.setState({ showSideNav: false });
  };

  render() {
    return (
      <div className="dashboardTemplate-wrap">
        <div className="row-wrapper">
          <SideNav
            open={this.state.showSideNav}
            onClose={this.closeSideNav}
            onNavigate={this.closeSideNav}
          />
        </div>
        <div className="mainwrapper">
          <Header
            onToggleSideNav={this.openSideNav}
            headerContent={this.props.headerContent}
          />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardTemplate);
