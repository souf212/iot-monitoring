import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Cold Chain Monitoring</h2>
        </div>
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={isActive('/dashboard') ? 'active' : ''}
          >
            Tableau de bord
          </Link>
          <Link
            to="/tickets"
            className={isActive('/tickets') ? 'active' : ''}
          >
            Tickets
          </Link>
          <Link
            to="/historique"
            className={isActive('/historique') ? 'active' : ''}
          >
            Historique & Audit
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

