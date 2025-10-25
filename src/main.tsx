import "./index.css";
import "./app/print.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnalysisLockProvider } from "./features/analyses/AnalysisLockContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalysisLockProvider>
        <App />
      </AnalysisLockProvider>
    </BrowserRouter>
  </React.StrictMode>
);
