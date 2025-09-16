import { StrictMode } from "react";
import "./shims/global";
import { createRoot } from "react-dom/client";
import "./simple.css";
import App from "./App.tsx";
import { PeraWalletProvider } from "./wallet/PeraWalletProvider";
// Early debug log to confirm the bundle executed
console.log("[TrueRoots] main.tsx loaded, mounting React");
// Runtime fallback now handled in shims/global
import ErrorBoundary from "./components/ErrorBoundary";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("[TrueRoots] #root element not found");
}
createRoot(rootEl!).render(
  <StrictMode>
    <ErrorBoundary>
      <PeraWalletProvider>
        <div id="app-root-wrapper" style={{ minHeight: "100vh" }}>
          <App />
          {import.meta.env.DEV && (
            <div
              style={{
                position: "fixed",
                bottom: 4,
                right: 4,
                fontSize: 10,
                background: "#059669",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: 4,
                zIndex: 9999,
              }}
            >
              Rendered {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </PeraWalletProvider>
    </ErrorBoundary>
  </StrictMode>
);
