import { C, F } from "../theme";

export const Badge = ({ color = "accent", children }) => {
  const map = {
    accent: [C.accentDim, C.accent],
    green: [C.greenDim, C.green],
    amber: [C.amberDim, C.amber],
    red: [C.redDim, C.red],
    muted: ["#1E2435", C.muted],
  };
  const [bg, fg] = map[color] ?? map.accent;
  return (
    <span style={{
      background: bg,
      color: fg,
      border: `1px solid ${fg}30`,
      borderRadius: 6,
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: F.body,
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
};
