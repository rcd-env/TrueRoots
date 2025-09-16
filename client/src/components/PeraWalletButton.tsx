import React, { useEffect, useRef, useState } from "react";
import { Wallet } from "lucide-react";
import { usePeraWallet } from "../wallet/PeraWalletProvider";
import Button from "./ui/Button";

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
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-2">
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
        <Button
          onClick={connect}
          disabled={isConnecting}
          loading={isConnecting}
          variant="primary"
          size="md"
          className="shadow focus:ring-green-500 pl-3 pr-4"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </Button>
      ) : (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg bg-white border border-green-600/50 hover:border-green-600 shadow-sm hover:shadow transition text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="flex items-center gap-1">
              <Wallet className="w-4 h-4 text-green-600" />
              {truncateAddress(address)}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-semibold tracking-wide border border-green-200">
              TESTNET
            </span>
            <svg
              className={`h-4 w-4 text-gray-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.586l3.71-3.356a.75.75 0 111.04 1.08l-4.243 3.84a.75.75 0 01-1.04 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in"
            >
              <div className="px-3 py-2 border-b border-gray-100 text-[11px] uppercase tracking-wide text-gray-500 bg-gray-50">
                Wallet
              </div>
              <button
                role="menuitem"
                onClick={handleCopy}
                className="w-full flex justify-between items-center px-3 py-2 text-sm hover:bg-green-50 text-gray-700"
              >
                Copy Address
                <span className="text-[11px] text-gray-400">⌘C</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                  setFeedback("Disconnected");
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeraWalletButton;
