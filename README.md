# CADShield Gateway
## Live Interactive Demo

Live Application:  
https://cad-secure-api-gateway-xifg.vercel.app

## Project Overview

CADShield Gateway is a complete working API Gateway and Security Dashboard built for a CAD engineering environment.

The project demonstrates how sensitive CAD design metadata, drawing files, and engineering project records can be protected using a centralized API Gateway with authentication, authorization, auditing, and multiple API communication protocols.

This application focuses strictly on the following API and security stack:

- RESTful APIs
- GraphQL
- SOAP
- FHIR-style JSON
- OAuth 2.0
- JWT
- API Gateway
- Multi-Factor Authentication
- JSON

The system allows a user to log in, complete MFA verification, receive a JWT token, access protected CAD project data, test multiple API protocols, and view API security audit logs from one dashboard.

---

## Demo Access Credentials

Use the following sandbox credentials to test the live application.

| User Profile | Username / Email | Password | Role | MFA Code |
|---|---|---|---|---|
| CAD Engineer | engineer@cadshield.com | password123 | ENGINEER | 123456 |
| Admin User | admin@cadshield.com | password123 | ADMIN | 123456 |
| CAD Viewer | viewer@cadshield.com | password123 | VIEWER | 123456 |
| API Auditor | auditor@cadshield.com | password123 | AUDITOR | 123456 |

> These credentials are mock demo credentials created only for project testing. In a real production system, credentials should never be stored in documentation.

---

## Business Problem

CAD engineering companies manage highly sensitive design files such as:

- Factory layouts
- Machine drawings
- Electrical panel designs
- Mechanical fixtures
- Robotics assembly layouts
- Warehouse automation blueprints

These CAD files often contain confidential intellectual property. If design metadata is exposed without proper gateway security, unauthorized users could view, modify, or misuse critical engineering assets.

Engineering systems also commonly use different API styles at the same time:

- Modern web dashboards use RESTful APIs.
- Data-driven clients may prefer GraphQL.
- Legacy CAD vault systems may still use SOAP XML.
- Standardized resource exchange may use FHIR-style JSON.

The main challenge is to secure all these API styles through one consistent gateway layer.

---

## Solution

CADShield Gateway solves this by placing a centralized API Gateway in front of CAD design metadata services.

The gateway handles:

- OAuth 2.0-style login flow
- Multi-Factor Authentication
- JWT token generation
- JWT token validation
- Role-Based Access Control
- REST API routing
- GraphQL query handling
- SOAP XML request handling
- FHIR-style JSON resource access
- Audit logging for security events

The dashboard provides a simple interface for users to test and understand how each API and security technology works in a real engineering use case.

---

## Strict Technology Stack

This project is intentionally focused on the API and security stack below.

| Technology | Purpose |
|---|---|
| RESTful APIs | Access CAD project metadata using standard HTTP endpoints |
| GraphQL | Query selected CAD project fields through schema-based API access |
| SOAP | Simulate legacy CAD vault XML operations |
| FHIR | Represent CAD design metadata using standardized JSON resource modeling |
| OAuth 2.0 | Simulate authorization flow before MFA verification |
| JWT | Secure protected APIs with signed bearer tokens |
| API Gateway | Centralized routing, security filtering, and protocol handling |
| Multi-Factor Authentication | Verify user identity before issuing JWT |
| JSON | Primary data exchange format for REST, FHIR, audit logs, and dashboard data |

---

## Key Features

### Authentication and Security

- Username and password login
- OAuth 2.0-style authorization code generation
- MFA challenge and verification
- JWT token generation after MFA success
- JWT-protected API routes
- Role-based authorization
- Protected and unauthorized API test flows

### API Gateway

- Central route discovery
- REST API routing
- GraphQL endpoint routing
- SOAP XML endpoint routing
- FHIR JSON endpoint routing
- Security policy enforcement
- Audit event tracking

### CAD Project Management

- View CAD projects
- Create CAD project metadata
- Display drawing file names
- Display project classification
- Display owner and last updated timestamp

### API Testing Dashboard

The dashboard includes working testers for:

- RESTful API calls
- GraphQL queries
- SOAP XML requests
- FHIR-style JSON resource requests

### Audit Logs

The system tracks gateway and security events such as:

- Login success
- MFA verification
- JWT issued
- REST API accessed
- GraphQL API accessed
- SOAP API accessed
- FHIR API accessed
- Unauthorized request
- Forbidden request
- CAD project created

---

## Application Pages

