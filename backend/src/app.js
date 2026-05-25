require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const staffRoutes = require("./routes/staff");
const attendanceRoutes = require("./routes/attendance");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date() }));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

module.exports = app;
