# 🎓 CampusCore — College Management System

Full-stack app: **React** frontend + **Node.js/Express** backend + **MySQL** database.

---

## 📁 Project Structure

```
college-mgmt/
├── backend/          ← Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          ← MySQL pool
│   │   │   └── initDB.js      ← Table creation + seed data
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── staffController.js
│   │   │   ├── attendanceController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   └── auth.js        ← JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── staff.js
│   │   │   ├── attendance.js
│   │   │   └── dashboard.js
│   │   └── server.js          ← Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/         ← React SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api.js             ← Fetch wrapper for all endpoints
    │   ├── App.js             ← Full UI (Login, Dashboard, Students, Staff, Attendance)
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm

---

## 🚀 Setup — Step by Step

### 1. Create MySQL Database

```sql
CREATE DATABASE campuscore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campuscore
JWT_SECRET=some_long_random_secret_here
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. Install & Start Backend

```bash
cd backend
npm install
npm run dev       # development (nodemon)
# or
npm start         # production
```

On first run the server will:
- ✅ Connect to MySQL
- ✅ Create all tables automatically
- ✅ Seed admin user (`admin` / `admin123`)
- ✅ Seed sample students & staff

### 4. Install & Start Frontend

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000** in your browser.

---

## 🔌 API Endpoints

All routes except `/api/auth/login` require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/auth/me` | Current admin info |
| GET | `/api/dashboard` | Stats, dept breakdown, recent students |
| GET | `/api/students` | List students (`?search=&dept=&page=&limit=`) |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/staff` | List staff |
| POST | `/api/staff` | Create staff |
| PUT | `/api/staff/:id` | Update staff |
| DELETE | `/api/staff/:id` | Delete staff |
| GET | `/api/attendance` | Get records (`?date=&dept=&student_id=`) |
| GET | `/api/attendance/summary` | Aggregated stats |
| POST | `/api/attendance/bulk` | Bulk mark attendance |
| GET | `/api/attendance/student/:id` | Student attendance history |

---

## 🗄️ Database Schema

```
admins      → id, username, password, created_at
students    → id, name, roll_no, department, year, email, phone, status, created_at, updated_at
staff       → id, name, emp_id, department, role, email, phone, status, created_at, updated_at
attendance  → id, student_id (FK), date, status, marked_by (FK), created_at, updated_at
             UNIQUE KEY (student_id, date)
```

---

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

Change `ADMIN_PASSWORD` in `.env` before deploying to production.
