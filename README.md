# Enterprise Role Authentication System (React + Express + MongoDB + JWT)

Full-stack application featuring JWT authentication, role-based access control (**Employee** and **Manager** roles), and MongoDB database persistence via Mongoose.

---

## 🏗️ Architecture & Features

- **Frontend (React + Vite)**:
  - Modern, responsive Dark Theme UI with glassmorphic cards and micro-animations.
  - Tabbed **Sign In** and **Sign Up** interface with role selection (`Employee` / `Manager`).
  - React Context API for global session management and JWT token lifecycle (`localStorage`).
  - Dedicated **Employee Workspace**: shift status, assigned project tracker, and announcements.
  - Dedicated **Manager Administration Center**: live MongoDB user directory, organizational metrics, and alerts.
  - Manager preview toggle to switch between Employee and Manager views.

- **Backend (Node.js + Express)**:
  - Secure password hashing using **bcryptjs**.
  - **JWT (JSON Web Token)** generation, verification, and role guard middleware (`requireRole('manager')`).
  - MongoDB database connection using **Mongoose** (`mongoose.connect`).
  - User model with schema validation, role constraints (`['employee', 'manager']`), and timestamps.
  - Protected API endpoints for authentication (`/api/auth/*`) and dashboards (`/api/dashboard/*`).

---

## 🚀 Quick Start Guide

### 1. Database Setup (MongoDB)

Ensure MongoDB is running locally (e.g. `mongod` service, MongoDB Compass) or use MongoDB Atlas.

Configure `backend/.env`:
```env
PORT=5000
JWT_SECRET=supersecretjwtkey_micron_2026_change_in_production
JWT_EXPIRES_IN=24h

# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/micron_auth
```

---

### 2. Backend Installation & Run

```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

---

### 3. Frontend Installation & Run

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000` (proxies `/api` requests to backend at port 5000).

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user (name, email, password, role) | Public |
| `POST` | `/api/auth/login` | Log in user and receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active user session details | Authenticated |
| `GET` | `/api/dashboard/employee` | Get employee workspace details | Employee & Manager |
| `GET` | `/api/dashboard/manager` | Get manager metrics & user directory | Manager Only |
| `GET` | `/api/health` | Backend health check | Public |
