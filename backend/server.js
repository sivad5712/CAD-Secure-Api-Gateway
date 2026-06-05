const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { graphql, buildSchema } = require('graphql');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'cadshield-secure-jwt-secret-key-2026-xyz';

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// In-Memory Database State
const users = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@cadshield.com",
    username: "admin@cadshield.com",
    password: "password123",
    role: "ADMIN",
    mfaCode: "123456"
  },
  {
    id: "USR-002",
    name: "CAD Engineer",
    email: "engineer@cadshield.com",
    username: "engineer@cadshield.com",
    password: "password123",
    role: "ENGINEER",
    mfaCode: "123456"
  },
  {
    id: "USR-003",
    name: "CAD Viewer",
    email: "viewer@cadshield.com",
    username: "viewer@cadshield.com",
    password: "password123",
    role: "VIEWER",
    mfaCode: "123456"
  },
  {
    id: "USR-004",
    name: "API Auditor",
    email: "auditor@cadshield.com",
    username: "auditor@cadshield.com",
    password: "password123",
    role: "AUDITOR",
    mfaCode: "123456"
  }
];

const cadProjects = [
  {
    id: "CAD-PRJ-1001",
    name: "Factory Floor Layout",
    drawingFile: "factory-floor-layout.dwg",
    status: "ACTIVE",
    classification: "CONFIDENTIAL",
    owner: "engineer@cadshield.com",
    lastUpdated: "2026-06-03T10:00:00Z"
  },
  {
    id: "CAD-PRJ-1002",
    name: "Robotics Assembly Cell",
    drawingFile: "robotics-assembly-cell.dwg",
    status: "ACTIVE",
    classification: "INTERNAL",
    owner: "engineer@cadshield.com",
    lastUpdated: "2026-06-03T11:00:00Z"
  },
  {
    id: "CAD-PRJ-1003",
    name: "Warehouse Conveyor Layout",
    drawingFile: "warehouse-conveyor-layout.dwg",
    status: "REVIEW",
    classification: "CONFIDENTIAL",
    owner: "admin@cadshield.com",
    lastUpdated: "2026-06-03T12:00:00Z"
  },
  {
    id: "CAD-PRJ-1004",
    name: "Electrical Panel Design",
    drawingFile: "electrical-panel-design.dwg",
    status: "ACTIVE",
    classification: "INTERNAL",
    owner: "engineer@cadshield.com",
    lastUpdated: "2026-06-03T13:00:00Z"
  },
  {
    id: "CAD-PRJ-1005",
    name: "Mechanical Fixture Blueprint",
    drawingFile: "mechanical-fixture-blueprint.dwg",
    status: "ARCHIVED",
    classification: "RESTRICTED",
    owner: "admin@cadshield.com",
    lastUpdated: "2026-06-03T14:00:00Z"
  }
];

