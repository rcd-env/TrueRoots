import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PeraWalletConnect } from "@perawallet/connect";

// Basic address helpers
const truncate = (addr?: string | null) =>
  addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

interface WalletContextShape {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  truncateAddress: (a?: string | null) => string;
  error: string | null;
  clearError: () => void;
  connector: PeraWalletConnect | null;
}

const WalletContext = createContext<WalletContextShape | undefined>(undefined);

export const usePeraWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx)
    throw new Error("usePeraWallet must be used within PeraWalletProvider");
  return ctx;
};

// We create a single instance but lazily initialize (library handles internal WC session persistence)
const pera = new PeraWalletConnect();

export const PeraWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const accounts = await pera.connect();
      if (accounts && accounts.length > 0) setAddress(accounts[0]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to connect";
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await pera.disconnect();
    } finally {
      setAddress(null);
    }
  }, []);

  // Auto reconnect on mount if session exists
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const accts = await pera.reconnectSession();
        if (!cancelled && accts.length > 0) setAddress(accts[0]);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for underlying disconnect events (mobile)
  useEffect(() => {
    // underlying WalletConnect v1 object exposed at pera.connector after a session
    const wc: any = (pera as unknown as { connector?: unknown }).connector; // library type does not export internal WC type
    if (!wc || typeof wc !== "object") return;
    const maybeOn = (wc as any).on?.bind(wc);
    const maybeOff = (wc as any).off?.bind(wc);
    const handler = () => setAddress(null);
    if (maybeOn) maybeOn("disconnect", handler);
    return () => {
      if (maybeOff) maybeOff("disconnect", handler);
    };
  }, [address]);

  const value: WalletContextShape = useMemo(
    () => ({
      address,
      isConnected: !!address,
      isConnecting,
      connect,
      disconnect,
      truncateAddress: truncate,
      error,
      clearError: () => setError(null),
      connector: pera,
    }),
    [address, isConnecting, connect, disconnect, error]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
