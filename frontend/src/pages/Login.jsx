import { useState } from "react";
import { api } from "../api";
import { C, F } from "../theme";
import { Card } from "../components/Card";
import { Btn } from "../components/Btn";
import { Field } from "../components/Field";

export const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user || !pass) {
      setErr("Fill all fields.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const { token, admin } = await api.login(user, pass);
      localStorage.setItem("cc_token", token);
      onLogin(admin);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.body,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle,${C.accentDim}88 0%,transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div style={{ position: "relative", width: "100%", maxWidth: 420, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg,${C.accent},#6366F1)`,
              fontSize: 30,
              marginBottom: 16,
            }}
          >
            🎓
          </div>
          <h1 style={{ margin: 0, fontFamily: F.title, color: C.white, fontSize: 32, letterSpacing: "0.06em" }}>
            CAMPUSCORE
          </h1>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>College Management System</p>
        </div>
        <Card style={{ boxShadow: "0 24px 64px #00000088" }}>
          <h2 style={{ margin: "0 0 20px", fontFamily: F.title, color: C.text, fontSize: 18, letterSpacing: "0.04em" }}>
            ADMIN LOGIN
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Username" value={user} onChange={setUser} placeholder="admin" />
            <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" />
          </div>
          {err && (
            <p style={{ color: C.red, fontSize: 13, margin: "10px 0 0", fontWeight: 500 }}>⚠ {err}</p>
          )}
          <Btn onClick={submit} loading={loading} style={{ marginTop: 20, width: "100%", justifyContent: "center", fontSize: 15 }}>
            → Sign In
          </Btn>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 14, textAlign: "center" }}>
            Default: <span style={{ color: C.accent }}>admin</span> / <span style={{ color: C.accent }}>admin123</span>
          </p>
        </Card>
      </div>
    </div>
  );
};