const fhirDesigns = [
  {
    "resourceType": "CADDesign",
    "id": "CAD-FHIR-1001",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2026-06-03T10:00:00Z",
      "security": ["CONFIDENTIAL"]
    },
    "identifier": [
      {
        "system": "https://cadshield.local/cad-designs",
        "value": "CAD-PRJ-1001"
      }
    ],
    "status": "active",
    "subject": {
      "reference": "CADProject/CAD-PRJ-1001",
      "display": "Factory Floor Layout"
    },
    "authoredOn": "2026-06-03T10:00:00Z"
  },
  {
    "resourceType": "CADDesign",
    "id": "CAD-FHIR-1002",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2026-06-03T11:00:00Z",
      "security": ["INTERNAL"]
    },
    "identifier": [
      {
        "system": "https://cadshield.local/cad-designs",
        "value": "CAD-PRJ-1002"
      }
    ],
    "status": "active",
    "subject": {
      "reference": "CADProject/CAD-PRJ-1002",
      "display": "Robotics Assembly Cell"
    },
    "authoredOn": "2026-06-03T11:00:00Z"
  },
  {
    "resourceType": "CADDesign",
    "id": "CAD-FHIR-1003",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2026-06-03T12:00:00Z",
      "security": ["CONFIDENTIAL"]
    },
    "identifier": [
      {
        "system": "https://cadshield.local/cad-designs",
        "value": "CAD-PRJ-1003"
      }
    ],
    "status": "active",
    "subject": {
      "reference": "CADProject/CAD-PRJ-1003",
      "display": "Warehouse Conveyor Layout"
    },
    "authoredOn": "2026-06-03T12:00:00Z"
  },
  {
    "resourceType": "CADDesign",
    "id": "CAD-FHIR-1004",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2026-06-03T13:00:00Z",
      "security": ["INTERNAL"]
    },
    "identifier": [
      {
        "system": "https://cadshield.local/cad-designs",
        "value": "CAD-PRJ-1004"
      }
    ],
    "status": "active",
    "subject": {
      "reference": "CADProject/CAD-PRJ-1004",
      "display": "Electrical Panel Design"
    },
    "authoredOn": "2026-06-03T13:00:00Z"
  },
  {
    "resourceType": "CADDesign",
    "id": "CAD-FHIR-1005",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2026-06-03T14:00:00Z",
      "security": ["RESTRICTED"]
    },
    "identifier": [
      {
        "system": "https://cadshield.local/cad-designs",
        "value": "CAD-PRJ-1005"
      }
    ],
    "status": "active",
    "subject": {
      "reference": "CADProject/CAD-PRJ-1005",
      "display": "Mechanical Fixture Blueprint"
    },
    "authoredOn": "2026-06-03T14:00:00Z"
  }
];

const auditLogs = [
  {
    "id": "AUD-1001",
    "eventType": "LOGIN_SUCCESS",
    "userEmail": "engineer@cadshield.com",
    "apiType": "AUTH",
    "endpoint": "/api/auth/login",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:00:00Z",
    "details": "OAuth 2.0 login successful. MFA challenge created."
  },
  {
    "id": "AUD-1002",
    "eventType": "MFA_VERIFIED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "AUTH",
    "endpoint": "/api/auth/verify-mfa",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:01:00Z",
    "details": "MFA verified. JWT issued successfully."
  },
  {
    "id": "AUD-1003",
    "eventType": "JWT_ISSUED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "AUTH",
    "endpoint": "/api/auth/verify-mfa",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:01:05Z",
    "details": "JWT token issued for USR-002 (CAD Engineer)."
  },
  {
    "id": "AUD-1004",
    "eventType": "REST_API_ACCESSED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "REST",
    "endpoint": "/api/cad-projects",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:05:00Z",
    "details": "Fetched list of all CAD projects."
  },
  {
    "id": "AUD-1005",
    "eventType": "GRAPHQL_API_ACCESSED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "GRAPHQL",
    "endpoint": "/graphql",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:10:00Z",
    "details": "Executed GraphQL query for CAD project status updates."
  },
  {
    "id": "AUD-1006",
    "eventType": "SOAP_API_ACCESSED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "SOAP",
    "endpoint": "/soap/cad-vault",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:15:00Z",
    "details": "SOAP operation 'GetDrawingStatus' executed successfully for CAD-PRJ-1001."
  },
  {
    "id": "AUD-1007",
    "eventType": "FHIR_API_ACCESSED",
    "userEmail": "engineer@cadshield.com",
    "apiType": "FHIR",
    "endpoint": "/api/fhir/cad-designs",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T10:20:00Z",
    "details": "Fetched FHIR CADDesign resources."
  },
  {
    "id": "AUD-1008",
    "eventType": "CAD_PROJECT_CREATED",
    "userEmail": "admin@cadshield.com",
    "apiType": "REST",
    "endpoint": "/api/cad-projects",
    "status": "SUCCESS",
    "timestamp": "2026-06-03T11:00:00Z",
    "details": "New CAD project created: 'Warehouse Conveyor Layout' (CAD-PRJ-1003)."
  },
  {
    "id": "AUD-1009",
    "eventType": "UNAUTHORIZED_REQUEST",
    "userEmail": "unknown",
    "apiType": "REST",
    "endpoint": "/api/cad-projects",
    "status": "FAILURE",
    "timestamp": "2026-06-03T11:15:00Z",
    "details": "Unauthorized. JWT token is required."
  },
  {
    "id": "AUD-1010",
    "eventType": "FORBIDDEN_REQUEST",
    "userEmail": "viewer@cadshield.com",
    "apiType": "REST",
    "endpoint": "/api/cad-projects",
    "status": "FAILURE",
    "timestamp": "2026-06-03T11:30:00Z",
    "details": "Forbidden. You do not have access to this resource."
  }
];

