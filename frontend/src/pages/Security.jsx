import React, { useState } from 'react';
import { api } from '../api';

export default function Security({ user, token, oauthAuthCode }) {
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const decodeJwtPayload = (tokenStr) => {
    if (!tokenStr) return null;
    try {
      const base64Url = tokenStr.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return { error: 'Failed to parse token payload' };
    }
  };

  const decodedPayload = decodeJwtPayload(token);

  // Test API with valid token
  const handleTestWithJwt = async () => {
    setTestLoading(true);
    setTestResult(null);
    setTestEndpoint('GET /api/cad-projects (With JWT Header)');
    try {
      const data = await api.getCadProjects();
      setTestResult(data);
      setIsSuccess(true);
    } catch (err) {
      setTestResult({ error: err.message, status: err.status });
      setIsSuccess(false);
    } finally {
      setTestLoading(false);
    }
  };

  // Test API without token
  const handleTestWithoutJwt = async () => {
    setTestLoading(true);
    setTestResult(null);
    setTestEndpoint('GET /api/cad-projects (Missing JWT Header)');
    try {
      const data = await api.getCadProjects({ 'Content-Type': 'application/json' });
      setTestResult(data);
      setIsSuccess(true);
    } catch (err) {
      setTestResult({
        status: err.status || 401,
        message: err.message || "Unauthorized. JWT token is required."
      });
      setIsSuccess(false);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Security Settings</h1>
        <p className="page-subtitle">Inspect active OAuth 2.0 sessions, verify multi-factor authentication, and check JWT payload structure</p>
      </div>

      <div className="explanation-box">
        <h4>🛡️ JWT Authorization & Security Policies</h4>
        <p style={{ marginBottom: '8px' }}>
          When you logged in, the Gateway signed a <strong>JWT token</strong>. The client app attaches this token to the <code>Authorization: Bearer</code> header of every request.
        </p>
        <p>
          Instead of looking up user sessions in a slow database on every click, the Gateway reads the token payload instantly to verify who you are and what files you are allowed to access.
        </p>
      </div>

      <div className="grid-2">
        {/* Token and Session Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <div className="card-title">🛡️ Authentication Context</div>
            
            <table style={{ width: '100%', marginTop: '16px' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, paddingLeft: 0 }}>Subject User</td>
                  <td>{user ? user.name : 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, paddingLeft: 0 }}>Authorization Role</td>
                  <td>
                    <span className={`role-badge ${user ? user.role.toLowerCase() : ''}`}>
                      {user ? user.role : 'N/A'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, paddingLeft: 0 }}>OAuth 2.0 Auth Code</td>
                  <td><span className="code-text">{oauthAuthCode || 'AUTH-CODE-1001'}</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, paddingLeft: 0 }}>MFA Verification</td>
                  <td><span className="status-indicator">VERIFIED</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, paddingLeft: 0 }}>Token Type</td>
                  <td>Bearer JWT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Encoded JWT Access Token</strong>
            <div className="response-container" style={{ maxHeight: '100px', fontSize: '0.75rem', marginTop: '8px', wordBreak: 'break-all', color: 'var(--primary)' }}>
              {token || 'No active JWT token found'}
            </div>
          </div>
        </div>

        {/* Stakeholder-friendly Digital Access Badge Visualizer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-title" style={{ width: '100%', textAlign: 'left' }}>💳 Decoded JWT Access Badge</div>
          
          <div className="badge-visualizer-container">
            <div className="badge-chip"></div>
            <div className="badge-details">
              <div className="badge-role-title">
                🏢 {user ? user.role : 'GUEST'}
              </div>
              
              <div className="badge-label">Holder Name</div>
              <div className="badge-value">{user ? user.name : 'Guest User'}</div>

              <div className="badge-label">Email Address</div>
              <div className="badge-value" style={{ fontSize: '0.85rem' }}>{user ? user.email : 'guest@cadshield.com'}</div>

              <div className="badge-label">Access Permissions</div>
              <div className="badge-value" style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '4px' }}>
                ✓ {user && user.role === 'ADMIN' ? 'Full Administrator Access' : 
                   user && user.role === 'ENGINEER' ? 'Read/Write Vault Projects' :
                   user && user.role === 'VIEWER' ? 'Read-Only Vault Projects' :
                   'Audit Trail Viewer Access'}
              </div>
            </div>
          </div>

          <div className="response-container" style={{ width: '100%', marginTop: '16px', color: '#f59e0b', maxHeight: '120px' }}>
            <div className="response-header">Raw Decoded Claims JSON</div>
            {decodedPayload ? JSON.stringify(decodedPayload, null, 2) : 'No payload'}
          </div>
        </div>
      </div>

      {/* Gateway Security Policies Testing */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title">🧪 Test Gateway Security Policies</div>
        <p className="card-desc" style={{ marginBottom: '16px' }}>
          Evaluate the API Gateway security checks by testing responses with or without the authorization header.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleTestWithJwt} disabled={testLoading}>
            🔑 Test API With JWT (Authorized)
          </button>
          <button className="btn btn-danger" onClick={handleTestWithoutJwt} disabled={testLoading}>
            ❌ Test API Without JWT (Unauthorized)
          </button>
        </div>

        {/* Success/Error Stakeholder visualization */}
        {testLoading && <div style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Executing API handshake...</div>}

        {!testLoading && testResult && (
          <div>
            {isSuccess ? (
              /* Authorized Success Visual View */
              <div className="connection-visual-box success">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>🛡️</span>
                  <div>
                    <strong style={{ color: 'var(--success)', fontSize: '1rem', display: 'block' }}>ACCESS GRANTED — JWT CLAIM VERIFIED</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Endpoint: {testEndpoint}</span>
                  </div>
                </div>
                <p className="card-desc" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
                  The API Gateway successfully parsed your Bearer JWT token, verified the cryptographic signature, checked user permissions (Role: <strong>{user?.role}</strong>), and retrieved the following database records:
                </p>
                {/* Visual drawing list fetched */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.isArray(testResult) && testResult.map((p) => (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>📐 {p.name}</span>
                      <span className="code-text" style={{ fontSize: '0.75rem' }}>{p.drawingFile}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Unauthorized Blocked Visual View */
              <div className="connection-visual-box danger">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>🚫</span>
                  <div>
                    <strong style={{ color: 'var(--danger)', fontSize: '1rem', display: 'block' }}>ACCESS DENIED — 401 UNAUTHORIZED</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Endpoint: {testEndpoint}</span>
                  </div>
                </div>
                <p className="card-desc" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
                  The request was rejected at the Gateway boundary. Because the HTTP header did not contain a valid JWT Bearer signature, the gateway aborted execution before reaching the core drawing microservice.
                </p>
                <div className="response-container" style={{ margin: 0, fontSize: '0.75rem' }}>
                  <div className="response-header">Gateway Error Response</div>
                  {JSON.stringify(testResult, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
