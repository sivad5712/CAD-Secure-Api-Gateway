import React from 'react';

export default function Layout({ children, currentPage, setCurrentPage, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'gateway', label: 'API Gateway', icon: '⚡' },
    { id: 'projects', label: 'CAD Projects', icon: '📐' },
    { id: 'testing', label: 'API Testing', icon: '🧪' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'audit', label: 'Audit Logs', icon: '📜' }
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>⚙️ CADShield Gateway</span>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.id}>
              <a
                onClick={() => setCurrentPage(item.id)}
                className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button className="logout-btn" style={{ width: '100%' }} onClick={onLogout}>
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-title">
            <span>CADShield Secure Access Portal</span>
          </div>
          <div className="topbar-user">
            {user && (
              <div className="user-badge">
                👤 {user.name} 
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
            )}
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}
