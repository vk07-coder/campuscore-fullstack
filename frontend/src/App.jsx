import { useState, useEffect } from "react";
import { api } from "./api";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Staff } from "./pages/Staff";
import { Attendance } from "./pages/Attendance";
import { Sidebar } from "./components/Sidebar";
import { C, F } from "./theme";

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    if (token) {
      api.me().then((r) => setAdmin(r.admin)).catch(() => localStorage.removeItem("cc_token"));
    }
  }, []);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = C.bg;
    document.body.style.fontFamily = F.body;
  }, []);

  const logout = () => {
    localStorage.removeItem("cc_token");
    setAdmin(null);
    setPage("dashboard");
  };

  if (!admin) return <Login onLogin={setAdmin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text }}>
      <Sidebar active={page} setActive={setPage} onLogout={logout} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: "100%" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "students" && <Students />}
        {page === "staff" && <Staff />}
        {page === "attendance" && <Attendance />}
      </main>
    </div>
  );
}
