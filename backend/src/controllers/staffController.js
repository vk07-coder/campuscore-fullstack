const { pool } = require("../config/db");

// GET /api/staff?search=&dept=&page=1&limit=50
exports.getAll = async (req, res) => {
  try {
    const { search = "", dept = "", page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = "WHERE 1=1";

    if (search) {
      where += " AND (name LIKE ? OR emp_id LIKE ? OR email LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (dept) {
      where += " AND department = ?";
      params.push(dept);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM staff ${where}`, params
    );
    const [rows] = await pool.query(
      `SELECT * FROM staff ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    res.json({ success: true, total, page: parseInt(page), data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/staff/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM staff WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/staff
exports.create = async (req, res) => {
  try {
    const { name, emp_id, department, role, email, phone, status } = req.body;
    if (!name || !emp_id || !department)
      return res.status(400).json({ success: false, message: "name, emp_id, department are required" });

    const [result] = await pool.query(
      "INSERT INTO staff (name, emp_id, department, role, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, emp_id, department, role || null, email || null, phone || null, status || "Active"]
    );
    const [rows] = await pool.query("SELECT * FROM staff WHERE id = ?", [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ success: false, message: "Employee ID already exists" });
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/staff/:id
exports.update = async (req, res) => {
  try {
    const { name, emp_id, department, role, email, phone, status } = req.body;
    const [check] = await pool.query("SELECT id FROM staff WHERE id = ?", [req.params.id]);
    if (!check.length) return res.status(404).json({ success: false, message: "Staff not found" });

    await pool.query(
      "UPDATE staff SET name=?, emp_id=?, department=?, role=?, email=?, phone=?, status=? WHERE id=?",
      [name, emp_id, department, role || null, email || null, phone || null, status || "Active", req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM staff WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ success: false, message: "Employee ID already exists" });
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/staff/:id
exports.remove = async (req, res) => {
  try {
    const [check] = await pool.query("SELECT id FROM staff WHERE id = ?", [req.params.id]);
    if (!check.length) return res.status(404).json({ success: false, message: "Staff not found" });
    await pool.query("DELETE FROM staff WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Staff deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
