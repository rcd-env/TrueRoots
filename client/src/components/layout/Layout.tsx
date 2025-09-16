import PeraWalletButton from "../PeraWalletButton";
import { usePeraWallet } from "../../wallet/PeraWalletProvider";

interface LayoutProps {
  children: React.ReactNode;
}

// Minimal layout; wallet button fixed in corner
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { address, isConnecting } = usePeraWallet();
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      <PeraWalletButton />
      {import.meta.env.DEV && (
        <div className="fixed bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded shadow">
          {isConnecting
            ? "Connecting..."
            : address
            ? `Connected: ${address.slice(0, 6)}…`
            : "No wallet"}
        </div>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
