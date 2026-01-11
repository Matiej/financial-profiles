import "./index.css";
import "./app/print.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnalysisLockProvider } from "./features/analyses/AnalysisLockContext";
import { AuthProvider } from "./auth/AuthProvider";
import { ToastProvider } from "./ui/Toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AnalysisLockProvider>
            <App />
          </AnalysisLockProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);