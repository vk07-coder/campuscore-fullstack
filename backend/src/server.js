require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const { testConnection } = require("./config/db");
const initDB             = require("./config/initDB");

const authRoutes       = require("./routes/auth");
const studentRoutes    = require("./routes/students");
const staffRoutes      = require("./routes/staff");
const attendanceRoutes = require("./routes/attendance");
const dashboardRoutes  = require("./routes/dashboard");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/students",   studentRoutes);
app.use("/api/staff",      staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard",  dashboardRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Boot ──────────────────────────────────────────────────────────────────────
(async () => {
  await testConnection();
  await initDB();
  app.listen(PORT, () => {
    console.log(`\n🚀  CampusCore API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health\n`);
  });
})();
