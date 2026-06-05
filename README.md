# CADShield Gateway

![RESTful APIs](https://img.shields.io/badge/API-RESTful-0ea5e9?style=for-the-badge)
![GraphQL](https://img.shields.io/badge/API-GraphQL-e10098?style=for-the-badge)
![SOAP](https://img.shields.io/badge/API-SOAP%20XML-10b981?style=for-the-badge)
![FHIR](https://img.shields.io/badge/Protocol-FHIR%20JSON-a78bfa?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-OAuth%202.0%20%26%20JWT-6366f1?style=for-the-badge)
![MFA](https://img.shields.io/badge/MFA-Verified-f59e0b?style=for-the-badge)

A secure portal representing a centralized **API Gateway** for a CAD (Computer-Aided Design) engineering company. It demonstrates how sensitive design drawing metadata is protected and served across multiple API protocols using standard enterprise security.

---

## 💡 Why This Project Exists
In industrial engineering, CAD drawing files (`.dwg`) represent high-value intellectual property. Exposing raw database servers to drawing clients is a security risk. 

This project places an **API Gateway** in front of the design vault. The gateway intercepts all requests, enforces identity scopes via **OAuth 2.0 and MFA**, issues signed **JWT tokens**, routes traffic across multiple API styles (REST, GraphQL, SOAP, FHIR), and records all interactions in a compliance **Audit Log**.

---

## ✨ Features
*   **Dual-Presentation Dashboard**: Includes a **Visual Mode** with diagrams, telemetry, and employee badge mockups for stakeholders, alongside a **Developer Code Mode** for technical inspections.
*   **Security Gateway**: Simulates credential authorization, MFA passcodes, and role-based JWT claims (Admin, Engineer, Viewer, Auditor).
*   **Interactive API Testing**: Interactive sandbox allowing you to visually trigger and inspect REST, GraphQL, SOAP vault locks, and FHIR interoperability formats.
*   **Compliance Audit Trail**: Dynamically tracks access events, success logs, and invalid access attempts.

---

## 🚀 How to Run Locally

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
*Runs on: `http://localhost:5000`*

### 2. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*Runs on: `http://localhost:5173`*

---

## 🔑 Demo Access Credentials

| Name | Username / Email | Password | Role | MFA Code |
| :--- | :--- | :--- | :--- | :--- |
| **CAD Engineer** | `engineer@cadshield.com` | `password123` | `ENGINEER` | `123456` |
| **Admin User** | `admin@cadshield.com` | `password123` | `ADMIN` | `123456` |
| **CAD Viewer** | `viewer@cadshield.com` | `password123` | `VIEWER` | `123456` |
| **API Auditor** | `auditor@cadshield.com` | `password123` | `AUDITOR` | `123456` |

---

## 📝 Resume Bullet Points

*   Built CADShield Gateway, a secure CAD design access dashboard using RESTful APIs, GraphQL, SOAP, FHIR-style JSON, OAuth 2.0, JWT, API Gateway, Multi-Factor Authentication, and JSON.
*   Implemented OAuth 2.0-style login, MFA verification, JWT token generation, and protected API access for CAD project metadata.
*   Developed working REST, GraphQL, SOAP, and FHIR JSON API demonstrations through a centralized API Gateway.
*   Created a minimal dashboard to test secured APIs, view CAD projects, inspect JWT payloads, and monitor audit logs.
