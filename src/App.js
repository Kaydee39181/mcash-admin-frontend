import React from "react";
import "./App.css";
import Routes from "./Routes";

const App = () => {
  console.log("BASE URL:", process.env.REACT_APP_BASE_URL);

  return <Routes />;
};

export default App;
