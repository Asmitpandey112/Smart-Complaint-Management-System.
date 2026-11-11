# 🏛️ Smart Complaint Management System (SCMS 2.0)

> **AI-Powered Civic Grievance Triage, Live Kanban, and Multi-Role Municipal Dashboard**  
> Built with **React 18**, **Vite**, **Tailwind CSS**, and **Node.js / Express**.

---

## 📌 Overview

**Smart Complaint Management System (SCMS 2.0)** is a modern web application designed for civic councils and municipal organizations to streamline the reporting, automated routing, tracking, and resolution of citizen complaints.

It provides real-time AI-based grievance analysis, automated urgency scoring, SLA enforcement, an interactive drag-and-drop Kanban triage board, citizen feedback rating, and comprehensive analytical reporting.

---

## 🌟 Key Features

- 🤖 **Real-Time AI Auto-Triage**: Automatically analyzes complaint text as you type, extracting keywords, calculating priority scores (1–100), and auto-classifying into departments (*Public Works*, *Electrical*, *Water Supply*, *Sanitation*).
- ⏱️ **Dynamic SLA Enforcement**: Computes strict resolution deadlines according to hazard levels (Critical: 2h, High: 12h, Medium: 24h) with automated escalation.
- 📋 **Live Kanban Board**: Native drag-and-drop workflow across 4 status columns (*Pending*, *In Progress*, *Escalated*, *Resolved*) with instant backend state updates.
- 👥 **Multi-Role Portals**:
  - **Citizen / User**: File grievances with real-time AI preview, track audit timeline, and submit 5-star feedback & ratings.
  - **Municipal Admin**: Multi-department overview, KPI metrics, technician assignment, and CSV export.
  - **Field Staff / Technician**: Task queue, on-ground status updates, and resolution telemetry notes.
- 📊 **Analytics & Reports**: Visual CSAT ratings, average resolution times, department workload distribution, and CSV export.
- 🌓 **Modern UI/UX**: Persistent Dark / Light mode, interactive cursor-following tooltip tracker, and responsive mobile-ready layout.

---

## 📂 Project Architecture

The project is cleanly decoupled into dedicated **`backend/`** and **`frontend/`** services:

```text
smart-complaint-management-system/
├── backend/                       # Express.js REST API & Persistence
│   ├── data/                      # Persistent JSON database (complaints.json)
│   ├── public/                    # Fallback static views & client files
│   ├── package.json               # Backend dependencies & scripts
│   └── server.js                  # Express API server (port 3000)
│
├── frontend/                      # React 18 + Vite SPA
│   ├── src/                       # Components, pages, context providers & styles
│   ├── index.html                 # Single page application template
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tailwind.config.cjs        # Tailwind configuration & keyframe animations
│   └── vite.config.js             # Vite build & API proxy setup
│
├── package.json                   # Root orchestrator scripts
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, Express JSON parser
- **Database**: JSON flat-file storage (`data/complaints.json`) with auto-seeding

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

---

### Installation

Clone the repository and install dependencies for both services:

```bash
git clone https://github.com/Asmitpandey112/Smart-Complaint-Management-System..git
cd Smart-Complaint-Management-System.

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

---

### Running the Application

You can run both services easily from the root folder:

#### 1. Start the Backend API (Port 3000):
```bash
npm run server
# or from backend folder: cd backend && npm start
```

#### 2. Start the Frontend Dev Server (Port 5173):
Open another terminal:
```bash
npm run client
# or from frontend folder: cd frontend && npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

### 🎭 Demo Accounts / Role Switching

You can switch roles directly from the top navigation bar or log in as:

| Role | Name | Capabilities |
| :--- | :--- | :--- |
| **Citizen / User** | Asmit Kumar | File complaints, live AI preview, track timeline, submit ratings |
| **Municipal Admin** | Chief Officer Admin | Drag-and-drop Kanban, assign staff, view analytics, export CSV |
| **Field Staff** | Officer Rohit Sharma | Action queue, update status to In Progress / Resolved |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
