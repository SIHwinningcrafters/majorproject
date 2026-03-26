import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";   // ← this line MUST be here
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);