import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard({ user }) {
  const [projectCount, setProjectCount] = useState(0);
  const [logCount, setLogCount] = useState(0);

  // Dynamic traffic state for interactive 3D bar chart
  const [traffic, setTraffic] = useState({
    rest: 1620,
    gql: 1210,
    soap: 840,
    fhir: 430
  });
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const projects = await api.getCadProjects();
        setProjectCount(projects.length);
      } catch (err) {
        console.error('Error fetching projects count:', err);
      }

      if (user && (user.role === 'ADMIN' || user.role === 'AUDITOR')) {
        try {
          const logs = await api.getAuditLogs();
          setLogCount(logs.length);
        } catch (err) {
          console.error('Error fetching audit logs count:', err);
        }
      }
    }
    fetchStats();
  }, [user]);

  const handleTrafficSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let iterations = 0;
    
    const interval = setInterval(() => {
      setTraffic({
        rest: Math.floor(Math.random() * 900) + 1100,
        gql: Math.floor(Math.random() * 700) + 800,
        soap: Math.floor(Math.random() * 500) + 500,
        fhir: Math.floor(Math.random() * 300) + 200
      });
      iterations++;

      if (iterations > 15) {
        clearInterval(interval);
        // Reset to original mock defaults
        setTraffic({
          rest: 1620,
          gql: 1210,
          soap: 840,
          fhir: 430
        });
        setIsSimulating(false);
      }
    }, 200);
  };

  const techCards = [
    { name: 'RESTful APIs', desc: 'Secure endpoints for CAD project CRUD actions.' },
    { name: 'GraphQL', desc: 'Single endpoint query and mutation router.' },
    { name: 'SOAP', desc: 'XML payload handling for drawing vault locks.' },
    { name: 'FHIR', desc: 'Compliant CADDesign subject representations.' },
    { name: 'OAuth 2.0', desc: 'Secure auth grant code simulation.' },
    { name: 'JWT', desc: 'Self-contained signed tokens containing role claims.' },
    { name: 'API Gateway', desc: 'Centralized route distribution and security enforcement.' },
    { name: 'Multi-Factor Authentication', desc: 'One-time passcode checks before session tokens.' },
    { name: 'JSON', desc: 'Standard schema structure for requests and responses.' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">CADShield Dashboard</h1>
        <p className="page-subtitle">Security Metrics and Integrated Architecture Stack</p>
      </div>

      {/* Stakeholder Info Banner */}
      <div className="explanation-box">
        <h4>📢 Executive Summary</h4>
        <p style={{ marginBottom: '8px' }}>
          This project demonstrates a <strong>Secure CAD Vault Architecture</strong>. In industrial settings, drawing files represent high-value intellectual property. Allowing draft clients (such as AutoCAD) or third parties to connect directly to storage databases is a critical risk.
        </p>
        <p>
          Instead, all systems talk to the <strong>API Gateway</strong>. The gateway enforces user identity verification (OAuth/MFA), signs their session scope (JWT), translates their request language (REST, GraphQL, SOAP, FHIR), and logs all activity for security compliance audits.
        </p>
      </div>

      {/* Futuristic Isometric 3D Bar Chart */}
      <div className="chart-3d-container">
        <div style={{ position: 'absolute', top: '16px', left: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
          📊 3D Visualizer: Gateway Traffic by Protocol
        </div>
        <div style={{ position: 'absolute', top: '16px', right: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn btn-sm" 
            onClick={handleTrafficSimulation} 
            disabled={isSimulating}
            style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: isSimulating ? 'var(--success)' : 'var(--primary)' }}
          >
            ⚡ {isSimulating ? 'Simulating Traffic...' : 'Simulate API Traffic'}
          </button>
        </div>

        <div className="chart-3d-scene">
          {/* Glowing floor grid */}
          <div className="chart-3d-floor"></div>

          {/* REST Bar */}
          <div className="bar-3d-group">
            <div className="bar-3d-value">{traffic.rest.toLocaleString()}</div>
            <div className="bar-3d" style={{ height: `${Math.min(220, traffic.rest / 10)}px` }}>
              <div className="bar-3d-face front"></div>
              <div className="bar-3d-face back"></div>
              <div className="bar-3d-face left"></div>
              <div className="bar-3d-face right"></div>
              <div className="bar-3d-face top"></div>
            </div>
            <div className="bar-3d-label">RESTful APIs</div>
          </div>

          {/* GraphQL Bar */}
          <div className="bar-3d-group">
            <div className="bar-3d-value">{traffic.gql.toLocaleString()}</div>
            <div className="bar-3d" style={{ height: `${Math.min(220, traffic.gql / 10)}px` }}>
              <div className="bar-3d-face front" style={{ background: 'linear-gradient(to top, #f59e0b, #fbbf24)' }}></div>
              <div className="bar-3d-face back" style={{ background: '#d97706' }}></div>
              <div className="bar-3d-face left" style={{ background: '#b45309' }}></div>
              <div className="bar-3d-face right" style={{ background: '#d97706' }}></div>
              <div className="bar-3d-face top" style={{ background: '#fde047', boxShadow: '0 0 20px rgba(253, 224, 71, 0.6)' }}></div>
            </div>
            <div className="bar-3d-label">GraphQL</div>
          </div>

          {/* SOAP Bar */}
          <div className="bar-3d-group">
            <div className="bar-3d-value">{traffic.soap.toLocaleString()}</div>
            <div className="bar-3d" style={{ height: `${Math.min(220, traffic.soap / 10)}px` }}>
              <div className="bar-3d-face front" style={{ background: 'linear-gradient(to top, #10b981, #34d399)' }}></div>
              <div className="bar-3d-face back" style={{ background: '#059669' }}></div>
              <div className="bar-3d-face left" style={{ background: '#047857' }}></div>
              <div className="bar-3d-face right" style={{ background: '#059669' }}></div>
              <div className="bar-3d-face top" style={{ background: '#6ee7b7', boxShadow: '0 0 20px rgba(110, 231, 183, 0.6)' }}></div>
            </div>
            <div className="bar-3d-label">SOAP (XML)</div>
          </div>

          {/* FHIR Bar */}
          <div className="bar-3d-group">
            <div className="bar-3d-value">{traffic.fhir.toLocaleString()}</div>
            <div className="bar-3d" style={{ height: `${Math.min(220, traffic.fhir / 10)}px` }}>
              <div className="bar-3d-face front" style={{ background: 'linear-gradient(to top, #8b5cf6, #a78bfa)' }}></div>
              <div className="bar-3d-face back" style={{ background: '#7c3aed' }}></div>
              <div className="bar-3d-face left" style={{ background: '#6d28d9' }}></div>
              <div className="bar-3d-face right" style={{ background: '#7c3aed' }}></div>
              <div className="bar-3d-face top" style={{ background: '#c4b5fd', boxShadow: '0 0 20px rgba(196, 181, 253, 0.6)' }}></div>
            </div>
            <div className="bar-3d-label">FHIR JSON</div>
          </div>
        </div>
      </div>

      {/* Stakeholder-friendly CSS Flow Diagram */}
      <div className="flow-diagram-container">
        <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: '600', textAlign: 'center', color: 'var(--text-main)' }}>
          🔄 Visual Security Pipeline: Client to CAD Vault
        </h3>
        <div className="flow-diagram">
          <div className="flow-node">
            <div className="flow-node-title">💻 Client Systems</div>
            <div className="flow-node-desc">
              Web Dashboards, Legacy XML Vaults, AutoCAD Plugins, External Auditors
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--primary)' }}>
              Speaks: REST, SOAP, GraphQL, FHIR
            </div>
          </div>

          <div className="flow-arrow">
            <span style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Request</span>
            <div className="flow-arrow-line"></div>
          </div>

          <div className="flow-node active">
            <div className="flow-node-title" style={{ color: 'var(--success)' }}>🛡️ Central Gateway</div>
            <div className="flow-node-desc" style={{ color: 'var(--text-main)' }}>
              1. Validates Identity<br />
              2. Evaluates JWT Roles<br />
              3. Records Audits
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--success)' }}>
              🔒 OAuth & MFA Active
            </div>
          </div>

          <div className="flow-arrow">
            <span style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Authorized</span>
            <div className="flow-arrow-line"></div>
          </div>

          <div className="flow-node">
            <div className="flow-node-title">📐 CAD vault</div>
            <div className="flow-node-desc">
              CAD Projects Archive, SOAP Drawing Locks, FHIR Design Registries
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--success)' }}>
              Safe Database Storage
            </div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Panels */}
      <h3 style={{ marginBottom: '14px', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>🛡️ Live Gateway Telemetry</h3>
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-header">Avg Response Latency</div>
          <div className="telemetry-body">
            <span className="telemetry-stat">24 ms</span>
            <div className="telemetry-graph-bar-container">
              <div className="telemetry-graph-bar" style={{ height: '12px' }}></div>
              <div className="telemetry-graph-bar" style={{ height: '24px' }}></div>
              <div className="telemetry-graph-bar" style={{ height: '8px' }}></div>
              <div className="telemetry-graph-bar" style={{ height: '16px' }}></div>
            </div>
          </div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-header">Gateway Success Rate</div>
          <div className="telemetry-body">
            <span className="telemetry-stat" style={{ color: 'var(--success)' }}>99.98%</span>
            <div className="telemetry-graph-bar-container">
              <div className="telemetry-graph-bar green" style={{ height: '28px' }}></div>
              <div className="telemetry-graph-bar green" style={{ height: '30px' }}></div>
              <div className="telemetry-graph-bar green" style={{ height: '28px' }}></div>
            </div>
          </div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-header">Active Security Sessions</div>
          <div className="telemetry-body">
            <span className="telemetry-stat" style={{ color: 'var(--primary)' }}>4 Active</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JWT HMAC-256</span>
          </div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-header">Audit Compliance</div>
          <div className="telemetry-body">
            <span className="telemetry-stat" style={{ color: 'var(--success)' }}>COMPLIANT</span>
            <span style={{ fontSize: '1.2rem' }}>📜</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <h3 style={{ marginBottom: '14px', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>📊 Database Statistics</h3>
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-label">Logged-In Profile</span>
          <span className="metric-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{user ? user.name : 'Unknown User'}</span>
          <span className="card-desc">
            Role: <span className={`role-badge ${user ? user.role.toLowerCase() : ''}`}>{user ? user.role : 'None'}</span>
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">CAD Projects</span>
          <span className="metric-value">{projectCount}</span>
          <span className="card-desc">Active drawings in vault</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Security Audit Logs</span>
          <span className="metric-value">
            {user && (user.role === 'ADMIN' || user.role === 'AUDITOR') ? logCount : '🔒 Restricted'}
          </span>
          <span className="card-desc">Logged security events</span>
        </div>
      </div>

      <h3 style={{ marginBottom: '14px', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>🧩 Tech Stack Components</h3>

      <div className="grid-3">
        {techCards.map((item, idx) => (
          <div className="card hoverable" key={idx}>
            <div className="card-title">
              <span>{item.name}</span>
              <span className="status-indicator">ACTIVE</span>
            </div>
            <p className="card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
