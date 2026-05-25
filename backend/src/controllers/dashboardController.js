const { pool } = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [[{ students }]] = await pool.query("SELECT COUNT(*) AS students FROM students");
    const [[{ staff }]]    = await pool.query("SELECT COUNT(*) AS staff FROM staff");
    const [[{ depts }]]    = await pool.query("SELECT COUNT(DISTINCT department) AS depts FROM students");

    // Overall attendance rate (last 30 days)
    const [[att]] = await pool.query(
      `SELECT
         ROUND(SUM(status='Present') * 100 / NULLIF(COUNT(*),0), 1) AS rate
       FROM attendance
       WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    // Dept breakdown
    const [deptBreakdown] = await pool.query(
      `SELECT department, COUNT(*) AS count FROM students GROUP BY department ORDER BY count DESC`
    );

    // Recent students
    const [recentStudents] = await pool.query(
      "SELECT id, name, roll_no, department, status FROM students ORDER BY created_at DESC LIMIT 5"
    );

    // Today's attendance summary
    const [[todaySummary]] = await pool.query(
      `SELECT
         SUM(status='Present') AS present,
         SUM(status='Absent')  AS absent,
         COUNT(*)              AS total
       FROM attendance WHERE date = CURDATE()`
    );

    res.json({
      success: true,
      data: {
        counts: { students, staff, departments: depts, attendanceRate: att.rate ?? 0 },
        deptBreakdown,
        recentStudents,
        todaySummary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
