// main.jsx
// ------------------------------------------------------
// Application entry point.
// ------------------------------------------------------

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { RoomProvider } from "./context/RoomContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RoomProvider>
      <App />
    </RoomProvider>
  </StrictMode>,
);
