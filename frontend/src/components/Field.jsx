import { C, F, iStyle } from "../theme";

export const Field = ({ label, value, onChange, type = "text", placeholder, required, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
    {label && (
      <label style={{
        color: C.muted,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: F.body,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {label}
        {required && <span style={{ color: C.red }}> *</span>}
      </label>
    )}
    {options ? (
      <select value={value} onChange={(e) => onChange(e.target.value)} style={iStyle}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={iStyle}
      />
    )}
  </div>
);
