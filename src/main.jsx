import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CloudSyncControl from "./CloudSyncControl.jsx";
import { initializeCloudStorage } from "./cloudStorage.js";
import "./styles.css";

await initializeCloudStorage();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <CloudSyncControl />
  </React.StrictMode>,
);