const lockedDrawings = new Map([
  ["CAD-PRJ-1001", { locked: false, lockedBy: "" }]
]);

const mfaSessions = new Map(); // mfaSessionId -> { user, expiresAt }

// Helpers
function createAuditLog(eventType, userEmail, apiType, endpoint, status, details) {
  const newLog = {
    id: `AUD-${1000 + auditLogs.length + 1}`,
    eventType,
    userEmail: userEmail || "unknown",
    apiType,
    endpoint,
    status,
    timestamp: new Date().toISOString(),
    details
  };
  auditLogs.push(newLog);
  return newLog;
}

// Authentication Middlewares
function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    createAuditLog("UNAUTHORIZED_REQUEST", "unknown", "REST", req.originalUrl, "FAILURE", "Unauthorized. JWT token is required.");
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. JWT token is required."
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    createAuditLog("UNAUTHORIZED_REQUEST", "unknown", "REST", req.originalUrl, "FAILURE", "Unauthorized. JWT token is invalid.");
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. JWT token is invalid."
    });
  }
}

// Role Check Middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      createAuditLog(
        "FORBIDDEN_REQUEST",
        req.user ? req.user.email : "unknown",
        "REST",
        req.originalUrl,
        "FAILURE",
        `Forbidden. Role '${req.user ? req.user.role : "none"}' does not have access.`
      );
      return res.status(403).json({
        status: 403,
        message: "Forbidden. You do not have access to this resource."
      });
    }
    next();
  };
}

// ----------------------------------------------------
// Endpoints
// ----------------------------------------------------

// 1. Auth Login (Step 1)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    createAuditLog("UNAUTHORIZED_REQUEST", username, "AUTH", "/api/auth/login", "FAILURE", "Invalid username or password.");
    return res.status(401).json({
      status: 401,
      message: "Invalid username or password."
    });
  }

  const mfaSessionId = `MFA-SESSION-${1000 + mfaSessions.size + 1}`;
  mfaSessions.set(mfaSessionId, {
    user,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  createAuditLog("LOGIN_SUCCESS", user.email, "AUTH", "/api/auth/login", "SUCCESS", "OAuth 2.0 login successful. MFA challenge created.");

  return res.json({
    message: "OAuth 2.0 authorization successful. MFA required.",
    oauthAuthorizationCode: "AUTH-CODE-1001",
    mfaRequired: true,
    mfaSessionId: mfaSessionId,
    demoMfaCode: user.mfaCode
  });
});

// 2. Verify MFA (Step 2)
app.post('/api/auth/verify-mfa', (req, res) => {
  const { mfaSessionId, mfaCode } = req.body;
  const session = mfaSessions.get(mfaSessionId);

  if (!session) {
    createAuditLog("UNAUTHORIZED_REQUEST", "unknown", "AUTH", "/api/auth/verify-mfa", "FAILURE", "Invalid or expired MFA session.");
    return res.status(400).json({
      status: 400,
      message: "Invalid or expired MFA session."
    });
  }

  if (session.expiresAt < Date.now()) {
    mfaSessions.delete(mfaSessionId);
    createAuditLog("UNAUTHORIZED_REQUEST", session.user.email, "AUTH", "/api/auth/verify-mfa", "FAILURE", "MFA session expired.");
    return res.status(400).json({
      status: 400,
      message: "MFA session expired."
    });
  }

  if (session.user.mfaCode !== mfaCode) {
    createAuditLog("UNAUTHORIZED_REQUEST", session.user.email, "AUTH", "/api/auth/verify-mfa", "FAILURE", "Invalid MFA code.");
    return res.status(401).json({
      status: 401,
      message: "Invalid MFA code."
    });
  }

  // Success! Generate JWT
  const userPayload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role
  };

  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

  createAuditLog("MFA_VERIFIED", session.user.email, "AUTH", "/api/auth/verify-mfa", "SUCCESS", "MFA verified successfully.");
  createAuditLog("JWT_ISSUED", session.user.email, "AUTH", "/api/auth/verify-mfa", "SUCCESS", `JWT generated for ${session.user.name} (Role: ${session.user.role})`);

  mfaSessions.delete(mfaSessionId);

  return res.json({
    message: "MFA verified. JWT issued successfully.",
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: "1h",
    user: userPayload
  });
});

