# CareerSignal 🌐📡

**CareerSignal** is an AI-powered national and international job intelligence and employment platform. It extracts, analyzes, and surfaces real-time corporate employment signals, hiring surges, and workforce shifts across global tech hubs while providing direct, role-specific job application and corporate interview routing.

---

## ✨ Key Features

- **🎯 Direct-To-Job Application Routing**:
  - Direct deep-links to specific open positions (e.g., *Software Analyst*, *Product Designer*, *UI/UX Associate*) on official corporate portals (Microsoft, Adobe, NVIDIA, Amazon, Google, etc.), avoiding generic career homepages.
- **🎓 Dual-Persona Application Portal**:
  - **Student / Fresher Track**: University credentials, degree, graduation year, CGPA, hackathons, and project portfolio.
  - **Experienced Professional Track**: Current employer, current title, years of experience, notice period, and system architecture credentials.
  - Quick 1-click test profiles (`🎓 Priya - IIT Student` and `💼 Rahul - Systems Analyst / Designer`).
- **🛡️ Automated ATS Verification & Guaranteed Acceptance**:
  - Automated resume parsing and 96% ATS compatibility rating.
  - Generates official admission passes (`ACCEPT-MICR-2026-XXXX`).
  - Confirms Round 1 Virtual Interview schedule and assigns an official corporate recruiter.
  - Downloadable admission ticket pass (`.txt`).
- **🗺️ Global Radar Map & Labor Analytics**:
  - Interactive world map visualizing corporate hiring clusters and workforce transitions.
  - High-fidelity dark mode dashboard with vacancy statistics and real-time networking messages.

---

## 🏗️ Repository Architecture

```
CareerSignal/
├── backend/            # FastAPI REST API, SQLite/PostgreSQL, Seed data & AI Extractor
├── web/                # Next.js 14 (App Router, TypeScript) High-Fidelity UI Dashboard
├── mobile/             # React Native + Expo (TypeScript) cross-platform mobile client
├── docs/               # Architecture diagrams, API specs, and database designs
├── run-all.bat         # 1-click Windows launcher for both Frontend & Backend
├── run-frontend.bat    # Standalone Frontend launcher (port 3000)
└── run-backend.bat     # Standalone FastAPI launcher (port 8000)
```

---

## 🚀 Quick Start (Windows)

### 1-Click Launch (Recommended)
Double-click:
👉 `run-all.bat`

This opens both the frontend and backend in their own terminal windows:
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend:** [http://localhost:8000](http://localhost:8000) (Interactive Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs))

---

### Manual Launch

#### 1. Next.js Web Frontend
```bash
cd web
npm run dev
```

#### 2. FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

---

## 📚 Documentation
- [System Architecture](file:///c:/Users/SAI%20SASIDHAR/OneDrive/Desktop/CareerSignal/docs/architecture.md)
- [API Contracts](file:///c:/Users/SAI%20SASIDHAR/OneDrive/Desktop/CareerSignal/docs/api-contracts.md)
- [Database Design](file:///c:/Users/SAI%20SASIDHAR/OneDrive/Desktop/CareerSignal/docs/database-design.md)

