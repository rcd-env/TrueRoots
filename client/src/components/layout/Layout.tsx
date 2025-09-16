
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
