import { C, F } from "../theme";

export const Toast = ({ msg, type = "success" }) => (
  <div
    style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1200,
      background: type === "error" ? C.redDim : C.greenDim,
      border: `1px solid ${type === "error" ? C.red : C.green}`,
      borderRadius: 10,
      padding: "12px 20px",
      color: type === "error" ? C.red : C.green,
      fontFamily: F.body,
      fontSize: 14,
      fontWeight: 600,
      boxShadow: "0 8px 32px #0006",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {type === "error" ? "❌" : "✅"} {msg}
  </div>
);
