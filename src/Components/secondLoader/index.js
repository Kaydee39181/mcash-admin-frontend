import React from "react";
import Loader from "react-loader-spinner";
import "./style.css";

export default function LoaderComponent(props) {
  return (
    <div className="main_loader">
      <div className="overlay" />
      <div className="content">
        <Loader
          type={props.type}
          color={props.color}
          height={props.height}
          width={props.width}
        />
      </div>
    </div>
  );
}
