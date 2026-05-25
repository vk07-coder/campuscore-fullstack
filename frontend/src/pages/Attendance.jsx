import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../hooks/useToast";
import { Badge } from "../components/Badge";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { SectionHeader } from "../components/SectionHeader";
import { Toast } from "../components/Toast";
import { C, F, DEPARTMENTS } from "../theme";

export const Attendance = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stRes, attRes, sumRes] = await Promise.all([
        api.getStudents(`?dept=${encodeURIComponent(dept)}`),
        api.getAttendance(`?date=${date}&dept=${encodeURIComponent(dept)}`),
        api.getSummary(`?date=${date}&dept=${encodeURIComponent(dept)}`),
      ]);
      setStudents(stRes.data.filter((s) => s.status === "Active"));
      const map = {};
      attRes.data.forEach((a) => { map[a.student_id] = a.status; });
      setAttendance(map);
      setSummary(sumRes.data);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [date, dept, showToast]);

  const [summary, setSummary] = useState(null);

  useEffect(() => { load(); }, [load]);

  const toggle = (id, status) => setAttendance((prev) => ({ ...prev, [id]: status }));
  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const saveAtt = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({ student_id: s.id, status: attendance[s.id] || "Absent" }));
      await api.bulkMark({ date, records });
      showToast("Attendance saved!");
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => (attendance[s.id] || "Absent") === "Present").length;
  const absentCount = students.length - presentCount;
  const rate = students.length ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeader icon="📋" title="ATTENDANCE" subtitle="Mark & track daily attendance" />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <Field label="Date" value={date} onChange={setDate} type="date" />
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 200 }}>
          <label style={{ color: C.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Department
          </label>
          <select value={dept} onChange={(e) => setDept(e.target.value)} style={{
            background: C.bg,
            border: `1.5px solid ${C.border}`,
            borderRadius: 8,
            padding: "9px 13px",
            color: C.text,
            fontSize: 14,
            fontFamily: F.body,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            transition: "border-color .15s",
          }}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { icon: "✅", label: "Present", val: presentCount, bg: C.greenDim, clr: C.green, bc: C.green },
          { icon: "❌", label: "Absent", val: absentCount, bg: C.redDim, clr: C.red, bc: C.red },
          { icon: "📊", label: "Rate", val: `${rate}%`, bg: C.accentDim, clr: C.accent, bc: C.accent },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.bg,
            border: `1px solid ${stat.bc}44`,
            borderRadius: 10,
            padding: "10px 20px",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}>
            <span style={{ fontSize: 20 }}>{stat.icon}</span>
            <div>
              <p style={{ margin: 0, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>{stat.label}</p>
              <p style={{ margin: 0, color: stat.clr, fontSize: 22, fontFamily: F.title }}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Btn variant="success" size="sm" onClick={() => markAll("Present")}>✅ All Present</Btn>
        <Btn variant="danger" size="sm" onClick={() => markAll("Absent")}>❌ All Absent</Btn>
        <Btn variant="primary" size="sm" onClick={saveAtt} loading={saving}>💾 Save</Btn>
        <Btn variant="ghost" size="sm" onClick={load}>↺ Refresh</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32 }}><span>Loading…</span></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.body }}>
              <thead>
                <tr>
                  {["#", "Roll No", "Name", "Status", "Mark"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      color: C.muted,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: `1px solid ${C.border}`,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 36, color: C.muted }}>
                      No active students in this department.
                    </td>
                  </tr>
                )}
                {students.map((s, i) => {
                  const status = attendance[s.id] || "Absent";
                  return (
                    <tr key={s.id} style={{ background: i % 2 ? `${C.surface}44` : "transparent" }}>
                      <td style={{ padding: "12px 14px", color: C.muted, borderBottom: `1px solid ${C.border}22` }}>{i + 1}</td>
                      <td style={{ padding: "12px 14px", color: C.text, fontFamily: F.mono, fontSize: 13, borderBottom: `1px solid ${C.border}22` }}>{s.roll_no}</td>
                      <td style={{ padding: "12px 14px", color: C.text, fontWeight: 500, borderBottom: `1px solid ${C.border}22` }}>{s.name}</td>
                      <td style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}22` }}><Badge color={status === "Present" ? "green" : "red"}>{status}</Badge></td>
                      <td style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}22` }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn variant="success" size="sm" onClick={() => toggle(s.id, "Present")} style={{ opacity: status === "Present" ? 1 : 0.4 }}>P</Btn>
                          <Btn variant="danger" size="sm" onClick={() => toggle(s.id, "Absent")} style={{ opacity: status === "Absent" ? 1 : 0.4 }}>A</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
