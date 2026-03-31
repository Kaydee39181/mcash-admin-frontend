import React from "react";
import "./style.css";
import Search from "../../Assets/img/search.png";
import Photo from "../../Assets/img/photo.png";
import Notification from "../../Assets/img/new.png";

export default function Header(props) {
  const token = JSON.parse(localStorage.getItem("data"));
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
          {/* <img src={Search} alt="" />
                // <img src={Notification} alt="" />*/}
          <span className="divider">|</span>
          <span>{token ? token.user.roleGroup.name : ""}</span>
          {/* <img src={Photo} alt="" /> */}
        </div>
      </div>
    </div>

  );
}
