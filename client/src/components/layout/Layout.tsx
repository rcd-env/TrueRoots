import PeraWalletButton from "../PeraWalletButton";

interface LayoutProps {
  children: React.ReactNode;
}

// Minimal layout; wallet button fixed in corner
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      <PeraWalletButton />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
