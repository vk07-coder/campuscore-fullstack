import { C } from "../theme";

export const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);
