import React from "react";
import "./style.css";
import ThemeToggle from "../ThemeToggle";

export default function Header(props) {
  const token = JSON.parse(localStorage.getItem("data"));
  const roleName = token ? token.user.roleGroup.name : "";

  return (
    <div className="container-fluid m-0">
      <div className="header-wrapper">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={props.onToggleSideNav}
          aria-label="Open navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header">
          <ThemeToggle />
          <span className="divider">|</span>
          <span className="header-role">{roleName}</span>
        </div>
      </div>
    </div>

  );
}
