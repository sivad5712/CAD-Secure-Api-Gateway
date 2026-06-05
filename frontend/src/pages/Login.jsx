import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('engineer@cadshield.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // MFA Flow State
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaSessionId, setMfaSessionId] = useState('');
  const [oauthAuthCode, setOauthAuthCode] = useState('');
  const [demoMfaCode, setDemoMfaCode] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.login(username, password);
      if (response.mfaRequired) {
        setMfaRequired(true);
        setMfaSessionId(response.mfaSessionId);
        setOauthAuthCode(response.oauthAuthorizationCode);
        setDemoMfaCode(response.demoMfaCode);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.verifyMfa(mfaSessionId, mfaCode);
      // Store token and call callback
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('oauthAuthCode', oauthAuthCode);
      onLoginSuccess(response.user, response.accessToken, oauthAuthCode);
    } catch (err) {
      setError(err.message || 'MFA code verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h1 className="login-title">CADShield Gateway</h1>
        <p className="login-subtitle">Secure Engineering API Access Control</p>

        {error && <div className="error-banner">{error}</div>}

        {!mfaRequired ? (
          /* Step 1: Username & Password */
          <form onSubmit={handleCredentialsSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username (Email)</label>
              <input
                id="username"
                type="email"
                className="form-control"
                placeholder="engineer@cadshield.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Authorizing...' : 'Log In (OAuth 2.0)'}
            </button>
          </form>
        ) : (
          /* Step 2: Multi-Factor Authentication */
          <form onSubmit={handleMfaSubmit}>
            <div className="mfa-info-box">
              <div className="mfa-info-title">OAuth 2.0 & MFA Sandbox</div>
              <div className="mfa-info-text">
                Authorization Code: <span className="code-text">{oauthAuthCode}</span>
              </div>
              <div className="mfa-info-text">
                Demo MFA Verification Code: <span className="mfa-code-highlight">{demoMfaCode}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mfaCode">Enter 6-Digit MFA Code</label>
              <input
                id="mfaCode"
                type="text"
                maxLength="6"
                className="form-control"
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                required
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.2em' }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify MFA & Generate JWT'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => {
                setMfaRequired(false);
                setError('');
              }}
            >
              Back to Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
