import { C, F } from "../theme";

const NAV = [
  { id: "dashboard", icon: "🏛️", label: "Dashboard" },
  { id: "students", icon: "🎓", label: "Students" },
  { id: "staff", icon: "👨‍🏫", label: "Staff" },
  { id: "attendance", icon: "📋", label: "Attendance" },
];

export const Sidebar = ({ active, setActive, onLogout, collapsed, setCollapsed }) => (
  <div
    style={{
      width: collapsed ? 64 : 220,
      minHeight: "100vh",
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      transition: "width .25s",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        padding: collapsed ? "20px 14px" : "20px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: `1px solid ${C.border}`,
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      <span style={{ fontSize: 24, flexShrink: 0 }}>🎓</span>
      {!collapsed && (
        <span style={{ fontFamily: F.title, color: C.white, fontSize: 16, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
          CAMPUSCORE
        </span>
      )}
    </div>

    <nav style={{ flex: 1, padding: "12px 8px" }}>
      {NAV.map((n) => (
        <button
          key={n.id}
          onClick={() => setActive(n.id)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "11px" : "11px 14px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            background: active === n.id ? C.accentDim : "transparent",
            color: active === n.id ? C.accent : C.muted,
            fontFamily: F.body,
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
            transition: "all .15s",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
          {!collapsed && n.label}
          {!collapsed && active === n.id && (
            <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          )}
        </button>
      ))}
    </nav>

    <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}` }}>
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "10px" : "10px 14px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: C.muted,
          fontSize: 14,
        }}
      >
        <span style={{ fontSize: 18 }}>{collapsed ? "→" : "←"}</span>
        {!collapsed && "Collapse"}
      </button>
      <button
        onClick={onLogout}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "10px" : "10px 14px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: C.red,
          fontSize: 14,
        }}
      >
        <span style={{ fontSize: 18 }}>🚪</span>
        {!collapsed && "Logout"}
      </button>
    </div>
  </div>
);
