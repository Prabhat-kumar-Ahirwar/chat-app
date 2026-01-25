import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";   // Tailwind / global styles
import "./App.css";     // ❗ ADD THIS BACK

import AppRoutes from "./config/Routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
   
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);
