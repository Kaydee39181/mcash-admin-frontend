import React from "react";
import "./App.css";
import "./shared-action-effects.css";
import "./shared-forms.css";
import "./shared-responsive.css";
import "./shared-transaction-table.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Routes from "./Routes";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ThemeProvider } from "./theme";
import TransactionNotificationCenter from "./Components/TransactionNotificationCenter";

const App = () => {
  console.log("BASE URL:", process.env.REACT_APP_BASE_URL);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <TransactionNotificationCenter />
        <Routes />
        <ToastContainer
          containerId="transaction-alerts"
          position="top-right"
          autoClose={7000}
          newestOnTop
          pauseOnFocusLoss
          closeOnClick
        />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
