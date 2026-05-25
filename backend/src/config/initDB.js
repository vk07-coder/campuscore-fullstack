const bcrypt = require("bcryptjs");
const { pool } = require("./db");

const initDB = async () => {
  const conn = await pool.getConnection();
  try {
    // ── 1. admins ─────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        username   VARCHAR(50)  NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // ── 2. students ───────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS students (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        roll_no    VARCHAR(20)  NOT NULL UNIQUE,
        department VARCHAR(100) NOT NULL,
        year       VARCHAR(10),
        email      VARCHAR(100),
        phone      VARCHAR(15),
        status     ENUM('Active','Inactive','Graduated') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // ── 3. staff ──────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        emp_id     VARCHAR(20)  NOT NULL UNIQUE,
        department VARCHAR(100) NOT NULL,
        role       VARCHAR(50),
        email      VARCHAR(100),
        phone      VARCHAR(15),
        status     ENUM('Active','On Leave','Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // ── 4. attendance ─────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        date       DATE NOT NULL,
        status     ENUM('Present','Absent','Late') DEFAULT 'Absent',
        marked_by  INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_student_date (student_id, date),
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (marked_by)  REFERENCES admins(id)   ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // ── Seed admin ────────────────────────────────────────────────────────────
    const [rows] = await conn.query("SELECT id FROM admins LIMIT 1");
    if (rows.length === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const plain    = process.env.ADMIN_PASSWORD || "admin123";
      const hashed   = await bcrypt.hash(plain, 10);
      await conn.query("INSERT INTO admins (username, password) VALUES (?, ?)", [username, hashed]);
      console.log(`🌱  Admin seeded  →  ${username} / ${plain}`);
    }

    // ── Seed sample students ──────────────────────────────────────────────────
    const [stRows] = await conn.query("SELECT id FROM students LIMIT 1");
    if (stRows.length === 0) {
      const students = [
        ["Priya Sharma",  "CS2201", "Computer Science", "2nd", "priya@college.edu",  "9876543210", "Active"],
        ["Arjun Mehta",   "EC2105", "Electronics",       "1st", "arjun@college.edu",  "9123456780", "Active"],
        ["Kavya Reddy",   "ME3301", "Mechanical",        "3rd", "kavya@college.edu",  "9988776655", "Active"],
        ["Rohan Das",     "CS2308", "Computer Science", "3rd", "rohan@college.edu",  "9001234567", "Inactive"],
        ["Sneha Patel",   "CV4401", "Civil",             "4th", "sneha@college.edu",  "9876001234", "Active"],
      ];
      for (const s of students) {
        await conn.query(
          "INSERT INTO students (name, roll_no, department, year, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
          s
        );
      }
      console.log("🌱  Sample students seeded");
    }

    // ── Seed sample staff ─────────────────────────────────────────────────────
    const [sfRows] = await conn.query("SELECT id FROM staff LIMIT 1");
    if (sfRows.length === 0) {
      const staffList = [
        ["Dr. Suresh Kumar", "FAC001", "Computer Science", "HOD",                "suresh@college.edu", "9700112233", "Active"],
        ["Prof. Anita Nair", "FAC002", "Electronics",       "Professor",          "anita@college.edu",  "9800223344", "Active"],
        ["Mr. Vikram Singh", "FAC003", "Mechanical",        "Lecturer",           "vikram@college.edu", "9600334455", "Active"],
        ["Dr. Meera Iyer",   "FAC004", "Civil",             "Assistant Professor","meera@college.edu",  "9500445566", "Active"],
      ];
      for (const s of staffList) {
        await conn.query(
          "INSERT INTO staff (name, emp_id, department, role, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
          s
        );
      }
      console.log("🌱  Sample staff seeded");
    }

    console.log("✅  Database initialised");
  } finally {
    conn.release();
  }
};

module.exports = initDB;