// 3. API Gateway Routes discovery
app.get('/api/gateway/routes', (req, res) => {
  // Free endpoint to inspect route mappings
  return res.json({
    "gatewayName": "CADShield API Gateway",
    "status": "ACTIVE",
    "securedBy": ["OAuth 2.0", "MFA", "JWT"],
    "supportedApis": ["RESTful APIs", "GraphQL", "SOAP", "FHIR", "JSON"],
    "routes": {
      "auth": [
        "POST /api/auth/login",
        "POST /api/auth/verify-mfa"
      ],
      "rest": [
        "GET /api/cad-projects",
        "GET /api/cad-projects/:id"
      ],
      "graphql": [
        "POST /graphql"
      ],
      "soap": [
        "POST /soap/cad-vault"
      ],
      "fhir": [
        "GET /api/fhir/cad-designs",
        "GET /api/fhir/cad-designs/:id"
      ],
      "audit": [
        "GET /api/audit-logs"
      ]
    }
  });
});

// 4. RESTful API: Fetch Projects
app.get('/api/cad-projects', jwtMiddleware, (req, res) => {
  createAuditLog("REST_API_ACCESSED", req.user.email, "REST", "/api/cad-projects", "SUCCESS", "Fetched all CAD projects list.");
  return res.json(cadProjects);
});

// Fetch Single Project
app.get('/api/cad-projects/:id', jwtMiddleware, (req, res) => {
  const id = req.params.id;
  const project = cadProjects.find(p => p.id === id);

  if (!project) {
    createAuditLog("REST_API_ACCESSED", req.user.email, "REST", `/api/cad-projects/${id}`, "FAILURE", `CAD Project ${id} not found.`);
    return res.status(404).json({
      status: 404,
      message: `CAD Project with ID ${id} not found.`
    });
  }

  createAuditLog("REST_API_ACCESSED", req.user.email, "REST", `/api/cad-projects/${id}`, "SUCCESS", `Fetched details of project ${id}.`);
  return res.json(project);
});

// Create Project
app.post('/api/cad-projects', jwtMiddleware, authorizeRoles('ADMIN', 'ENGINEER'), (req, res) => {
  const { name, drawingFile, status, classification, owner } = req.body;

  if (!name || !drawingFile || !status || !classification || !owner) {
    return res.status(400).json({
      status: 400,
      message: "All project fields (name, drawingFile, status, classification, owner) are required."
    });
  }

  const id = `CAD-PRJ-${1000 + cadProjects.length + 1}`;
  const newProject = {
    id,
    name,
    drawingFile,
    status,
    classification,
    owner,
    lastUpdated: new Date().toISOString()
  };

  cadProjects.push(newProject);

  // Sync with FHIR Designs
  const newFhir = {
    resourceType: "CADDesign",
    id: `CAD-FHIR-${1000 + fhirDesigns.length + 1}`,
    meta: {
      versionId: "1",
      lastUpdated: newProject.lastUpdated,
      security: [classification]
    },
    identifier: [
      {
        system: "https://cadshield.local/cad-designs",
        value: id
      }
    ],
    status: status.toLowerCase() === 'active' ? 'active' : 'suspended',
    subject: {
      reference: `CADProject/${id}`,
      display: name
    },
    authoredOn: newProject.lastUpdated
  };
  fhirDesigns.push(newFhir);

  createAuditLog("CAD_PROJECT_CREATED", req.user.email, "REST", "/api/cad-projects", "SUCCESS", `Created CAD project ${id} - ${name}.`);

  return res.status(201).json(newProject);
});

