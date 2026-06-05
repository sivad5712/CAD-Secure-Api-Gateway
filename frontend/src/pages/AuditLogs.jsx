import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AuditLogs({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthorized = user && (user.role === 'ADMIN' || user.role === 'AUDITOR');

  useEffect(() => {
    async function loadLogs() {
      if (!isAuthorized) {
        setError('Forbidden. You do not have access to this resource.');
        setLoading(false);
        return;
      }

      try {
        const data = await api.getAuditLogs();
        // Sort logs in reverse chronological order (newest first)
        const sortedData = [...data].reverse();
        setLogs(sortedData);
      } catch (err) {
        setError(err.message || 'Failed to retrieve security audit logs');
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [user, isAuthorized]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' UTC';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Security Audit Trail</h1>
        <p className="page-subtitle">Inspect network-level events, authentication attempts, API accesses, and gateway actions</p>
      </div>

      {!isAuthorized ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔒</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '8px' }}>
            Access Denied
          </h2>
          <p className="card-desc" style={{ maxWidth: '400px', margin: '0 auto' }}>
            Audit log records are restricted. Your role (<strong>{user ? user.role : 'none'}</strong>) does not have access privileges. Please contact the gateway administrator.
          </p>
        </div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '24px' }}>Loading audit database logs...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event Type</th>
                  <th>User Email</th>
                  <th>Protocol</th>
                  <th>Gateway Endpoint</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td><span className="code-text">{log.id}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      <span style={{ color: log.status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)' }}>
                        {log.eventType}
                      </span>
                    </td>
                    <td>{log.userEmail}</td>
                    <td><span className="tech-tag">{log.apiType}</span></td>
                    <td><span className="code-text" style={{ color: 'var(--text-main)' }}>{log.endpoint}</span></td>
                    <td>
                      <span className="status-indicator" style={{ color: log.status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)' }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(log.timestamp)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
