import React from "react";
import "./App.css";
import "./shared-action-effects.css";
import "./shared-responsive.css";
import "./shared-transaction-table.css";
import Routes from "./Routes";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ThemeProvider } from "./theme";

const App = () => {
  console.log("BASE URL:", process.env.REACT_APP_BASE_URL);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
