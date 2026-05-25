import { useState, useEffect } from "react";
import { api } from "../api";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { Spinner } from "../components/Spinner";
import { SectionHeader } from "../components/SectionHeader";
import { C, F } from "../theme";

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: C.muted, fontSize: 12, fontFamily: F.body, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", color: C.text, fontSize: 28, fontFamily: F.title, letterSpacing: "0.03em" }}>{value}</p>
    </div>
  </div>
);

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <p style={{ color: C.muted }}>Could not load stats.</p>;

  const { counts, deptBreakdown, recentStudents, todaySummary } = data;
  const maxDept = deptBreakdown[0]?.count || 1;

  return (
    <div>
      <SectionHeader icon="🏛️" title="MY DASHBOARD" subtitle="Welcome back, Administrator" />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="🎓" label="Students" value={counts.students} color={C.accent} />
        <StatCard icon="👨‍🏫" label="Staff" value={counts.staff} color={C.green} />
        <StatCard icon="🏢" label="Departments" value={counts.departments} color={C.amber} />
        <StatCard icon="📊" label="Attendance" value={`${counts.attendanceRate}%`} color="#A855F7" />
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: F.title, color: C.text, fontSize: 15, letterSpacing: "0.04em" }}>RECENT STUDENTS</h3>
          {recentStudents.map((s) => (
            <div key={s.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: C.surface,
              borderRadius: 8,
              marginBottom: 8,
            }}>
              <div>
                <p style={{ margin: 0, color: C.text, fontSize: 14, fontWeight: 600 }}>{s.name}</p>
                <p style={{ margin: 0, color: C.muted, fontSize: 12 }}>{s.roll_no} · {s.department}</p>
              </div>
              <Badge color={s.status === "Active" ? "green" : "muted"}>{s.status}</Badge>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: F.title, color: C.text, fontSize: 15, letterSpacing: "0.04em" }}>DEPT STRENGTH</h3>
          {deptBreakdown.map((d) => (
            <div key={d.department} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: C.text, fontSize: 13 }}>{d.department}</span>
                <span style={{ color: C.muted, fontSize: 13 }}>{d.count}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(d.count / maxDept) * 100}%`,
                  background: `linear-gradient(90deg,${C.accent},#6366F1)`,
                  borderRadius: 3,
                }} />
              </div>
            </div>
          ))}
          {todaySummary && (
            <div style={{ marginTop: 20, padding: "12px 16px", background: C.surface, borderRadius: 10, display: "flex", gap: 20 }}>
              <div>
                <p style={{ margin: 0, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>Today Present</p>
                <p style={{ margin: 0, color: C.green, fontSize: 20, fontFamily: F.title }}>{todaySummary.present || 0}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>Today Absent</p>
                <p style={{ margin: 0, color: C.red, fontSize: 20, fontFamily: F.title }}>{todaySummary.absent || 0}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
