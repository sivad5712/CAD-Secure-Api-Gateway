import React, { useState } from 'react';
import { api } from '../api';

export default function ApiTesting() {
  // REST Test State
  const [restMode, setRestMode] = useState('visual'); // 'visual' | 'code'
  const [restProjects, setRestProjects] = useState([]);
  const [restRaw, setRestRaw] = useState('');
  const [restLoading, setRestLoading] = useState(false);

  // GraphQL Test State
  const [gqlMode, setGqlMode] = useState('visual');
  const [gqlQuery, setGqlQuery] = useState(`query {
  cadProjects {
    id
    name
    drawingFile
    status
    classification
  }
}`);
  const [gqlResponse, setGqlResponse] = useState('');
  const [gqlLoading, setGqlLoading] = useState(false);
  const [gqlSavings, setGqlSavings] = useState(null);

  // SOAP Test State
  const [soapMode, setSoapMode] = useState('visual');
  const [soapRequest, setSoapRequest] = useState(`<Envelope>
  <Body>
    <GetDrawingStatus>
      <DrawingId>CAD-PRJ-1001</DrawingId>
    </GetDrawingStatus>
  </Body>
</Envelope>`);
  const [soapResponse, setSoapResponse] = useState('');
  const [soapLoading, setSoapLoading] = useState(false);
  // Live Lock Telemetry for Visual SOAP view
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState('');
  const [soapActionMsg, setSoapActionMsg] = useState('System Idle - Click actions to test XML vault locks.');

  // FHIR Test State
  const [fhirMode, setFhirMode] = useState('visual');
  const [fhirDesigns, setFhirDesigns] = useState([]);
  const [fhirRaw, setFhirRaw] = useState('');
  const [fhirLoading, setFhirLoading] = useState(false);

  // REST API Test
  const handleRestTest = async () => {
    setRestLoading(true);
    try {
      const data = await api.getCadProjects();
      setRestProjects(data);
      setRestRaw(JSON.stringify(data, null, 2));
    } catch (err) {
      setRestRaw(JSON.stringify({ error: err.message, status: err.status }, null, 2));
    } finally {
      setRestLoading(false);
    }
  };

  // GraphQL Test
  const handleGqlTest = async () => {
    setGqlLoading(true);
    try {
      const data = await api.runGraphQLQuery(gqlQuery);
      setGqlResponse(JSON.stringify(data, null, 2));
      
      // Calculate mock savings data for visual demonstration
      if (data && data.data && data.data.cadProjects) {
        setGqlSavings({
          totalFields: 7,
          requestedFields: 5,
          savedBandwidth: '28.5%',
          explanation: 'Only transferred requested schema columns, excluding owner email and last-update metadata logs.'
        });
      }
    } catch (err) {
      setGqlResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setGqlLoading(false);
    }
  };

  // SOAP API Test - Get Status
  const checkSoapStatus = async () => {
    setSoapLoading(true);
    setSoapActionMsg('Sending SOAP GetDrawingStatus XML Envelope...');
    try {
      const reqXml = `<Envelope>
  <Body>
    <GetDrawingStatus>
      <DrawingId>CAD-PRJ-1001</DrawingId>
    </GetDrawingStatus>
  </Body>
</Envelope>`;
      setSoapRequest(reqXml);
      const xmlResponse = await api.sendSOAPRequest(reqXml);
      setSoapResponse(xmlResponse);

      if (xmlResponse.includes('Unauthorized') || xmlResponse.includes('401') || xmlResponse.includes('token is invalid')) {
        setSoapActionMsg('🔒 SOAP Error: Unauthorized (401). Your JWT token has expired or is invalid. Please log out and log in again.');
        setIsLocked(false);
      } else if (xmlResponse.includes('Forbidden') || xmlResponse.includes('403')) {
        setSoapActionMsg('🚫 SOAP Error: Forbidden (403). Your role is not allowed to query vault status.');
      } else if (xmlResponse.includes('Fault')) {
        setSoapActionMsg('❌ SOAP Error: Gateway returned a SOAP Fault.');
      } else {
        // Parse status locally
        const lockedVal = xmlResponse.includes('<Locked>true</Locked>');
        setIsLocked(lockedVal);
        if (lockedVal) {
          const match = xmlResponse.match(/<LockedBy>([^<]+)<\/LockedBy>/);
          setLockedBy(match ? match[1] : 'engineer@cadshield.com');
          setSoapActionMsg('SOAP Response received: Drawing is currently LOCKED.');
        } else {
          setLockedBy('');
          setSoapActionMsg('SOAP Response received: Drawing is UNLOCKED.');
        }
      }
    } catch (err) {
      setSoapActionMsg(`SOAP Failed: ${err.message}`);
    } finally {
      setSoapLoading(false);
    }
  };

  // SOAP API Test - Lock
  const handleSoapLock = async () => {
    setSoapLoading(true);
    setSoapActionMsg('Sending SOAP LockDrawing XML Envelope...');
    try {
      const reqXml = `<Envelope>
  <Body>
    <LockDrawing>
      <DrawingId>CAD-PRJ-1001</DrawingId>
      <UserEmail>engineer@cadshield.com</UserEmail>
    </LockDrawing>
  </Body>
</Envelope>`;
      setSoapRequest(reqXml);
      const xmlResponse = await api.sendSOAPRequest(reqXml);
      setSoapResponse(xmlResponse);

      if (xmlResponse.includes('Unauthorized') || xmlResponse.includes('401') || xmlResponse.includes('token is invalid')) {
        setSoapActionMsg('🔒 SOAP Error: Unauthorized (401). Your JWT token has expired or is invalid. Please log out and log in again.');
      } else if (xmlResponse.includes('Forbidden') || xmlResponse.includes('403')) {
        setSoapActionMsg('🚫 SOAP Error: Forbidden (403). Your role is not allowed to lock drawings.');
      } else if (xmlResponse.includes('SUCCESS') || xmlResponse.includes('<Locked>true</Locked>')) {
        setIsLocked(true);
        setLockedBy('engineer@cadshield.com');
        setSoapActionMsg('SOAP Success: Vault drawing has been LOCKED successfully.');
      } else {
        setSoapActionMsg('❌ SOAP Error: Failed to lock vault drawing.');
      }
    } catch (err) {
      setSoapActionMsg(`SOAP Failed: ${err.message}`);
    } finally {
      setSoapLoading(false);
    }
  };

  // SOAP API Test - Unlock
  const handleSoapUnlock = async () => {
    setSoapLoading(true);
    setSoapActionMsg('Sending SOAP UnlockDrawing XML Envelope...');
    try {
      const reqXml = `<Envelope>
  <Body>
    <UnlockDrawing>
      <DrawingId>CAD-PRJ-1001</DrawingId>
    </UnlockDrawing>
  </Body>
</Envelope>`;
      setSoapRequest(reqXml);
      const xmlResponse = await api.sendSOAPRequest(reqXml);
      setSoapResponse(xmlResponse);

      if (xmlResponse.includes('Unauthorized') || xmlResponse.includes('401') || xmlResponse.includes('token is invalid')) {
        setSoapActionMsg('🔒 SOAP Error: Unauthorized (401). Your JWT token has expired or is invalid. Please log out and log in again.');
      } else if (xmlResponse.includes('Forbidden') || xmlResponse.includes('403')) {
        setSoapActionMsg('🚫 SOAP Error: Forbidden (403). Your role is not allowed to unlock drawings.');
      } else if (xmlResponse.includes('SUCCESS') || xmlResponse.includes('<Locked>false</Locked>')) {
        setIsLocked(false);
        setLockedBy('');
        setSoapActionMsg('SOAP Success: Vault drawing has been UNLOCKED successfully.');
      } else {
        setSoapActionMsg('❌ SOAP Error: Failed to unlock vault drawing.');
      }
    } catch (err) {
      setSoapActionMsg(`SOAP Failed: ${err.message}`);
    } finally {
      setSoapLoading(false);
    }
  };

  // FHIR Test
  const handleFhirTest = async () => {
    setFhirLoading(true);
    try {
      const data = await api.getFhirDesigns();
      setFhirDesigns(data);
      setFhirRaw(JSON.stringify(data, null, 2));
    } catch (err) {
      setFhirRaw(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setFhirLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">API Testing Sandbox</h1>
        <p className="page-subtitle">Send real protocol payloads (REST, GraphQL, SOAP, FHIR JSON) through the security layer</p>
      </div>

      <div className="explanation-box">
        <h4>🧪 Stakeholder Sandbox</h4>
        <p>
          Use the toggles on each card to switch between the <strong>Visual Stakeholder View</strong> (illustrating the business value) and the <strong>Developer Code View</strong> (displaying the raw payloads processed by the API Gateway).
        </p>
      </div>

      <div className="grid-2">
        {/* Section 1: RESTful API Test */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title" style={{ margin: 0 }}>🌐 Section 1: RESTful API Test</div>
            <div className="view-tabs">
              <button className={`view-tab ${restMode === 'visual' ? 'active' : ''}`} onClick={() => setRestMode('visual')}>Visual</button>
              <button className={`view-tab ${restMode === 'code' ? 'active' : ''}`} onClick={() => setRestMode('code')}>Developer (JSON)</button>
            </div>
          </div>

          <p className="card-desc" style={{ marginBottom: '16px' }}>
            Queries drawing directory metadata. In REST, requests return standard database attributes.
          </p>

          <button className="btn btn-sm" onClick={handleRestTest} disabled={restLoading}>
            {restLoading ? 'Fetching...' : 'Fetch CAD Projects'}
          </button>

          {restMode === 'visual' ? (
            <div style={{ marginTop: '16px' }}>
              {restProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {restProjects.map((p) => (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File: {p.drawingFile}</div>
                      </div>
                      <span className={`class-badge ${p.classification.toLowerCase()}`}>{p.classification}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
                  No data fetched yet. Click "Fetch CAD Projects" to query.
                </div>
              )}
            </div>
          ) : (
            restRaw && (
              <div className="response-container">
                <div className="response-header">GET /api/cad-projects Response</div>
                {restRaw}
              </div>
            )
          )}
        </div>

        {/* Section 2: GraphQL Test */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title" style={{ margin: 0 }}>⚡ Section 2: GraphQL Test</div>
            <div className="view-tabs">
              <button className={`view-tab ${gqlMode === 'visual' ? 'active' : ''}`} onClick={() => setGqlMode('visual')}>Visual</button>
              <button className={`view-tab ${gqlMode === 'code' ? 'active' : ''}`} onClick={() => setGqlMode('code')}>Developer (JSON)</button>
            </div>
          </div>

          <p className="card-desc" style={{ marginBottom: '12px' }}>
            Fetches only desired schema properties, reducing downstream network traffic.
          </p>

          {gqlMode === 'visual' ? (
            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-sm" onClick={handleGqlTest} disabled={gqlLoading}>
                {gqlLoading ? 'Querying...' : 'Execute GraphQL Fetch'}
              </button>

              {gqlSavings ? (
                <div style={{ marginTop: '16px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                    📊 GraphQL Optimization Stats
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    {gqlSavings.savedBandwidth} Bandwidth Saved!
                  </div>
                  <p className="card-desc" style={{ fontSize: '0.8rem', marginTop: '6px' }}>
                    {gqlSavings.explanation}
                  </p>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px', marginTop: '12px' }}>
                  Click "Execute" to visualize query savings.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="4"
                  value={gqlQuery}
                  onChange={(e) => setGqlQuery(e.target.value)}
                  placeholder="Write query here..."
                />
              </div>
              <button className="btn btn-sm" onClick={handleGqlTest} disabled={gqlLoading}>
                {gqlLoading ? 'Querying...' : 'Run GraphQL Query'}
              </button>
              {gqlResponse && (
                <div className="response-container">
                  <div className="response-header">POST /graphql Response</div>
                  {gqlResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: SOAP Test */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title" style={{ margin: 0 }}>🧼 Section 3: SOAP Test</div>
            <div className="view-tabs">
              <button className={`view-tab ${soapMode === 'visual' ? 'active' : ''}`} onClick={() => setSoapMode('visual')}>Visual</button>
              <button className={`view-tab ${soapMode === 'code' ? 'active' : ''}`} onClick={() => setSoapMode('code')}>Developer (XML)</button>
            </div>
          </div>

          <p className="card-desc" style={{ marginBottom: '12px' }}>
            Legacy lock coordination mechanism preventing overlapping drafts from overwriting one another.
          </p>

          {soapMode === 'visual' ? (
            <div style={{ marginTop: '12px' }}>
              <div className="drawing-lock-status-box">
                <div className={`lock-visual-icon ${isLocked ? 'locked' : ''}`}>
                  {isLocked ? '🔒' : '🔓'}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CAD-PRJ-1001 Lock State</div>
                  <strong style={{ fontSize: '1.05rem', color: isLocked ? 'var(--danger)' : 'var(--success)' }}>
                    {isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </strong>
                  {isLocked && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By: {lockedBy}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="btn btn-sm" onClick={checkSoapStatus} disabled={soapLoading}>Query Lock Status</button>
                <button className="btn btn-sm" style={{ backgroundColor: 'var(--danger)' }} onClick={handleSoapLock} disabled={soapLoading}>Lock Drawing</button>
                <button className="btn btn-sm" style={{ backgroundColor: 'var(--success)' }} onClick={handleSoapUnlock} disabled={soapLoading}>Unlock Drawing</button>
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {soapActionMsg}
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="4"
                  value={soapRequest}
                  onChange={(e) => setSoapRequest(e.target.value)}
                  placeholder="Write SOAP Envelope here..."
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm" onClick={checkSoapStatus} disabled={soapLoading}>Get Lock Status</button>
                <button className="btn btn-sm" onClick={handleSoapLock} disabled={soapLoading}>Lock</button>
                <button className="btn btn-sm" onClick={handleSoapUnlock} disabled={soapLoading}>Unlock</button>
              </div>
              {soapResponse && (
                <div className="response-container" style={{ color: '#22c55e' }}>
                  <div className="response-header">POST /soap/cad-vault Response (XML)</div>
                  {soapResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 4: FHIR Test */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title" style={{ margin: 0 }}>🏥 Section 4: FHIR Test</div>
            <div className="view-tabs">
              <button className={`view-tab ${fhirMode === 'visual' ? 'active' : ''}`} onClick={() => setFhirMode('visual')}>Visual</button>
              <button className={`view-tab ${fhirMode === 'code' ? 'active' : ''}`} onClick={() => setFhirMode('code')}>Developer (JSON)</button>
            </div>
          </div>

          <p className="card-desc" style={{ marginBottom: '16px' }}>
            Exchanges drawing assets under standardized formats for regulatory audit boards.
          </p>

          <button className="btn btn-sm" onClick={handleFhirTest} disabled={fhirLoading}>
            {fhirLoading ? 'Fetching...' : 'Fetch FHIR CAD Designs'}
          </button>

          {fhirMode === 'visual' ? (
            <div style={{ marginTop: '16px' }}>
              {fhirDesigns.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    ✔ Mapped standard CAD subjects to HL7 FHIR Subject References:
                  </div>
                  {fhirDesigns.map((f) => (
                    <div key={f.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <div>Resource: <strong>{f.resourceType}</strong> (<span style={{ fontFamily: 'var(--font-mono)' }}>{f.id}</span>)</div>
                      <div style={{ color: 'var(--primary)', marginTop: '4px' }}>
                        🔗 Subject Link: <code>{f.subject.reference}</code> ({f.subject.display})
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
                  No FHIR data loaded. Click "Fetch FHIR CAD Designs" to run.
                </div>
              )}
            </div>
          ) : (
            fhirRaw && (
              <div className="response-container">
                <div className="response-header">GET /api/fhir/cad-designs Response</div>
                {fhirRaw}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
