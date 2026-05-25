import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../hooks/useToast";
import { Btn } from "../components/Btn";
import { Field } from "../components/Field";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { Toast } from "../components/Toast";
import { Spinner } from "../components/Spinner";
import { SectionHeader } from "../components/SectionHeader";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { DEPARTMENTS, YEARS } from "../theme";

const blankStudent = () => ({ name: "", roll_no: "", department: "", year: "", email: "", phone: "", status: "Active" });

export const Students = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blankStudent());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, showToast] = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const r = await api.getStudents(q);
      setRows(r.data);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(blankStudent()); setEditing(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ name: row.name, roll_no: row.roll_no, department: row.department, year: row.year || "", email: row.email || "", phone: row.phone || "", status: row.status });
    setEditing(row.id);
    setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.roll_no || !form.department) {
      showToast("Name, Roll No, Dept required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updateStudent(editing, form);
        showToast("Student updated");
      } else {
        await api.createStudent(form);
        showToast("Student added");
      }
      setModal(false);
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    setDeleting(id);
    try {
      await api.deleteStudent(id);
      showToast("Student deleted");
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleting(null);
    }
  };

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const cols = [
    { key: "roll_no", label: "Roll No" },
    { key: "name", label: "Name" },
    { key: "department", label: "Dept" },
    { key: "year", label: "Year" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (v) => <Badge color={v === "Active" ? "green" : v === "Graduated" ? "amber" : "muted"}>{v}</Badge>,
    },
  ];

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeader icon="🎓" title="STUDENTS" subtitle={`${rows.length} records`} right={<Btn onClick={openAdd}>+ Add Student</Btn>} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search name, roll, email…"
          style={{ width: "100%", maxWidth: 340, background: "#0D0F14", border: "1.5px solid #252A3D", borderRadius: 8, padding: "9px 13px", color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans','Segoe UI',sans-serif", outline: "none" }}
        />
        <Btn variant="ghost" size="sm" onClick={load}>↺ Refresh</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <Spinner /> : <Table cols={cols} rows={rows} onEdit={openEdit} onDelete={del} deleting={deleting} />}
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Student" : "Add Student"} onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Full Name" value={form.name} onChange={setField("name")} required placeholder="Priya Sharma" />
              <Field label="Roll No" value={form.roll_no} onChange={setField("roll_no")} required placeholder="CS2201" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Department" value={form.department} onChange={setField("department")} options={DEPARTMENTS} required />
              <Field label="Year" value={form.year} onChange={setField("year")} options={YEARS} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Email" type="email" value={form.email} onChange={setField("email")} placeholder="s@college.edu" />
              <Field label="Phone" value={form.phone} onChange={setField("phone")} placeholder="9876543210" />
            </div>
            <Field label="Status" value={form.status} onChange={setField("status")} options={["Active", "Inactive", "Graduated"]} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn variant="success" onClick={save} loading={saving}>{editing ? "Update" : "Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};
