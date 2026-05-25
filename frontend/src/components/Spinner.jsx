import { C } from "../theme";

export const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
    <div
      style={{
        width: 36,
        height: 36,
        border: `3px solid ${C.border}`,
        borderTop: `3px solid ${C.accent}`,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);
