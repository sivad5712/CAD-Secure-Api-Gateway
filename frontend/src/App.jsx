import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApiGateway from './pages/ApiGateway';
import CadProjects from './pages/CadProjects';
import ApiTesting from './pages/ApiTesting';
import Security from './pages/Security';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [oauthAuthCode, setOauthAuthCode] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [appReady, setAppReady] = useState(false);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAuthCode = localStorage.getItem('oauthAuthCode');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedAuthCode) {
        setOauthAuthCode(storedAuthCode);
      }
    }
    setAppReady(true);
  }, []);

  const handleLoginSuccess = (loggedInUser, accessToken, authCode) => {
    setUser(loggedInUser);
    setToken(accessToken);
    setOauthAuthCode(authCode);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('oauthAuthCode');
    setUser(null);
    setToken('');
    setOauthAuthCode('');
    setCurrentPage('dashboard');
  };

  if (!appReady) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Booting Gateway Client...</div>;
  }

  // Render Login page if not authenticated
  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render routing based on activePage
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'gateway':
        return <ApiGateway />;
      case 'projects':
        return <CadProjects user={user} />;
      case 'testing':
        return <ApiTesting />;
      case 'security':
        return <Security user={user} token={token} oauthAuthCode={oauthAuthCode} />;
      case 'audit':
        return <AuditLogs user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      user={user}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
