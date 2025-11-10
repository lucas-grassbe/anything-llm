import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "@/App.jsx";
import "@/index.css";
import migrateAnythingToVibranix from "@/utils/localStorageMigrations";
const isDev = process.env.NODE_ENV !== "production";
const REACTWRAP = isDev ? React.Fragment : React.StrictMode;

ReactDOM.createRoot(document.getElementById("root")).render(
  <REACTWRAP>
    <Router>
      {/* run lightweight localStorage migration before mounting the app */}
      {typeof window !== "undefined" && migrateAnythingToVibranix()}
      <App />
    </Router>
  </REACTWRAP>
);