// 5. GraphQL Endpoint
const gqlSchema = buildSchema(`
  type CADProject {
    id: ID!
    name: String!
    drawingFile: String!
    status: String!
    classification: String!
    owner: String!
    lastUpdated: String!
  }

  type Query {
    cadProjects: [CADProject]
    cadProject(id: ID!): CADProject
  }

  type Mutation {
    createCADProject(
      name: String!
      drawingFile: String!
      status: String!
      classification: String!
      owner: String!
    ): CADProject
  }
`);

const gqlResolvers = {
  cadProjects: () => {
    return cadProjects;
  },
  cadProject: ({ id }) => {
    return cadProjects.find(p => p.id === id);
  },
  createCADProject: ({ name, drawingFile, status, classification, owner }) => {
    const id = `CAD-PRJ-${1000 + cadProjects.length + 1}`;
    const newPrj = {
      id,
      name,
      drawingFile,
      status,
      classification,
      owner,
      lastUpdated: new Date().toISOString()
    };
    cadProjects.push(newPrj);

    // Sync FHIR
    const newFhir = {
      resourceType: "CADDesign",
      id: `CAD-FHIR-${1000 + fhirDesigns.length + 1}`,
      meta: {
        versionId: "1",
        lastUpdated: newPrj.lastUpdated,
        security: [classification]
      },
      identifier: [
        {
          system: "https://cadshield.local/cad-designs",
          value: id
        }
      ],
      status: status.toLowerCase() === 'active' ? 'active' : 'suspended',
      subject: {
        reference: `CADProject/${id}`,
        display: name
      },
      authoredOn: newPrj.lastUpdated
    };
    fhirDesigns.push(newFhir);

    return newPrj;
  }
};