| Page | Description |
|---|---|
| Login Page | User login, OAuth code display, MFA verification, JWT generation |
| Dashboard Page | Shows active API and security technology cards |
| API Gateway Page | Displays route mapping and security policies |
| CAD Projects Page | Displays CAD design metadata and project creation form |
| API Testing Page | Tests REST, GraphQL, SOAP, and FHIR APIs |
| Security Page | Shows JWT preview, decoded token payload, MFA status, and protected API tests |
| Audit Logs Page | Displays gateway and security audit trail |
| Logout | Clears user session and redirects to login |

---

## Security Flow

The project follows this authentication and authorization flow:

```text
User Login
   ↓
OAuth 2.0-style authorization code generated
   ↓
MFA challenge created
   ↓
User enters MFA code
   ↓
MFA verified
   ↓
JWT token issued
   ↓
JWT token sent in Authorization header
   ↓
API Gateway validates JWT
   ↓
Role-Based Access Control is applied
   ↓
Protected CAD API response returned
   ↓
Audit log event created
```

---

## API Gateway Routing and Security Specification

| Route Endpoint | API Protocol | Security Filter | Authorized Roles | Description |
|---|---|---|---|---|
| POST /api/auth/login | REST / JSON | Public | Anyone | Login and receive OAuth code with MFA challenge |
| POST /api/auth/verify-mfa | REST / JSON | Public | Anyone | Verify MFA and receive JWT token |
| GET /api/gateway/routes | REST / JSON | Public | Anyone | View active gateway route mappings |
| GET /api/cad-projects | REST / JSON | JWT | ADMIN, ENGINEER, VIEWER | Fetch all CAD project metadata |
| GET /api/cad-projects/:id | REST / JSON | JWT | ADMIN, ENGINEER, VIEWER | Fetch one CAD project by ID |
| POST /api/cad-projects | REST / JSON | JWT + RBAC | ADMIN, ENGINEER | Create a new CAD project |
| POST /graphql | GraphQL | JWT | ADMIN, ENGINEER, VIEWER | Query CAD project data |
| POST /graphql | GraphQL Mutation | JWT + RBAC | ADMIN, ENGINEER | Create CAD project through GraphQL |
| POST /soap/cad-vault | SOAP / XML | JWT | ADMIN, ENGINEER | Run CAD vault operations |
| GET /api/fhir/cad-designs | FHIR / JSON | JWT | ADMIN, ENGINEER, VIEWER | Fetch FHIR-style CAD resources |
| GET /api/audit-logs | REST / JSON | JWT + RBAC | ADMIN, AUDITOR | View security audit trail |

---

## Role-Based Access Control

| Role | Permissions |
|---|---|
| ADMIN | Full access to CAD projects, API testing, audit logs, and protected routes |
| ENGINEER | Can view and create CAD projects, test REST, GraphQL, SOAP, and FHIR APIs |
| VIEWER | Can view CAD project data but cannot create records or view audit logs |
| AUDITOR | Can view audit logs and security-related data |

---

## RESTful API Example

### Fetch CAD Projects

```http
GET /api/cad-projects
Authorization: Bearer <JWT_TOKEN>
```

### Example Response

```json
[
  {
    "id": "CAD-PRJ-1001",
    "name": "Factory Floor Layout",
    "drawingFile": "factory-floor-layout.dwg",
    "status": "ACTIVE",
    "classification": "CONFIDENTIAL",
    "owner": "engineer@cadshield.com",
    "lastUpdated": "2026-06-03T10:00:00Z"
  }
]
```

---

## GraphQL API Example

### Endpoint

```http
POST /graphql
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Query

```graphql
query {
  cadProjects {
    id
    name
    drawingFile
    status
    classification
  }
}
```

### Purpose

GraphQL allows the dashboard to request only the CAD project fields it needs instead of receiving the full REST response.

---

## SOAP API Example

### Endpoint

```http
POST /soap/cad-vault
Authorization: Bearer <JWT_TOKEN>
Content-Type: text/xml
```

### SOAP XML Request

```xml
<Envelope>
  <Body>
    <GetDrawingStatus>
      <DrawingId>CAD-PRJ-1001</DrawingId>
    </GetDrawingStatus>
  </Body>
</Envelope>
```

### SOAP XML Response

```xml
<Envelope>
  <Body>
    <GetDrawingStatusResponse>
      <DrawingId>CAD-PRJ-1001</DrawingId>
      <Status>ACTIVE</Status>
      <Locked>false</Locked>
      <LockedBy></LockedBy>
    </GetDrawingStatusResponse>
  </Body>
