import { C, F } from "../theme";

export const SectionHeader = ({ icon, title, subtitle, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
        {icon}
      </div>
      <div>
        <h2 style={{ margin: 0, fontFamily: F.title, color: C.text, fontSize: 22, letterSpacing: "0.04em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "2px 0 0", color: C.muted, fontSize: 13 }}>{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);
