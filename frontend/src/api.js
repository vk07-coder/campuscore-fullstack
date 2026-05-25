// src/api.js  — centralised axios-free fetch wrapper
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("cc_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const request = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  // Auth
  login:  (u, p)   => request("POST", "/auth/login", { username: u, password: p }),
  me:     ()        => request("GET",  "/auth/me"),

  // Dashboard
  stats:  ()        => request("GET",  "/dashboard"),

  // Students
  getStudents: (q="") => request("GET", `/students${q}`),
  createStudent: (d)  => request("POST",   "/students",   d),
  updateStudent: (id, d) => request("PUT", `/students/${id}`, d),
  deleteStudent: (id)    => request("DELETE", `/students/${id}`),

  // Staff
  getStaff:     (q="") => request("GET", `/staff${q}`),
  createStaff:  (d)    => request("POST",   "/staff",   d),
  updateStaff:  (id,d) => request("PUT",   `/staff/${id}`, d),
  deleteStaff:  (id)   => request("DELETE", `/staff/${id}`),

  // Attendance
  getAttendance:  (q="") => request("GET", `/attendance${q}`),
  getSummary:     (q="") => request("GET", `/attendance/summary${q}`),
  bulkMark:       (d)    => request("POST", "/attendance/bulk", d),
  studentHistory: (id)   => request("GET", `/attendance/student/${id}`),
};
