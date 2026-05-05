import React from "react";
import "./style.css";
import ThemeToggle from "../ThemeToggle";
import { getDisplayRoleName } from "../../utils/roleLabel";
import { getEffectiveRoleName, safeParseStoredAuth } from "../../utils/auth";

export default function Header(props) {
  const token = safeParseStoredAuth();
  const roleName = getDisplayRoleName(getEffectiveRoleName(token));

  return (
    <div className="container-fluid m-0">
      <div className="header-wrapper">
        <div className="header-top-row">
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
        {props.headerContent ? (
          <div className="header-extra-content">{props.headerContent}</div>
        ) : null}
      </div>
    </div>

  );
}
