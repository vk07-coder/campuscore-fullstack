import { useState } from "react";
import { C, F } from "../theme";

export const Btn = ({ variant = "primary", size = "md", onClick, children, style = {}, disabled, loading }) => {
  const [hov, setHov] = useState(false);
  const sz = size === "sm" ? { padding: "5px 14px", fontSize: 13 } : { padding: "10px 22px", fontSize: 14 };
  const v = {
    primary: { background: hov ? "#6AA3FF" : C.accent, color: "#fff" },
    danger: { background: hov ? "#F87171" : C.red, color: "#fff" },
    ghost: { background: hov ? C.border : "transparent", color: C.text, border: `1px solid ${C.border}` },
    success: { background: hov ? "#4ADE80" : C.green, color: "#000" },
  };

  return (
    <button
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 8,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: F.body,
        fontWeight: 600,
        transition: "all .18s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        opacity: disabled || loading ? 0.55 : 1,
        ...sz,
        ...v[variant],
        ...style,
      }}
    >
      {loading ? "⏳ …" : children}
    </button>
  );
};
