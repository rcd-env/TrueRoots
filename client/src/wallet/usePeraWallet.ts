import { useContext } from "react";
import { WalletContext } from "./PeraWalletProvider";

export const usePeraWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx)
    throw new Error("usePeraWallet must be used within PeraWalletProvider");
  return ctx;
};
