const { pool } = require("../config/db");

// GET /api/attendance?date=YYYY-MM-DD&dept=&student_id=
exports.getAttendance = async (req, res) => {
  try {
    const { date, dept, student_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (date)       { where += " AND a.date = ?";             params.push(date); }
    if (student_id) { where += " AND a.student_id = ?";       params.push(student_id); }
    if (dept)       { where += " AND s.department = ?";       params.push(dept); }

    const [rows] = await pool.query(
      `SELECT a.id, a.student_id, a.date, a.status,
              s.name AS student_name, s.roll_no, s.department, s.year
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       ${where}
       ORDER BY a.date DESC, s.roll_no`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/summary?dept=&date=
exports.getSummary = async (req, res) => {
  try {
    const { dept, date } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (dept) { where += " AND s.department = ?"; params.push(dept); }
    if (date) { where += " AND a.date = ?";       params.push(date); }

    const [rows] = await pool.query(
      `SELECT
         COUNT(*)                                        AS total,
         SUM(a.status = 'Present')                      AS present,
         SUM(a.status = 'Absent')                       AS absent,
         SUM(a.status = 'Late')                         AS late,
         ROUND(SUM(a.status = 'Present') * 100 / COUNT(*), 1) AS rate
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       ${where}`,
      params
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/bulk  — mark entire day for a department
// body: { date, department, records: [{ student_id, status }] }
exports.bulkMark = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records) || records.length === 0)
      return res.status(400).json({ success: false, message: "date and records[] are required" });

    await conn.beginTransaction();
    for (const rec of records) {
      await conn.query(
        `INSERT INTO attendance (student_id, date, status, marked_by)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)`,
        [rec.student_id, date, rec.status || "Absent", req.admin?.id || null]
      );
    }
    await conn.commit();
    res.json({ success: true, message: `${records.length} records saved` });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    conn.release();
  }
};

// PATCH /api/attendance/:id  — update single record
exports.updateOne = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query("UPDATE attendance SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/student/:id — full history for one student
exports.studentHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.date, a.status
       FROM attendance a
       WHERE a.student_id = ?
       ORDER BY a.date DESC
       LIMIT 90`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
