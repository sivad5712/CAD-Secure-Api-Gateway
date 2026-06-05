const BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin + '/_/backend');

function getHeaders(contentType = 'application/json') {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async verifyMfa(mfaSessionId, mfaCode) {
    const res = await fetch(`${BASE_URL}/api/auth/verify-mfa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaSessionId, mfaCode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'MFA verification failed');
    return data;
  },

  // Gateway Routes
  async getGatewayRoutes() {
    const res = await fetch(`${BASE_URL}/api/gateway/routes`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch gateway routes');
    return data;
  },

  // REST CAD Projects
  async getCadProjects(customHeaders = null) {
    const res = await fetch(`${BASE_URL}/api/cad-projects`, {
      method: 'GET',
      headers: customHeaders || getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || 'Failed to fetch CAD projects');
      err.status = res.status;
      throw err;
    }
    return data;
  },

  async getCadProjectById(id) {
    const res = await fetch(`${BASE_URL}/api/cad-projects/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch project details');
    return data;
  },

  async createCadProject(name, drawingFile, status, classification, owner) {
    const res = await fetch(`${BASE_URL}/api/cad-projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, drawingFile, status, classification, owner })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create CAD project');
    return data;
  },

  // GraphQL Client
  async runGraphQLQuery(query, variables = {}) {
    const res = await fetch(`${BASE_URL}/graphql`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, variables })
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data.errors && data.errors[0].message) || 'GraphQL query failed');
    return data;
  },

  // SOAP Client
  async sendSOAPRequest(xmlString) {
    const res = await fetch(`${BASE_URL}/soap/cad-vault`, {
      method: 'POST',
      headers: getHeaders('text/xml'),
      body: xmlString
    });
    const text = await res.text();
    if (!res.ok) {
      // It might return a SOAP XML Fault response, which we want to show, so we return the text anyway
      return text;
    }
    return text;
  },

  // FHIR CAD Designs
  async getFhirDesigns() {
    const res = await fetch(`${BASE_URL}/api/fhir/cad-designs`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch FHIR designs');
    return data;
  },

  // Audit Logs
  async getAuditLogs() {
    const res = await fetch(`${BASE_URL}/api/audit-logs`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch audit logs');
    return data;
  }
};
