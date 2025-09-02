import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // For dropdown & collapse
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// ✅ Register service worker (optional, for PWA)
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("Service Worker registered:", registration);
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }
