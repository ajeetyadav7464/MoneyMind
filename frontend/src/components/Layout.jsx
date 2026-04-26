import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../hooks/useHealth';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { isSuccess: isServerUp } = useHealth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Atelier', icon: 'dashboard', path: '/dashboard' },
    { name: 'Insights', icon: 'analytics', path: '/insights' },
    { name: 'Vault', icon: 'account_balance_wallet', path: '/vault' },
    { name: 'Profile', icon: 'person', path: '/profile' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar
        user={user}
        isServerUp={isServerUp}
        onLogout={logout}
        navItems={navItems}
        currentPath={location.pathname}
      />

      {/* Main Content Area */}
      {children}

      <Footer />
    </div>
  );
}
