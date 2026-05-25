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
import { DEPARTMENTS, STAFF_ROLES } from "../theme";

const blankStaff = () => ({ name: "", emp_id: "", department: "", role: "", email: "", phone: "", status: "Active" });

export const Staff = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blankStaff());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, showToast] = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const r = await api.getStaff(q);
      setRows(r.data);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(blankStaff()); setEditing(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ name: row.name, emp_id: row.emp_id, department: row.department, role: row.role || "", email: row.email || "", phone: row.phone || "", status: row.status });
    setEditing(row.id);
    setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.emp_id || !form.department) {
      showToast("Name, Emp ID, Dept required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updateStaff(editing, form);
        showToast("Staff updated");
      } else {
        await api.createStaff(form);
        showToast("Staff added");
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
    if (!window.confirm("Delete this staff member?")) return;
    setDeleting(id);
    try {
      await api.deleteStaff(id);
      showToast("Staff deleted");
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleting(null);
    }
  };

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const cols = [
    { key: "emp_id", label: "Emp ID" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "department", label: "Dept" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (v) => <Badge color={v === "Active" ? "green" : v === "On Leave" ? "amber" : "muted"}>{v}</Badge>,
    },
  ];

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SectionHeader icon="👨‍🏫" title="STAFF" subtitle={`${rows.length} members`} right={<Btn onClick={openAdd}>+ Add Staff</Btn>} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search name, ID, email…"
          style={{ width: "100%", maxWidth: 340, background: "#0D0F14", border: "1.5px solid #252A3D", borderRadius: 8, padding: "9px 13px", color: "#E2E8F0", fontSize: 14, fontFamily: "'DM Sans','Segoe UI',sans-serif", outline: "none" }}
        />
        <Btn variant="ghost" size="sm" onClick={load}>↺ Refresh</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <Spinner /> : <Table cols={cols} rows={rows} onEdit={openEdit} onDelete={del} deleting={deleting} />}
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Staff" : "Add Staff"} onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Full Name" value={form.name} onChange={setField("name")} required placeholder="Dr. Suresh Kumar" />
              <Field label="Employee ID" value={form.emp_id} onChange={setField("emp_id")} required placeholder="FAC001" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Department" value={form.department} onChange={setField("department")} options={DEPARTMENTS} required />
              <Field label="Role" value={form.role} onChange={setField("role")} options={STAFF_ROLES} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Email" type="email" value={form.email} onChange={setField("email")} placeholder="staff@college.edu" />
              <Field label="Phone" value={form.phone} onChange={setField("phone")} />
            </div>
            <Field label="Status" value={form.status} onChange={setField("status")} options={["Active", "On Leave", "Inactive"]} />
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
