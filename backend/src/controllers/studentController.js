const { pool } = require("../config/db");

// GET /api/students?search=&dept=&page=1&limit=20
exports.getAll = async (req, res) => {
  try {
    const { search = "", dept = "", page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = "WHERE 1=1";

    if (search) {
      where += " AND (name LIKE ? OR roll_no LIKE ? OR email LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (dept) {
      where += " AND department = ?";
      params.push(dept);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM students ${where}`, params
    );
    const [rows] = await pool.query(
      `SELECT * FROM students ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, total, page: parseInt(page), data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/students/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/students
exports.create = async (req, res) => {
  try {
    const { name, roll_no, department, year, email, phone, status } = req.body;
    if (!name || !roll_no || !department)
      return res.status(400).json({ success: false, message: "name, roll_no, department are required" });

    const [result] = await pool.query(
      "INSERT INTO students (name, roll_no, department, year, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, roll_no, department, year || null, email || null, phone || null, status || "Active"]
    );
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ success: false, message: "Roll number already exists" });
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  try {
    const { name, roll_no, department, year, email, phone, status } = req.body;
    const [check] = await pool.query("SELECT id FROM students WHERE id = ?", [req.params.id]);
    if (!check.length) return res.status(404).json({ success: false, message: "Student not found" });

    await pool.query(
      "UPDATE students SET name=?, roll_no=?, department=?, year=?, email=?, phone=?, status=? WHERE id=?",
      [name, roll_no, department, year || null, email || null, phone || null, status || "Active", req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ success: false, message: "Roll number already exists" });
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  try {
    const [check] = await pool.query("SELECT id FROM students WHERE id = ?", [req.params.id]);
    if (!check.length) return res.status(404).json({ success: false, message: "Student not found" });
    await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
