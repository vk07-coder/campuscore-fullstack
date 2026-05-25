import { Btn } from "./Btn";
import { C, F } from "../theme";

export const Table = ({ cols, rows, onEdit, onDelete, deleting }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.body, fontSize: 14 }}>
      <thead>
        <tr>
          {cols.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                color: C.muted,
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {c.label}
            </th>
          ))}
          <th style={{
                textAlign: "right",
                padding: "10px 14px",
                color: C.muted,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid ${C.border}`,
              }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={cols.length + 1} style={{ textAlign: "center", padding: 40, color: C.muted }}>
              No records found.
            </td>
          </tr>
        )}
        {rows.map((row, i) => (
          <tr key={row.id} style={{ background: i % 2 ? `${C.surface}44` : "transparent" }}>
            {cols.map((c) => (
              <td
                key={c.key}
                style={{
                  padding: "12px 14px",
                  color: C.text,
                  borderBottom: `1px solid ${C.border}22`,
                  verticalAlign: "middle",
                }}
              >
                {c.render ? c.render(row[c.key], row) : row[c.key]}
              </td>
            ))}
            <td style={{
                  padding: "12px 14px",
                  borderBottom: `1px solid ${C.border}22`,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}>
              <Btn variant="ghost" size="sm" onClick={() => onEdit(row)} style={{ marginRight: 6 }}>
                ✏️ Edit
              </Btn>
              <Btn variant="danger" size="sm" onClick={() => onDelete(row.id)} loading={deleting === row.id}>
                🗑
              </Btn>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
