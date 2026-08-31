# 🏛️ SmartCivic — Full-Stack Citizen Grievance & Municipal Resolution Platform

**Smart Civic Issue Reporting and Resolution Platform** for Bengaluru Municipal Zone C. Designed and developed by **Code Morphicx**.

---

## 📁 Project Root Directory

```text
c:\Users\Bharath S\OneDrive\Desktop\smart civic
```

---

## 📂 Complete Project Structure

```text
smart civic/
├── index.html                           # Modern HTML5 Single Page Application entry point
├── styles.css                           # Glassmorphism design system, Cyber-Civic dark theme
├── app.js                               # React 18 frontend router, state engine, UI components
├── codemorphicx_logo.jpg                # Code Morphicx brand badge
├── start_smartcivic.bat                 # One-click dual server launcher for Windows
├── run_all_tests.bat                    # One-click test suite executor
├── package.json                         # Project manifest
├── README.md                            # Complete technical documentation
│
└── backend/                             # REST API & Database Backend Services
    ├── server.py                        # Standalone Python REST API Server (Port 5000)
    ├── server.js                        # Node.js + Express REST API Server
    ├── .env                             # Environment configuration (JWT secret, ports)
    ├── package.json                     # Express backend dependencies
    ├── config/                          # Database connection configuration
    ├── controllers/                     # Complaint, Auth, and Admin controllers
    ├── middleware/                      # JWT auth guard, role verification & file upload
    ├── models/                          # Mongoose / MongoDB schemas (User, Complaint, Notification)
    ├── routes/                          # API route definitions
    ├── services/                        # AI SLA automated triage service
    ├── utils/                           # JWT token generators & formatters
    ├── uploads/                         # Stored evidence photos & attachments
    └── tests/                           # Automated test suites
        ├── test_runner.py               # 20-Point End-to-End integration test runner
        ├── verify_login_persistence.py  # 12-Step login persistence & profile state test
        ├── verify_image_upload_and_isolation.py # Image upload & citizen isolation test
        ├── verify_citizen_vs_guest_complaints.py # Citizen vs Guest ownership test
        └── verify_role_portals_and_login_security.py # Role portals & authentication security test
```

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launcher (Windows)
Simply double-click:
```text
start_smartcivic.bat
```
This automatically starts the REST API server on Port 5000, the Frontend server on Port 8000, and opens your default browser at **`http://127.0.0.1:8000`**!

---

### Option 2: Manual Terminal Startup

**Terminal 1 — Backend REST API Server:**
```bash
cd "c:\Users\Bharath S\OneDrive\Desktop\smart civic"
py backend/server.py
```
> Runs REST API on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

**Terminal 2 — Frontend Web Server:**
```bash
cd "c:\Users\Bharath S\OneDrive\Desktop\smart civic"
py -m http.server 8000
```
> Serves web application on `http://127.0.0.1:8000`.

---

## 🔑 Portal Access & Role Credentials

| Portal | Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen Portal** | `citizen` | *Register new account or use existing* | *Your password* | Report issues with images, view *My Complaints* (strictly own tickets), track complaints, update profile, view notifications |
| **Department Portal** | `dept_officer` | `officer.pwd@smartcivic.gov.in` | `officer123` | Department dashboard, pre-filtered view of assigned department complaints, update status (*Verified*, *Assigned*, *In Progress*, *Resolved*), assign field crew & dispatch notifications |
| **Admin Portal** | `admin` | `admin@smartcivic.gov.in` | `adminpassword123` | Central Command, view **ALL** complaints across the city (Citizen A + Citizen B + Guest), oversee zonal statistics (88% SLA), manage system |

---

## 🔒 Security & Ownership Model

1. **Authentication**: Signed JSON Web Tokens (JWT) passed in `Authorization: Bearer <token>` headers.
2. **Citizen Complaint Isolation**:
   - Logged-in citizen tickets have `createdBy: user._id` and `isGuest: false`.
   - `GET /api/complaints/user` strictly queries complaints matching the user's ID.
   - Citizen A sees **ONLY** Citizen A's complaints.
   - Citizen B sees **ONLY** Citizen B's complaints.
3. **Guest Complaints**:
   - Submissions without token have `createdBy: null` and `isGuest: true`.
   - Never assigned to or visible in any citizen's *My Complaints*.
4. **Admin Access**:
   - Admins see **ALL** complaints across the city.
5. **Role Guards**:
   - Endpoints like `/api/admin/stats` reject citizen tokens with `HTTP 403 Forbidden`.
   - Login portals enforce explicit role checks before granting access.

---

## 📸 Complaint Evidence Photo Upload

- Supports `.jpg`, `.jpeg`, `.png`, and `.webp` image formats up to 10MB.
- Uses `multipart/form-data` and `FormData` on frontend.
- Files are saved on disk to `backend/uploads/evidence-<timestamp>.<ext>`.
- Served statically at `http://localhost:5000/uploads/<filename>`.
- Displayed in evidence galleries and lightboxes across Citizen, Department, and Admin views.

---

## 🧪 Automated Testing

To run all automated test suites:
```bash
# Using batch launcher
run_all_tests.bat

# Or run individual test scripts
py backend/tests/test_runner.py
py backend/tests/verify_login_persistence.py
py backend/tests/verify_image_upload_and_isolation.py
py backend/tests/verify_citizen_vs_guest_complaints.py
py backend/tests/verify_role_portals_and_login_security.py
```

### Test Suite Summary:
* **`test_runner.py`**: 20/20 End-to-End integration test cases passing (TC01-TC20).
* **`verify_login_persistence.py`**: 12/12 steps verifying account restoration & state persistence.
* **`verify_image_upload_and_isolation.py`**: Multipart image uploads and two-citizen complaint isolation verified.
* **`verify_citizen_vs_guest_complaints.py`**: Strict separation between guest complaints and citizen accounts verified.
* **`verify_role_portals_and_login_security.py`**: Role-based access, credential authentication, and 403 route protection verified.

---

## 💼 Attribution

Designed, engineered, and maintained by **Code Morphicx**.
© 2026 SmartCivic Platform. All rights reserved.
