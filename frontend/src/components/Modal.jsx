import { C, F } from "../theme";

export const Modal = ({ title, onClose, children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "#000b",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 28,
        width: "100%",
        maxWidth: 540,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h3 style={{ margin: 0, color: C.text, fontFamily: F.title, fontSize: 20, letterSpacing: "0.03em" }}>{title}</h3>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: C.muted, fontSize: 24, cursor: "pointer" }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);
