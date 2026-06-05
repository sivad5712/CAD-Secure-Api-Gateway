# CADShield Gateway

🚀 **Live Interactive Demo**: [https://cad-secure-api-gateway-xifg.vercel.app](https://cad-secure-api-gateway-xifg.vercel.app)

![RESTful APIs](https://img.shields.io/badge/API-RESTful-0ea5e9?style=for-the-badge)
![GraphQL](https://img.shields.io/badge/API-GraphQL-e10098?style=for-the-badge)
![SOAP](https://img.shields.io/badge/API-SOAP%20XML-10b981?style=for-the-badge)
![FHIR](https://img.shields.io/badge/Protocol-FHIR%20JSON-a78bfa?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-OAuth%202.0%20%26%20JWT-6366f1?style=for-the-badge)
![MFA](https://img.shields.io/badge/MFA-Verified-f59e0b?style=for-the-badge)

A complete, working **API Gateway & Security Dashboard** designed for a CAD (Computer-Aided Design) engineering environment. This application demonstrates how highly sensitive design drawing metadata can be protected and audited at the gateway layer while supporting multiple API protocols (REST, GraphQL, SOAP XML, and FHIR JSON) over a single domain.

---

## 🔑 Demo Access Credentials
Use these credentials to log in, bypass the MFA check, and test different user permission roles on the live Vercel portal:

| Target User Profile | Username / Email | Password | Assigned Role | MFA Code |
| :--- | :--- | :--- | :--- | :--- |
| **CAD Engineer** | `engineer@cadshield.com` | `password123` | `ENGINEER` | `123456` |
| **Admin User** | `admin@cadshield.com` | `password123` | `ADMIN` | `123456` |
| **CAD Viewer** | `viewer@cadshield.com` | `password123` | `VIEWER` | `123456` |
| **API Auditor** | `auditor@cadshield.com` | `password123` | `AUDITOR` | `123456` |

*Note: In production environments, embedding credentials in documentation is not recommended. These are mock sandboxed credentials provided strictly for testing and validation.*

---

## ⚙️ API Gateway Routing & Security Spec

The centralized API Gateway interceptor enforces route routing rules, request translation, and role-based access control (RBAC). Below is the complete gateway mapping specification:

| Route Endpoint | API Protocol | Auth Security Filters | Authorized Roles | Description / Operation |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/auth/login` | REST / JSON | None (Public) | Anyone | Step 1: Login. Returns OAuth Code + MFA challenge session |
| `POST /api/auth/verify-mfa` | REST / JSON | None (Public) | Anyone | Step 2: MFA verification. Returns signed Bearer JWT token |
| `GET /api/gateway/routes` | REST / JSON | None (Public) | Anyone | Discovers active gateway paths & security policies |
| `GET /api/cad-projects` | REST / JSON | JWT Signature Filter | `ADMIN`, `ENGINEER`, `VIEWER` | Fetches catalog of all stored CAD drawing assets |
| `GET /api/cad-projects/:id` | REST / JSON | JWT Signature Filter | `ADMIN`, `ENGINEER`, `VIEWER` | Retrieves metadata details of a specific project |
| `POST /api/cad-projects` | REST / JSON | JWT + RBAC Check | `ADMIN`, `ENGINEER` | Registers a new drawing file (Blocked for Viewer/Auditor) |
| `POST /graphql` | GraphQL Query | JWT Signature Filter | `ADMIN`, `ENGINEER`, `VIEWER` | Fetches custom optimized drawing data columns |
| `POST /graphql` | GraphQL Mutation| JWT + RBAC Check | `ADMIN`, `ENGINEER` | Mutation resolver to insert new drawing metadata |
| `POST /soap/cad-vault` | SOAP / XML | JWT Signature Filter | `ADMIN`, `ENGINEER` | Operations: `GetDrawingStatus`, `LockDrawing`, `UnlockDrawing` |
| `GET /api/fhir/cad-designs` | FHIR / JSON | JWT Signature Filter | `ADMIN`, `ENGINEER`, `VIEWER` | Maps catalog drawings to standard HL7 FHIR CADDesign subjects |
| `GET /api/audit-logs` | REST / JSON | JWT + RBAC Check | `ADMIN`, `AUDITOR` | Fetches security audit trail logs (Blocked for Engineer/Viewer) |

---

## 💡 Why This Project Exists (Business Scenario)
In industrial engineering, CAD drawing files (`.dwg` formats) contain intellectual property such as factory blueprints, electrical panels, and machinery layouts. Exposing database schemas directly to client computers is a major security vulnerability. 

This project places an **API Gateway** in front of the design vault. The gateway:
1.  **Secures the Edge**: Forces users to log in using **OAuth 2.0 credentials** and verify their session via **MFA** before generating a cryptographically signed **JWT token**.
2.  **Authorizes Routes**: Evaluates the JWT claims in microseconds to check user roles (e.g., preventing a `VIEWER` from registering new projects, while allowing an `ENGINEER`).
3.  **Translates Protocols**: Translates incoming requests so that legacy XML systems speaking **SOAP**, modern web clients speaking **GraphQL**, internal microservices speaking **REST**, and external compliance entities speaking **FHIR JSON** can communicate securely.
4.  **Audits Activity**: Appends every single gateway transaction to a tamper-proof **Audit Trail**.

---

## ✨ Features

- **Stakeholder Presentation Flow**:
  - **Visual Mode**: High-level, interactive visual blocks showing simulated gateway telemetries (latency, success rates, active sessions), visual padlock locking mechanics for SOAP, and a digital security ID badge representation of the JWT.
  - **Developer Mode**: Code editors exposing the raw JSON/XML payloads processed by the gateway.
- **RESTful CRUD**: Clean endpoints to query and create drawings metadata.
- **GraphQL Engine**: Runs queries against schema resolvers to fetch only the requested properties, demonstrating data bandwidth optimization.
- **SOAP Vault Locks**: Parses XML body envelopes to check status, acquire lock, or release locks on drawings.
- **FHIR Interoperability**: Maps CAD properties to official HL7 FHIR CADDesign subject reference definitions.

---

## 🛠️ How to Run Locally

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org) installed on your system.

### 2. Startup Commands
Open two separate terminal windows:

#### Terminal 1: Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend API server launches on: `http://localhost:5000`*

#### Terminal 2: Frontend Dashboard Portal
```bash
cd frontend
npm install
npm run dev
```
*The frontend dev server launches on: `http://localhost:5173`*

---

## ☁️ How to Deploy on Vercel (Step-by-Step)
You can deploy this entire monorepo to Vercel in less than 2 minutes using Vercel's multi-project configuration:

1.  **Push to GitHub**: Push this repository to your GitHub account.
2.  **Import to Vercel**: 
    - Go to your [Vercel Dashboard](https://vercel.com/new).
    - Choose the repository `CAD-Secure-Api-Gateway` and click **Import**.
3.  **Automatic Detection**:
    - Vercel will scan the root folder and find the [vercel.json](vercel.json) file.
    - It will automatically configure the **Vite Frontend** service at `/` and the **Express Backend** service at `/_/backend` as serverless functions.
4.  **Click Deploy**: Vercel will build both folders and provide a single live URL for your stakeholders!

---

## 📝 Resume Bullet Points

- Built CADShield Gateway, a secure CAD design access dashboard using RESTful APIs, GraphQL, SOAP, FHIR-style JSON, OAuth 2.0, JWT, API Gateway, Multi-Factor Authentication, and JSON.
- Implemented OAuth 2.0-style login, MFA verification, JWT token generation, and protected API access for CAD project metadata.
- Developed working REST, GraphQL, SOAP, and FHIR JSON API demonstrations through a centralized API Gateway.
- Created a minimal dashboard to test secured APIs, view CAD projects, inspect JWT payloads, and monitor audit logs.
