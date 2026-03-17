import React from "react";
import "./App.css";
import Routes from "./Routes";
import ErrorBoundary from "./Components/ErrorBoundary";

const App = () => {
  console.log("BASE URL:", process.env.REACT_APP_BASE_URL);

  return (
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  );
};

export default App;
