import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function CadProjects({ user }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [drawingFile, setDrawingFile] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [classification, setClassification] = useState('CONFIDENTIAL');
  const [owner, setOwner] = useState(user ? user.email : '');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const canCreate = user && (user.role === 'ADMIN' || user.role === 'ENGINEER');

  const fetchProjects = async () => {
    try {
      const data = await api.getCadProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]); // Select first by default
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const newPrj = await api.createCadProject(name, drawingFile, status, classification, owner);
      setFormSuccess('Project created successfully!');
      setName('');
      setDrawingFile('');
      // Refresh project list
      fetchProjects();
      setSelectedProject(newPrj);
    } catch (err) {
      setFormError(err.message || 'Failed to create CAD project');
    } finally {
      setFormLoading(false);
    }
  };

  // Generate deterministic realistic CAD metadata based on project ID
  const getCadSpecs = (prj) => {
    if (!prj) return null;
    const numId = parseInt(prj.id.replace(/[^\d]/g, '')) || 1000;
    return {
      fileSize: `${((numId * 17) % 5 + 1.2).toFixed(1)} MB`,
      layersCount: (numId % 8) + 5,
      entities: `${(numId * 13) % 4000 + 1200} lines, ${(numId * 7) % 800 + 200} arcs`,
      boundingBox: `[0.00, 0.00] to [${(numId * 2) % 1000 + 400}.00, ${(numId * 3) % 800 + 300}.00]`,
      format: `AutoCAD Drawing (DWG v2018)`,
      authorApp: `AutoCAD 2026.1`
    };
  };

  const selectedSpecs = getCadSpecs(selectedProject);

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
        <h1 className="page-title">CAD Vault Projects</h1>
        <p className="page-subtitle">Manage engineering schemas, active designs, and vault authorization metadata</p>
      </div>

      {/* Context explanation */}
      <div className="explanation-box">
        <h4>📐 Why Security in CAD Vaults?</h4>
        <p style={{ marginBottom: '8px' }}>
          Computer-Aided Design (CAD) blueprints contain trade secrets, machinery designs, and building layouts. Leaking these blueprints can compromise physical plant security or compromise industrial intellectual property.
        </p>
        <p>
          Each drawing file in the vault is flagged with a <strong>Classification Level</strong>. The API Gateway enforces role access restrictions, ensuring that only users with <strong>ADMIN</strong> or <strong>ENGINEER</strong> scopes can write new records, while auditing every fetch attempt.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        {/* Table & Spec Viewer Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '24px' }}>Loading projects list...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Drawing File</th>
                    <th>Status</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((prj) => (
                    <tr
                      key={prj.id}
                      onClick={() => setSelectedProject(prj)}
                      className={selectedProject && selectedProject.id === prj.id ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><span className="code-text">{prj.id}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prj.name}</td>
                      <td><span className="code-text">{prj.drawingFile}</span></td>
                      <td>
                        <span className="status-indicator" style={{ color: prj.status === 'ACTIVE' ? 'var(--success)' : prj.status === 'REVIEW' ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {prj.status}
                        </span>
                      </td>
                      <td>
                        <span className={`class-badge ${prj.classification.toLowerCase()}`}>
                          {prj.classification}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Interactive Spec Drawer */}
          {selectedProject && selectedSpecs && (
            <div className="card" style={{ borderColor: 'rgba(14, 165, 233, 0.3)' }}>
              <div className="card-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                📋 Detailed CAD Specifications: {selectedProject.name}
              </div>
              <div className="cad-spec-container" style={{ margin: 0, background: 'transparent', border: 'none', padding: '8px 0 0 0' }}>
                <div className="cad-spec-grid">
                  <div>
                    <span className="cad-spec-label">CAD File Name</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedProject.drawingFile}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">File Size</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedSpecs.fileSize}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Drawing Formats</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedSpecs.format}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Software Version</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedSpecs.authorApp}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Layers Count</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedSpecs.layersCount} layers</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Bounding Box (X,Y)</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{selectedSpecs.boundingBox}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span className="cad-spec-label">Total Visual Geometry Entities</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>{selectedSpecs.entities}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Owner</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px' }}>{selectedProject.owner}</div>
                  </div>
                  <div>
                    <span className="cad-spec-label">Last Uploaded Update</span>
                    <div className="cad-spec-value" style={{ textAlign: 'left', marginTop: '4px', fontSize: '0.75rem' }}>{formatDate(selectedProject.lastUpdated)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Creation Form Column */}
        <div className="card">
          <div className="card-title">📐 Register CAD Project</div>
          {!canCreate ? (
            <div className="error-banner" style={{ marginTop: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fcd34d' }}>
              🔒 Project registration is restricted to users with ADMIN or ENGINEER roles. Current role: {user ? user.role : 'none'}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
              {formError && <div className="error-banner">{formError}</div>}
              {formSuccess && <div className="status-indicator" style={{ marginBottom: '16px', color: 'var(--success)' }}>✓ {formSuccess}</div>}

              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Factory Layout Expansion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="drawingFile">CAD Drawing File (.dwg)</label>
                <input
                  id="drawingFile"
                  type="text"
                  className="form-control"
                  placeholder="e.g. factory-expansion.dwg"
                  value={drawingFile}
                  onChange={(e) => setDrawingFile(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectStatus">Status</label>
                <select
                  id="projectStatus"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="classification">Classification</label>
                <select
                  id="classification"
                  className="form-control"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="owner">Owner Email</label>
                <input
                  id="owner"
                  type="email"
                  className="form-control"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={formLoading}
              >
                {formLoading ? 'Submitting...' : 'Register Project'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
