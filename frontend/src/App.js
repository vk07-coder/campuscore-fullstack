import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0F14", surface: "#141720", card: "#1A1E2E", border: "#252A3D",
  accent: "#4F8EF7", accentDim: "#1E3A6E", green: "#22C55E", greenDim: "#14532D",
  amber: "#F59E0B", amberDim: "#451A03", red: "#EF4444", redDim: "#450A0A",
  text: "#E2E8F0", muted: "#64748B", white: "#FFFFFF",
};
const F = {
  title: "'Clash Display','Bebas Neue','Arial Black',sans-serif",
  body: "'DM Sans','Segoe UI',sans-serif",
  mono: "'JetBrains Mono','Fira Code',monospace",
};

const DEPARTMENTS = ["Computer Science","Electronics","Mechanical","Civil","Business"];
const YEARS       = ["1st","2nd","3rd","4th"];
const STAFF_ROLES = ["Professor","Assistant Professor","Lecturer","HOD","Lab Instructor"];

// ─── Primitives ───────────────────────────────────────────────────────────────
const Badge = ({ color="accent", children }) => {
  const map = { accent:[C.accentDim,C.accent], green:[C.greenDim,C.green],
                amber:[C.amberDim,C.amber], red:[C.redDim,C.red], muted:["#1E2435",C.muted] };
  const [bg,fg] = map[color]??map.accent;
  return <span style={{background:bg,color:fg,border:`1px solid ${fg}30`,borderRadius:6,
    padding:"2px 10px",fontSize:12,fontWeight:600,fontFamily:F.body,letterSpacing:"0.04em"}}>{children}</span>;
};

const Btn = ({ variant="primary", size="md", onClick, children, style={}, disabled, loading }) => {
  const [hov,setHov] = useState(false);
  const sz = size==="sm"?{padding:"5px 14px",fontSize:13}:{padding:"10px 22px",fontSize:14};
  const v = { primary:{background:hov?"#6AA3FF":C.accent,color:"#fff"},
               danger:{background:hov?"#F87171":C.red,color:"#fff"},
               ghost:{background:hov?C.border:"transparent",color:C.text,border:`1px solid ${C.border}`},
               success:{background:hov?"#4ADE80":C.green,color:"#000"} };
  return (
    <button disabled={disabled||loading} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={onClick} style={{border:"none",borderRadius:8,cursor:disabled||loading?"not-allowed":"pointer",
        fontFamily:F.body,fontWeight:600,transition:"all .18s",display:"inline-flex",alignItems:"center",
        gap:6,opacity:disabled||loading?0.55:1,...sz,...v[variant],...style}}>
      {loading?"⏳ …":children}
    </button>
  );
};

const iStyle = {background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,
  padding:"9px 13px",color:C.text,fontSize:14,fontFamily:F.body,outline:"none",
  width:"100%",boxSizing:"border-box",transition:"border-color .15s"};

