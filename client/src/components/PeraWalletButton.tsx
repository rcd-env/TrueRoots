import React, { useEffect, useRef, useState } from "react";
import { Wallet } from "lucide-react";
import { usePeraWallet } from "../wallet/usePeraWallet";

const PeraWalletButton: React.FC = () => {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    truncateAddress,
    error,
    clearError,
  } = usePeraWallet();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Auto clear feedback
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [feedback]);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setFeedback("Address copied");
    } catch {
      setFeedback("Copy failed");
    }
  };

  return (
    <div
      className="flex flex-col items-end space-y-2"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg shadow text-xs flex items-start space-x-2 w-60">
          <span className="flex-1 leading-snug">{error}</span>
          <button
            aria-label="Dismiss wallet error"
            onClick={clearError}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 px-3 py-1 rounded shadow text-xs">
          {feedback}
        </div>
      )}
      {!isConnected ? (
        <div style={{ pointerEvents: "auto" }}>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300/30 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
            style={{
              backgroundColor: "#059669",
              borderRadius: "20px",
              border: "none",
              minWidth: "180px",
              height: "56px",
              fontSize: "16px",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (!isConnecting) {
                e.currentTarget.style.backgroundColor = "#047857";
              }
            }}
            onMouseLeave={(e) => {
              if (!isConnecting) {
                e.currentTarget.style.backgroundColor = "#059669";
              }
            }}
          >
            <Wallet className="w-6 h-6" style={{ color: "#ffffff" }} />
            <span style={{ color: "#ffffff" }}>
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </span>
          </button>
        </div>
      ) : (
        <div
          className="relative"
          ref={menuRef}
          style={{ pointerEvents: "auto", zIndex: 10000 }}
        >
          <button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-200 focus:outline-none hover:shadow-md"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "2px solid #059669",
              minWidth: "200px",
              height: "56px",
              fontSize: "16px",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0fdf4";
              e.currentTarget.style.borderColor = "#047857";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#059669";
            }}
          >
            <Wallet className="w-5 h-5" style={{ color: "#059669" }} />
            <span className="font-semibold" style={{ color: "#000000" }}>
              {truncateAddress(address)}
            </span>
            <span
              className="px-2 py-1 text-xs font-medium uppercase"
              style={{
                backgroundColor: "transparent",
                color: "#059669",
                borderRadius: "6px",
              }}
            >
              Testnet
            </span>
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-6 w-80 overflow-hidden"
              style={{
                borderRadius: "16px",
              }}
            >
              <div
                className="px-6 py-4 text-center font-semibold text-white shadow-md"
                style={{
                  backgroundColor: "#0FA958",
                  borderRadius: "20px",
                  fontSize: "15px",
                  marginBottom: "16px",
                  boxShadow: "0 3px 10px rgba(15, 169, 88, 0.25)",
                }}
              >
                Connected Account
              </div>
              <div className="space-y-4">
                <button
                  role="menuitem"
                  onClick={handleCopy}
                  className="w-full px-6 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  style={{
                    backgroundColor: "#0FA958",
                    borderRadius: "16px",
                    fontSize: "15px",
                    boxShadow: "0 2px 8px rgba(15, 169, 88, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0D8A4A";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(15, 169, 88, 0.35)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0FA958";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 169, 88, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Copy Address
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    disconnect();
                    setOpen(false);
                    setFeedback("Disconnected");
                  }}
                  className="w-full px-6 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{
                    backgroundColor: "#EF4444",
                    borderRadius: "16px",
                    fontSize: "15px",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)",
                    marginTop: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#DC2626";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(239, 68, 68, 0.35)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#EF4444";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(239, 68, 68, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeraWalletButton;