</Envelope>
```

### Purpose

The SOAP endpoint simulates a legacy CAD vault system that still communicates using XML envelopes.

---

## FHIR-Style JSON Example

### Endpoint

```http
GET /api/fhir/cad-designs
Authorization: Bearer <JWT_TOKEN>
```

### Example FHIR-Style CAD Resource

```json
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
}
```

### Purpose

FHIR-style JSON is used here as a standardized resource modeling pattern for CAD design metadata. This project does not implement healthcare workflows.

---

## JWT Security

After successful MFA verification, the backend returns a signed JWT token.

The JWT payload includes:

```json
{
  "userId": "USR-002",
  "name": "CAD Engineer",
  "email": "engineer@cadshield.com",
  "role": "ENGINEER"
}
```

Protected API requests must include:

```http
Authorization: Bearer <JWT_TOKEN>
```

If the token is missing, the API Gateway returns:

```json
{
  "status": 401,
  "message": "Unauthorized. JWT token is required."
}
```

If the user role is not allowed, the API Gateway returns:

```json
{
  "status": 403,
  "message": "Forbidden. You do not have access to this resource."
}
```

---

## Sample CAD Project Data

```json
{
  "id": "CAD-PRJ-1001",
  "name": "Factory Floor Layout",
  "drawingFile": "factory-floor-layout.dwg",
  "status": "ACTIVE",
  "classification": "CONFIDENTIAL",
  "owner": "engineer@cadshield.com",
  "lastUpdated": "2026-06-03T10:00:00Z"
}
```

Other sample CAD projects include:

- Robotics Assembly Cell
- Warehouse Conveyor Layout
- Electrical Panel Design
- Mechanical Fixture Blueprint

---

## Local Setup

### Prerequisite

Install Node.js on your system.

---

### Start Backend Server

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Start Frontend Dashboard

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Live Demo Testing Flow

1. Open the live application:

```text
https://cad-secure-api-gateway-xifg.vercel.app
```

2. Log in using:

```text
Username: engineer@cadshield.com
Password: password123
MFA Code: 123456
```

3. Open the Dashboard page and verify the active technology cards.

4. Open the CAD Projects page and view CAD design metadata.

5. Open the API Testing page and test:

```text
RESTful API
GraphQL
SOAP
FHIR
```

6. Open the Security page and inspect:

```text
OAuth authorization code
MFA status
JWT token preview
Decoded JWT payload
Protected API test
Missing JWT test
```

7. Open the Audit Logs page using an ADMIN or AUDITOR account.

---

## Deployment

This project is deployed on Vercel.

Live URL:

```text
https://cad-secure-api-gateway-xifg.vercel.app
```

Recommended deployment steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the frontend and backend paths according to the project structure.
4. Deploy the project.
5. Test login, MFA, JWT, REST, GraphQL, SOAP, FHIR, and audit logs from the live URL.

---

## Project Structure

```text
cad-secure-api-gateway/
  README.md
  backend/
    src/
      auth/
      gateway/
      rest/
      graphql/
      soap/
      fhir/
      audit/
      data/
  frontend/
    src/
      api/
      components/
      pages/
      styles/
```

---

## Why This Project Is Portfolio-Worthy

This project is valuable because it demonstrates practical API security and integration skills in one focused engineering domain.

It shows the ability to:

- Design secure API gateway architecture
- Implement authentication and authorization flows
- Protect APIs using JWT
- Apply role-based access control
- Support multiple API communication styles
- Build a working dashboard for API testing
- Model structured JSON resources
- Create audit logs for security visibility
- Explain complex API security clearly through a live demo

---

## Future Improvements

The current version is intentionally designed as a minimal, working API security dashboard. Future versions can extend the platform with stronger enterprise capabilities while keeping the same CAD security theme.

Planned improvements include:

- Replace mock OAuth 2.0 flow with a real OAuth 2.0 authorization server.
- Add refresh token rotation for longer and safer authenticated sessions.
- Add real MFA delivery through email, authenticator app, or SMS.
- Add token revocation and logout invalidation support.
- Store CAD metadata in a persistent production database instead of local JSON files.
- Add encrypted storage for sensitive CAD project metadata.
- Add rate limiting at the API Gateway layer to reduce abuse and brute-force login attempts.
- Add request throttling rules by user role and API protocol.
- Add detailed gateway analytics for REST, GraphQL, SOAP, and FHIR traffic.
- Add audit log export support for compliance review.
- Add tamper-resistant audit logging with hash chaining.
- Add file-level access policies for CAD drawings based on project classification.
- Add approval workflow for restricted CAD design access.
- Add API versioning for REST, GraphQL schema updates, SOAP operations, and FHIR-style resources.
- Add automated API tests for authentication, authorization, and protocol-specific endpoints.
- Add CI/CD workflow for linting, testing, building, and deployment.
- Add production-grade secrets management for JWT signing keys and environment configuration.
- Add observability using structured logs, request tracing, and error monitoring.
- Add OpenAPI-style documentation for REST endpoints.
- Add downloadable API testing collection for REST, GraphQL, SOAP, and FHIR examples.