const Field = ({ label, value, onChange, type="text", placeholder, required, options }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
    {label && <label style={{color:C.muted,fontSize:12,fontWeight:600,fontFamily:F.body,
      textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    {options
      ? <select value={value} onChange={e=>onChange(e.target.value)} style={iStyle}>
          <option value="">Select…</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} style={iStyle}/>}
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24,...style}}>{children}</div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{position:"fixed",inset:0,background:"#000b",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,
      width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h3 style={{margin:0,color:C.text,fontFamily:F.title,fontSize:20,letterSpacing:"0.03em"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:24,cursor:"pointer"}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, type="success" }) => (
  <div style={{position:"fixed",bottom:24,right:24,zIndex:1200,background:type==="error"?C.redDim:C.greenDim,
    border:`1px solid ${type==="error"?C.red:C.green}`,borderRadius:10,padding:"12px 20px",
    color:type==="error"?C.red:C.green,fontFamily:F.body,fontSize:14,fontWeight:600,
    boxShadow:"0 8px 32px #0006",display:"flex",alignItems:"center",gap:8}}>
    {type==="error"?"❌":"✅"} {msg}
  </div>
);

const Spinner = () => (
  <div style={{display:"flex",justifyContent:"center",padding:48}}>
    <div style={{width:36,height:36,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.accent}`,
      borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const SectionHeader = ({ icon, title, subtitle, right }) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:44,height:44,borderRadius:10,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{icon}</div>
      <div>
        <h2 style={{margin:0,fontFamily:F.title,color:C.text,fontSize:22,letterSpacing:"0.04em"}}>{title}</h2>
        {subtitle&&<p style={{margin:"2px 0 0",color:C.muted,fontSize:13}}>{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

// ─── Hook: toast ─────────────────────────────────────────────────────────────
const useToast = () => {
  const [toast,setToast] = useState(null);
  const show = useCallback((msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  },[]);
  return [toast,show];
};

// ─── Login ────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [user,setUser]=useState(""); const [pass,setPass]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);

  const submit = async () => {
    if(!user||!pass){setErr("Fill all fields.");return;}
    setLoading(true); setErr("");
    try {
      const {token,admin} = await api.login(user,pass);
      localStorage.setItem("cc_token", token);
      onLogin(admin);
    } catch(e){ setErr(e.message); }
    finally{ setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",
      justifyContent:"center",fontFamily:F.body,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:.4}}/>
      <div style={{position:"absolute",top:"15%",left:"8%",width:320,height:320,borderRadius:"50%",
        background:`radial-gradient(circle,${C.accentDim}88 0%,transparent 70%)`,filter:"blur(60px)"}}/>
      <div style={{position:"relative",width:"100%",maxWidth:420,padding:"0 20px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,
            borderRadius:16,background:`linear-gradient(135deg,${C.accent},#6366F1)`,fontSize:30,marginBottom:16}}>🎓</div>
          <h1 style={{margin:0,fontFamily:F.title,color:C.white,fontSize:32,letterSpacing:"0.06em"}}>CAMPUSCORE</h1>
          <p style={{margin:"4px 0 0",color:C.muted,fontSize:13}}>College Management System</p>
        </div>
        <Card style={{boxShadow:"0 24px 64px #00000088"}}>
          <h2 style={{margin:"0 0 20px",fontFamily:F.title,color:C.text,fontSize:18,letterSpacing:"0.04em"}}>ADMIN LOGIN</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Field label="Username" value={user} onChange={setUser} placeholder="admin"/>
            <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
          </div>
          {err&&<p style={{color:C.red,fontSize:13,margin:"10px 0 0",fontWeight:500}}>⚠ {err}</p>}
          <Btn onClick={submit} loading={loading} style={{marginTop:20,width:"100%",justifyContent:"center",fontSize:15}}>
            → Sign In
          </Btn>
          <p style={{color:C.muted,fontSize:12,marginTop:14,textAlign:"center"}}>
            Default: <span style={{color:C.accent}}>admin</span> / <span style={{color:C.accent}}>admin123</span>
          </p>
        </Card>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",
    display:"flex",alignItems:"center",gap:16,flex:1,minWidth:160}}>
    <div style={{width:48,height:48,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{icon}</div>
    <div>
      <p style={{margin:0,color:C.muted,fontSize:12,fontFamily:F.body,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</p>
      <p style={{margin:"2px 0 0",color:C.text,fontSize:28,fontFamily:F.title,letterSpacing:"0.03em"}}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.stats().then(r=>setData(r.data)).catch(console.error).finally(()=>setLoading(false)); },[]);

  if(loading) return <Spinner/>;
  if(!data) return <p style={{color:C.muted}}>Could not load stats.</p>;
  const { counts, deptBreakdown, recentStudents, todaySummary } = data;
  const maxDept = deptBreakdown[0]?.count||1;

  return (
    <div>
      <SectionHeader icon="🏛️" title="DASHBOARD" subtitle="Welcome back, Administrator"/>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
        <StatCard icon="🎓" label="Students"   value={counts.students}           color={C.accent}/>
        <StatCard icon="👨‍🏫" label="Staff"      value={counts.staff}              color={C.green}/>
        <StatCard icon="🏢" label="Departments" value={counts.departments}         color={C.amber}/>
        <StatCard icon="📊" label="Attendance"  value={`${counts.attendanceRate}%`} color="#A855F7"/>
      </div>

      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <Card style={{flex:1,minWidth:280}}>
          <h3 style={{margin:"0 0 16px",fontFamily:F.title,color:C.text,fontSize:15,letterSpacing:"0.04em"}}>RECENT STUDENTS</h3>
          {recentStudents.map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 14px",background:C.surface,borderRadius:8,marginBottom:8}}>
              <div>
                <p style={{margin:0,color:C.text,fontSize:14,fontWeight:600}}>{s.name}</p>
                <p style={{margin:0,color:C.muted,fontSize:12}}>{s.roll_no} · {s.department}</p>
              </div>
              <Badge color={s.status==="Active"?"green":"muted"}>{s.status}</Badge>
            </div>
          ))}
        </Card>

        <Card style={{flex:1,minWidth:280}}>
          <h3 style={{margin:"0 0 16px",fontFamily:F.title,color:C.text,fontSize:15,letterSpacing:"0.04em"}}>DEPT STRENGTH</h3>
          {deptBreakdown.map(d=>(
            <div key={d.department} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:C.text,fontSize:13}}>{d.department}</span>
                <span style={{color:C.muted,fontSize:13}}>{d.count}</span>
              </div>
              <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(d.count/maxDept)*100}%`,
                  background:`linear-gradient(90deg,${C.accent},#6366F1)`,borderRadius:3}}/>
              </div>
            </div>
          ))}
          {todaySummary&&(
            <div style={{marginTop:20,padding:"12px 16px",background:C.surface,borderRadius:10,display:"flex",gap:20}}>
              <div><p style={{margin:0,color:C.muted,fontSize:11,textTransform:"uppercase"}}>Today Present</p>
                <p style={{margin:0,color:C.green,fontSize:20,fontFamily:F.title}}>{todaySummary.present||0}</p></div>
              <div><p style={{margin:0,color:C.muted,fontSize:11,textTransform:"uppercase"}}>Today Absent</p>
                <p style={{margin:0,color:C.red,fontSize:20,fontFamily:F.title}}>{todaySummary.absent||0}</p></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── Reusable Table ───────────────────────────────────────────────────────────
const Table = ({ cols, rows, onEdit, onDelete, deleting }) => (
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F.body,fontSize:14}}>
      <thead>
        <tr>{cols.map(c=>(
          <th key={c.key} style={{textAlign:"left",padding:"10px 14px",color:C.muted,fontWeight:600,
            fontSize:12,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.border}`}}>{c.label}</th>
        ))}
        <th style={{textAlign:"right",padding:"10px 14px",color:C.muted,fontSize:12,
          textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.border}`}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length===0&&<tr><td colSpan={cols.length+1} style={{textAlign:"center",padding:40,color:C.muted}}>No records found.</td></tr>}
        {rows.map((row,i)=>(
          <tr key={row.id} style={{background:i%2?C.surface+"44":"transparent"}}>
            {cols.map(c=>(
              <td key={c.key} style={{padding:"12px 14px",color:C.text,borderBottom:`1px solid ${C.border}22`,verticalAlign:"middle"}}>
                {c.render?c.render(row[c.key],row):row[c.key]}
              </td>
            ))}
            <td style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}22`,textAlign:"right",whiteSpace:"nowrap"}}>
              <Btn variant="ghost" size="sm" onClick={()=>onEdit(row)} style={{marginRight:6}}>✏️ Edit</Btn>
              <Btn variant="danger" size="sm" onClick={()=>onDelete(row.id)} loading={deleting===row.id}>🗑</Btn>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Students ─────────────────────────────────────────────────────────────────
const blankStudent = ()=>({name:"",roll_no:"",department:"",year:"",email:"",phone:"",status:"Active"});

const Students = () => {
  const [rows,setRows]    = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch]= useState("");
  const [modal,setModal]  = useState(false);
  const [form,setForm]    = useState(blankStudent());
  const [editing,setEditing]= useState(null);
  const [saving,setSaving]= useState(false);
  const [deleting,setDeleting]= useState(null);
  const [toast,showToast] = useToast();

  const load = useCallback(async()=>{
    setLoading(true);
    try{ const q=search?`?search=${encodeURIComponent(search)}`:"";
         const r=await api.getStudents(q); setRows(r.data); }
    catch(e){ showToast(e.message,"error"); }
    finally{ setLoading(false); }
  },[search]); // eslint-disable-line

  useEffect(()=>{ load(); },[load]);

  const openAdd  = ()=>{ setForm(blankStudent()); setEditing(null); setModal(true); };
  const openEdit = (row)=>{ setForm({name:row.name,roll_no:row.roll_no,department:row.department,
    year:row.year||"",email:row.email||"",phone:row.phone||"",status:row.status}); setEditing(row.id); setModal(true); };

  const save = async()=>{
    if(!form.name||!form.roll_no||!form.department){showToast("Name, Roll No, Dept required","error");return;}
    setSaving(true);
    try{
      if(editing){ await api.updateStudent(editing,form); showToast("Student updated"); }
      else        { await api.createStudent(form);        showToast("Student added"); }
      setModal(false); load();
    }catch(e){ showToast(e.message,"error"); }
    finally{ setSaving(false); }
  };

  const del = async(id)=>{
    if(!window.confirm("Delete this student?")) return;
    setDeleting(id);
    try{ await api.deleteStudent(id); showToast("Student deleted"); load(); }
    catch(e){ showToast(e.message,"error"); }
    finally{ setDeleting(null); }
  };

  const set = k=>v=>setForm(p=>({...p,[k]:v}));
  const cols=[
    {key:"roll_no",   label:"Roll No"},
    {key:"name",      label:"Name"},
    {key:"department",label:"Dept"},
    {key:"year",      label:"Year"},
    {key:"email",     label:"Email"},
    {key:"status",    label:"Status",render:v=><Badge color={v==="Active"?"green":v==="Graduated"?"amber":"muted"}>{v}</Badge>},
  ];

  return (
    <div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader icon="🎓" title="STUDENTS" subtitle={`${rows.length} records`}
        right={<Btn onClick={openAdd}>+ Add Student</Btn>}/>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, roll, email…" style={{...iStyle,width:"100%",maxWidth:340}}/>
        <Btn variant="ghost" size="sm" onClick={load}>↺ Refresh</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        {loading?<Spinner/>:<Table cols={cols} rows={rows} onEdit={openEdit} onDelete={del} deleting={deleting}/>}
      </Card>

      {modal&&(
        <Modal title={editing?"Edit Student":"Add Student"} onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:12}}>
              <Field label="Full Name" value={form.name} onChange={set("name")} required placeholder="Priya Sharma"/>
              <Field label="Roll No"   value={form.roll_no} onChange={set("roll_no")} required placeholder="CS2201"/>
            </div>
            <div style={{display:"flex",gap:12}}>
              <Field label="Department" value={form.department} onChange={set("department")} options={DEPARTMENTS} required/>
              <Field label="Year"       value={form.year}       onChange={set("year")}       options={YEARS}/>
            </div>
            <div style={{display:"flex",gap:12}}>
              <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="s@college.edu"/>
              <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="9876543210"/>
            </div>
            <Field label="Status" value={form.status} onChange={set("status")} options={["Active","Inactive","Graduated"]}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="success" onClick={save} loading={saving}>{editing?"Update":"Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Staff ────────────────────────────────────────────────────────────────────
const blankStaff = ()=>({name:"",emp_id:"",department:"",role:"",email:"",phone:"",status:"Active"});

const Staff = () => {
  const [rows,setRows]    = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch]= useState("");
  const [modal,setModal]  = useState(false);
  const [form,setForm]    = useState(blankStaff());
  const [editing,setEditing]= useState(null);
  const [saving,setSaving]= useState(false);
  const [deleting,setDeleting]= useState(null);
  const [toast,showToast] = useToast();

  const load = useCallback(async()=>{
    setLoading(true);
    try{ const q=search?`?search=${encodeURIComponent(search)}`:"";
         const r=await api.getStaff(q); setRows(r.data); }
    catch(e){ showToast(e.message,"error"); }
    finally{ setLoading(false); }
  },[search]); // eslint-disable-line

  useEffect(()=>{ load(); },[load]);

  const openAdd  = ()=>{ setForm(blankStaff()); setEditing(null); setModal(true); };
  const openEdit = (row)=>{ setForm({name:row.name,emp_id:row.emp_id,department:row.department,
    role:row.role||"",email:row.email||"",phone:row.phone||"",status:row.status}); setEditing(row.id); setModal(true); };

  const save = async()=>{
    if(!form.name||!form.emp_id||!form.department){showToast("Name, Emp ID, Dept required","error");return;}
    setSaving(true);
    try{
      if(editing){ await api.updateStaff(editing,form); showToast("Staff updated"); }
      else        { await api.createStaff(form);        showToast("Staff added"); }
      setModal(false); load();
    }catch(e){ showToast(e.message,"error"); }
    finally{ setSaving(false); }
  };

  const del = async(id)=>{
    if(!window.confirm("Delete this staff member?")) return;
    setDeleting(id);
    try{ await api.deleteStaff(id); showToast("Staff deleted"); load(); }
    catch(e){ showToast(e.message,"error"); }
    finally{ setDeleting(null); }
  };

  const set = k=>v=>setForm(p=>({...p,[k]:v}));
  const cols=[
    {key:"emp_id",    label:"Emp ID"},
    {key:"name",      label:"Name"},
    {key:"role",      label:"Role"},
    {key:"department",label:"Dept"},
    {key:"email",     label:"Email"},
    {key:"status",    label:"Status",render:v=><Badge color={v==="Active"?"green":v==="On Leave"?"amber":"muted"}>{v}</Badge>},
  ];

  return (
    <div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader icon="👨‍🏫" title="STAFF" subtitle={`${rows.length} members`}
        right={<Btn onClick={openAdd}>+ Add Staff</Btn>}/>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, ID, email…" style={{...iStyle,width:"100%",maxWidth:340}}/>
        <Btn variant="ghost" size="sm" onClick={load}>↺ Refresh</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        {loading?<Spinner/>:<Table cols={cols} rows={rows} onEdit={openEdit} onDelete={del} deleting={deleting}/>}
      </Card>

      {modal&&(
        <Modal title={editing?"Edit Staff":"Add Staff"} onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:12}}>
              <Field label="Full Name"   value={form.name}   onChange={set("name")}   required placeholder="Dr. Suresh Kumar"/>
              <Field label="Employee ID" value={form.emp_id} onChange={set("emp_id")} required placeholder="FAC001"/>
            </div>
            <div style={{display:"flex",gap:12}}>
              <Field label="Department" value={form.department} onChange={set("department")} options={DEPARTMENTS} required/>
              <Field label="Role"       value={form.role}       onChange={set("role")}       options={STAFF_ROLES}/>
            </div>
            <div style={{display:"flex",gap:12}}>
              <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="staff@college.edu"/>
              <Field label="Phone" value={form.phone} onChange={set("phone")}/>
            </div>
            <Field label="Status" value={form.status} onChange={set("status")} options={["Active","On Leave","Inactive"]}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="success" onClick={save} loading={saving}>{editing?"Update":"Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Attendance ───────────────────────────────────────────────────────────────
const Attendance = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date,setDate]   = useState(today);
  const [dept,setDept]   = useState("Computer Science");
  const [students,setStudents]   = useState([]);
  const [attendance,setAttendance] = useState({});   // { student_id: "Present"|"Absent" }
  const [summary,setSummary] = useState(null);
  const [loading,setLoading] = useState(false);
  const [saving,setSaving]   = useState(false);
  const [toast,showToast]    = useToast();

  const load = useCallback(async()=>{
    setLoading(true);
    try{
      const [stRes, attRes, sumRes] = await Promise.all([
        api.getStudents(`?dept=${encodeURIComponent(dept)}`),
        api.getAttendance(`?date=${date}&dept=${encodeURIComponent(dept)}`),
        api.getSummary(`?date=${date}&dept=${encodeURIComponent(dept)}`),
      ]);
      setStudents(stRes.data.filter(s=>s.status==="Active"));
      const map={};
      attRes.data.forEach(a=>{ map[a.student_id]=a.status; });
      setAttendance(map);
      setSummary(sumRes.data);
    }catch(e){ showToast(e.message,"error"); }
    finally{ setLoading(false); }
  },[date,dept]); // eslint-disable-line

  useEffect(()=>{ load(); },[load]);

  const toggle = (id, status) => setAttendance(p=>({...p,[id]:status}));
  const markAll = status => {
    const m={};
    students.forEach(s=>{ m[s.id]=status; });
    setAttendance(m);
  };

  const saveAtt = async()=>{
    setSaving(true);
    try{
      const records = students.map(s=>({ student_id:s.id, status:attendance[s.id]||"Absent" }));
      await api.bulkMark({ date, records });
      showToast("Attendance saved!");
      load();
    }catch(e){ showToast(e.message,"error"); }
    finally{ setSaving(false); }
  };

  const presentCount = students.filter(s=>(attendance[s.id]||"Absent")==="Present").length;
  const absentCount  = students.length - presentCount;
  const rate = students.length ? Math.round((presentCount/students.length)*100) : 0;

  return (
    <div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader icon="📋" title="ATTENDANCE" subtitle="Mark & track daily attendance"/>

      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:20}}>
        <Field label="Date" value={date} onChange={setDate} type="date"/>
        <div style={{display:"flex",flexDirection:"column",gap:5,flex:1,minWidth:200}}>
          <label style={{color:C.muted,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Department</label>
          <select value={dept} onChange={e=>setDept(e.target.value)} style={iStyle}>
            {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        {[
          {icon:"✅",label:"Present",val:presentCount,bg:C.greenDim,clr:C.green,bc:C.green},
          {icon:"❌",label:"Absent", val:absentCount, bg:C.redDim,  clr:C.red,  bc:C.red},
          {icon:"📊",label:"Rate",   val:`${rate}%`,  bg:C.accentDim,clr:C.accent,bc:C.accent},
        ].map(s=>(
          <div key={s.label} style={{background:s.bg,border:`1px solid ${s.bc}44`,borderRadius:10,
            padding:"10px 20px",display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:20}}>{s.icon}</span>
            <div>
              <p style={{margin:0,color:C.muted,fontSize:11,textTransform:"uppercase"}}>{s.label}</p>
              <p style={{margin:0,color:s.clr,fontSize:22,fontFamily:F.title}}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <Btn variant="success" size="sm" onClick={()=>markAll("Present")}>✅ All Present</Btn>
        <Btn variant="danger"  size="sm" onClick={()=>markAll("Absent")}>❌ All Absent</Btn>
        <Btn variant="primary" size="sm" onClick={saveAtt} loading={saving}>💾 Save</Btn>
        <Btn variant="ghost"   size="sm" onClick={load}>↺ Refresh</Btn>
      </div>

      <Card style={{padding:0,overflow:"hidden"}}>
        {loading?<Spinner/>:(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F.body}}>
              <thead>
                <tr>{["#","Roll No","Name","Status","Mark"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 14px",color:C.muted,fontSize:12,
                    textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.border}`}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {students.length===0&&<tr><td colSpan={5} style={{textAlign:"center",padding:36,color:C.muted}}>No active students in this department.</td></tr>}
                {students.map((s,i)=>{
                  const status=attendance[s.id]||"Absent";
                  return(
                    <tr key={s.id} style={{background:i%2?C.surface+"44":"transparent"}}>
                      <td style={{padding:"12px 14px",color:C.muted,borderBottom:`1px solid ${C.border}22`}}>{i+1}</td>
                      <td style={{padding:"12px 14px",color:C.text,fontFamily:F.mono,fontSize:13,borderBottom:`1px solid ${C.border}22`}}>{s.roll_no}</td>
                      <td style={{padding:"12px 14px",color:C.text,fontWeight:500,borderBottom:`1px solid ${C.border}22`}}>{s.name}</td>
                      <td style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}22`}}>
                        <Badge color={status==="Present"?"green":"red"}>{status}</Badge>
                      </td>
                      <td style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}22`}}>
                        <div style={{display:"flex",gap:6}}>
                          <Btn variant="success" size="sm" onClick={()=>toggle(s.id,"Present")} style={{opacity:status==="Present"?1:.4}}>P</Btn>
                          <Btn variant="danger"  size="sm" onClick={()=>toggle(s.id,"Absent")}  style={{opacity:status==="Absent"?1:.4}}>A</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",icon:"🏛️",label:"Dashboard"},{id:"students",icon:"🎓",label:"Students"},
           {id:"staff",icon:"👨‍🏫",label:"Staff"},{id:"attendance",icon:"📋",label:"Attendance"}];

const Sidebar=({active,setActive,onLogout,collapsed,setCollapsed})=>(
  <div style={{width:collapsed?64:220,minHeight:"100vh",background:C.surface,borderRight:`1px solid ${C.border}`,
    display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden",flexShrink:0}}>
    <div style={{padding:collapsed?"20px 14px":"20px 18px",display:"flex",alignItems:"center",gap:10,
      borderBottom:`1px solid ${C.border}`,justifyContent:collapsed?"center":"flex-start"}}>
      <span style={{fontSize:24,flexShrink:0}}>🎓</span>
      {!collapsed&&<span style={{fontFamily:F.title,color:C.white,fontSize:16,letterSpacing:"0.06em",whiteSpace:"nowrap"}}>CAMPUSCORE</span>}
    </div>
    <nav style={{flex:1,padding:"12px 8px"}}>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setActive(n.id)} style={{width:"100%",display:"flex",alignItems:"center",
          gap:10,padding:collapsed?"11px":"11px 14px",justifyContent:collapsed?"center":"flex-start",
          borderRadius:9,border:"none",cursor:"pointer",background:active===n.id?C.accentDim:"transparent",
          color:active===n.id?C.accent:C.muted,fontFamily:F.body,fontSize:14,fontWeight:500,marginBottom:4,
          transition:"all .15s",whiteSpace:"nowrap"}}>
          <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
          {!collapsed&&n.label}
          {!collapsed&&active===n.id&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.accent}}/>}
        </button>
      ))}
    </nav>
    <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`}}>
      <button onClick={()=>setCollapsed(c=>!c)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,
        padding:"10px 14px",justifyContent:collapsed?"center":"flex-start",borderRadius:9,border:"none",
        cursor:"pointer",background:"transparent",color:C.muted,fontSize:14}}>
        <span style={{fontSize:18}}>{collapsed?"→":"←"}</span>{!collapsed&&"Collapse"}
      </button>
      <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:10,
        padding:"10px 14px",justifyContent:collapsed?"center":"flex-start",borderRadius:9,border:"none",
        cursor:"pointer",background:"transparent",color:C.red,fontSize:14}}>
        <span style={{fontSize:18}}>🚪</span>{!collapsed&&"Logout"}
      </button>
    </div>
  </div>
);

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App(){
  const [admin,setAdmin]       = useState(null);
  const [page,setPage]         = useState("dashboard");
  const [collapsed,setCollapsed]= useState(false);

  useEffect(()=>{
    const token=localStorage.getItem("cc_token");
    if(token){ api.me().then(r=>setAdmin(r.admin)).catch(()=>localStorage.removeItem("cc_token")); }
  },[]);

  useEffect(()=>{
    document.body.style.margin="0";
    document.body.style.background=C.bg;
    document.body.style.fontFamily=F.body;
  },[]);

  const logout=()=>{ localStorage.removeItem("cc_token"); setAdmin(null); };

  if(!admin) return <Login onLogin={setAdmin}/>;

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>
      <Sidebar active={page} setActive={setPage} onLogout={logout} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <main style={{flex:1,padding:"28px 32px",overflowY:"auto",maxWidth:"100%"}}>
        {page==="dashboard"  && <Dashboard/>}
        {page==="students"   && <Students/>}
        {page==="staff"      && <Staff/>}
        {page==="attendance" && <Attendance/>}
      </main>
    </div>
  );
}