app.post('/graphql', jwtMiddleware, async (req, res) => {
  const { query, variables } = req.body;
  if (!query) {
    return res.status(400).json({ errors: [{ message: "GraphQL query is required in post body." }] });
  }

  const queryExcerpt = query.replace(/\s+/g, ' ').trim().substring(0, 100);
  createAuditLog("GRAPHQL_API_ACCESSED", req.user.email, "GRAPHQL", "/graphql", "SUCCESS", `Executed GraphQL: ${queryExcerpt}`);

  try {
    const response = await graphql({
      schema: gqlSchema,
      source: query,
      rootValue: gqlResolvers,
      variableValues: variables
    });
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
});

// 6. SOAP-Style Endpoint
app.post('/soap/cad-vault', jwtMiddleware, express.text({ type: ['text/xml', 'application/xml', 'text/plain', 'application/x-www-form-urlencoded'] }), (req, res) => {
  const xml = req.body || '';
  res.setHeader('Content-Type', 'application/xml');

  // Utility to extract tag values from XML body string
  const getTagValue = (xmlStr, tag) => {
    const regex = new RegExp(`<${tag}>([^<]+)<\/${tag}>`, 'i');
    const match = xmlStr.match(regex);
    return match ? match[1].trim() : '';
  };

  if (xml.includes('GetDrawingStatus')) {
    const drawingId = getTagValue(xml, 'DrawingId');
    const prj = cadProjects.find(p => p.id === drawingId);
    const status = prj ? prj.status : 'NOT_FOUND';
    const lockInfo = lockedDrawings.get(drawingId) || { locked: false, lockedBy: '' };

    createAuditLog(
      "SOAP_API_ACCESSED",
      req.user.email,
      "SOAP",
      "/soap/cad-vault",
      "SUCCESS",
      `SOAP action 'GetDrawingStatus' for ${drawingId}`
    );

    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Envelope>
  <Body>
    <GetDrawingStatusResponse>
      <DrawingId>${drawingId}</DrawingId>
      <Status>${status}</Status>
      <Locked>${lockInfo.locked}</Locked>
      <LockedBy>${lockInfo.lockedBy}</LockedBy>
    </GetDrawingStatusResponse>
  </Body>
</Envelope>`);
  }

  if (xml.includes('LockDrawing')) {
    const drawingId = getTagValue(xml, 'DrawingId');
    const userEmail = getTagValue(xml, 'UserEmail');

    lockedDrawings.set(drawingId, { locked: true, lockedBy: userEmail || req.user.email });

    createAuditLog(
      "SOAP_API_ACCESSED",
      req.user.email,
      "SOAP",
      "/soap/cad-vault",
      "SUCCESS",
      `SOAP action 'LockDrawing' for ${drawingId} by ${userEmail || req.user.email}`
    );

    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Envelope>
  <Body>
    <LockDrawingResponse>
      <DrawingId>${drawingId}</DrawingId>
      <Status>SUCCESS</Status>
      <Locked>true</Locked>
      <LockedBy>${userEmail || req.user.email}</LockedBy>
    </LockDrawingResponse>
  </Body>
</Envelope>`);
  }

  if (xml.includes('UnlockDrawing')) {
    const drawingId = getTagValue(xml, 'DrawingId');

    lockedDrawings.set(drawingId, { locked: false, lockedBy: "" });

    createAuditLog(
      "SOAP_API_ACCESSED",
      req.user.email,
      "SOAP",
      "/soap/cad-vault",
      "SUCCESS",
      `SOAP action 'UnlockDrawing' for ${drawingId}`
    );

    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Envelope>
  <Body>
    <UnlockDrawingResponse>
      <DrawingId>${drawingId}</DrawingId>
      <Status>SUCCESS</Status>
      <Locked>false</Locked>
      <LockedBy></LockedBy>
    </UnlockDrawingResponse>
  </Body>
</Envelope>`);
  }

  // Fault response
  createAuditLog(
    "SOAP_API_ACCESSED",
    req.user.email,
    "SOAP",
    "/soap/cad-vault",
    "FAILURE",
    "SOAP fault: Invalid or unsupported SOAP operation."
  );

  return res.status(400).send(`<?xml version="1.0" encoding="UTF-8"?>
<Envelope>
  <Body>
    <Fault>
      <Code>Client</Code>
      <Reason>Invalid or unsupported SOAP operation.</Reason>
    </Fault>
  </Body>
</Envelope>`);
});

// 7. FHIR-Style CAD Designs API
app.get('/api/fhir/cad-designs', jwtMiddleware, (req, res) => {
  createAuditLog("FHIR_API_ACCESSED", req.user.email, "FHIR", "/api/fhir/cad-designs", "SUCCESS", "Fetched all FHIR CAD design resources.");
  return res.json(fhirDesigns);
});

app.get('/api/fhir/cad-designs/:id', jwtMiddleware, (req, res) => {
  const id = req.params.id;
  const fhirDesign = fhirDesigns.find(f => f.id === id);

  if (!fhirDesign) {
    createAuditLog("FHIR_API_ACCESSED", req.user.email, "FHIR", `/api/fhir/cad-designs/${id}`, "FAILURE", `FHIR CADDesign resource ${id} not found.`);
    return res.status(404).json({
      status: 404,
      message: `FHIR CADDesign resource with ID ${id} not found.`
    });
  }

  createAuditLog("FHIR_API_ACCESSED", req.user.email, "FHIR", `/api/fhir/cad-designs/${id}`, "SUCCESS", `Fetched details of FHIR CADDesign ${id}.`);
  return res.json(fhirDesign);
});

// 8. Audit Logs API (Only accessible by ADMIN or AUDITOR role)
app.get('/api/audit-logs', jwtMiddleware, authorizeRoles('ADMIN', 'AUDITOR'), (req, res) => {
  createAuditLog("REST_API_ACCESSED", req.user.email, "REST", "/api/audit-logs", "SUCCESS", "Audit logs table viewed.");
  return res.json(auditLogs);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
