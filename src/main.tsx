import "./index.css";
import "./app/print.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnalysisLockProvider } from "./features/analyses/AnalysisLockContext";
import { AuthProvider } from "./auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnalysisLockProvider>
          <App />
        </AnalysisLockProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);