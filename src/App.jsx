import { useState, useMemo, useEffect, useCallback, useRef } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

const PASSWORD = "Blonduos3930$!";
const TECH_PASSWORD = "CanopyWave$!";

function HorizonLogo({size=36, stop1="#0055ee", stop2="#00bbff"}) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{overflow:"visible"}}>
      <defs>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stop2} stopOpacity="1"/>
          <stop offset="60%" stopColor={stop1} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={stop1} stopOpacity="0.4"/>
        </radialGradient>
        <filter id="sunGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Rotating ray group */}
      <g style={{transformOrigin:"18px 18px",animation:"sunSpin 8s linear infinite"}}>
        {[0,45,90,135,180,225,270,315].map((deg,i) => (
          <line
            key={deg}
            x1={18 + Math.cos(deg*Math.PI/180)*9}
            y1={18 + Math.sin(deg*Math.PI/180)*9}
            x2={18 + Math.cos(deg*Math.PI/180)*14}
            y2={18 + Math.sin(deg*Math.PI/180)*14}
            stroke={stop2}
            strokeWidth={i%2===0?"2":"1.2"}
            strokeLinecap="round"
            opacity={i%2===0?"0.9":"0.5"}
            filter="url(#sunGlow)"
          />
        ))}
      </g>

      {/* Pulsing halo */}
      <circle cx="18" cy="18" r="8" fill="none" stroke={stop1} strokeWidth="1"
        opacity="0.3" style={{transformOrigin:"18px 18px", animation:"sunHalo 2.4s ease-in-out infinite"}}/>

      {/* Core sun */}
      <circle cx="18" cy="18" r="6" fill="url(#sunCore)" filter="url(#sunGlow)"
        style={{transformOrigin:"18px 18px", animation:"sunPulse 2.4s ease-in-out infinite"}}/>

      {/* Inner bright spot */}
      <circle cx="16" cy="16" r="2" fill={stop2} opacity="0.6"
        style={{animation:"sunSparkle 2.4s ease-in-out infinite"}}/>
    </svg>
  );
}


// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK_THEME = {
  bg:         "#080c14",
  bgCard:     "#0d1825",
  bgHeader:   "#090e18",
  bgInput:    "#0d1825",
  bgDeep:     "#060d18",
  bgRow:      "#060e1a",
  bgTable:    "#0a1220",
  border:     "#1a2e45",
  borderSoft: "#1e3550",
  borderDeep: "#0d2035",
  text:       "#c9d6e8",
  textBright: "#e8f0fc",
  textMid:    "#8aa8c8",
  textDim:    "#4a6a8a",
  textDeep:   "#2a4060",
  accent:     "#0099ff",
  accentDark: "#0066cc",
  accentGlow: "rgba(0,153,255,0.15)",
  green:      "#10b981",
  greenBg:    "rgba(16,185,129,0.08)",
  greenBorder:"#1a4a2a",
  amber:      "#f59e0b",
  red:        "#ef4444",
  logoStop1:  "#0055ee",
  logoStop2:  "#00bbff",
  scrollThumb:"#1e3a5f",
  scrollTrack:"#0d1420",
  rowHover:   "rgba(0,180,255,0.04)",
};

const HORIZON_THEME = {
  bg:         "#f5ede0",
  bgCard:     "#fdf6ee",
  bgHeader:   "#f0e4d0",
  bgInput:    "#fdf6ee",
  bgDeep:     "#efe4d2",
  bgRow:      "#f7ede0",
  bgTable:    "#fdf6ee",
  border:     "#d4b896",
  borderSoft: "#c8a878",
  borderDeep: "#d4b896",
  text:       "#5c3d1e",
  textBright: "#2e1a08",
  textMid:    "#8b6040",
  textDim:    "#a07850",
  textDeep:   "#c4a070",
  accent:     "#c2571a",
  accentDark: "#a04010",
  accentGlow: "rgba(194,87,26,0.15)",
  green:      "#8a6a20",
  greenBg:    "rgba(138,106,32,0.08)",
  greenBorder:"#c4a050",
  amber:      "#b85010",
  red:        "#c03020",
  logoStop1:  "#c2571a",
  logoStop2:  "#e8831a",
  scrollThumb:"#c8a878",
  scrollTrack:"#efe4d2",
  rowHover:   "rgba(194,87,26,0.04)",
};

function useTheme() {
  const [horizon, setHorizon] = useState(() => localStorage.getItem("nexus-horizon") === "1");
  const toggleTheme = () => setHorizon(h => { localStorage.setItem("nexus-horizon", h?"0":"1"); return !h; });
  const t = horizon ? HORIZON_THEME : DARK_THEME;
  return { t, horizon, toggleTheme };
}

// ─── DEAL BADGES ──────────────────────────────────────────────────────────────
function NetworkingBadge({ value }) {
  if (!value) return null;
  const isIB = value === "IB";
  return (
    <div title={`Networking: ${value}`} style={{display:"inline-flex",alignItems:"center",gap:4,background:isIB?"rgba(139,92,246,0.15)":"rgba(0,153,255,0.12)",border:`1px solid ${isIB?"rgba(139,92,246,0.4)":"rgba(0,153,255,0.35)"}`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,color:isIB?"#a78bfa":"#38bdf8",letterSpacing:"0.04em",flexShrink:0}}>
      {isIB ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="6" cy="6" r="2" fill="currentColor"/>
          <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="6" y1="8" x2="6" y2="11" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="1" y1="6" x2="4" y2="6" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="8" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <circle cx="2.5" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="9.5" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="2.5" r="1.5" fill="currentColor"/>
          <line x1="4" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.1"/>
          <line x1="6" y1="4" x2="6" y2="6" stroke="currentColor" strokeWidth="1.1"/>
        </svg>
      )}
      {value}
    </div>
  );
}

function ArchitectureBadge({ value }) {
  if (!value) return null;
  const isBM = value === "BM";
  return (
    <div title={`Architecture: ${value}`} style={{display:"inline-flex",alignItems:"center",gap:4,background:isBM?"rgba(245,158,11,0.12)":"rgba(16,185,129,0.1)",border:`1px solid ${isBM?"rgba(245,158,11,0.35)":"rgba(16,185,129,0.3)"}`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,color:isBM?"#f59e0b":"#10b981",letterSpacing:"0.04em",flexShrink:0}}>
      {isBM ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="3" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="3.5" y1="3" x2="3.5" y2="9" stroke="currentColor" strokeWidth="1"/>
          <line x1="6" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="1"/>
          <line x1="8.5" y1="3" x2="8.5" y2="9" stroke="currentColor" strokeWidth="1"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="1.5" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="2" y="7.5" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
          <line x1="6" y1="6.5" x2="6" y2="7.5" stroke="currentColor" strokeWidth="1"/>
        </svg>
      )}
      {isBM ? "BM" : "VM"}
    </div>
  );
}

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const submit = () => {
    if (input === PASSWORD) { localStorage.setItem("nexus-auth", "1"); onUnlock("admin"); }
    else if (input === TECH_PASSWORD) { localStorage.setItem("nexus-auth", "tech"); onUnlock("tech"); }
    else { setError(true); setTimeout(() => setError(false), 1500); }
  };
  return (
    <div style={{minHeight:"100vh",background:"#080c14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace"}}>
      <div style={{background:"#0d1825",border:`1px solid ${error?"#ef4444":"#1e3550"}`,borderRadius:12,padding:40,width:380,textAlign:"center",transition:"border-color .2s"}}>
        <div style={{margin:"0 auto 20px",display:"flex",justifyContent:"center"}}><HorizonLogo size={56} stop1="#0055ee" stop2="#00bbff"/></div>
        <div style={{fontFamily:"sans-serif",fontSize:20,fontWeight:800,color:"#e8f0fc",marginBottom:4}}>HORIZON<span style={{color:"#0099ff"}}>COMPUTE</span></div>
        <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.15em",marginBottom:28}}>SALES INTELLIGENCE PLATFORM</div>
        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{background:"#060d18",border:`1px solid ${error?"#ef4444":"#1e3550"}`,color:"#c9d6e8",borderRadius:6,padding:"12px 16px",fontFamily:"inherit",fontSize:13,width:"100%",outline:"none",marginBottom:12,textAlign:"center",letterSpacing:"0.1em"}}
          autoFocus
        />
        {error && <div style={{color:"#ef4444",fontSize:11,marginBottom:8,letterSpacing:"0.08em"}}>Incorrect password</div>}
        <button onClick={submit} style={{background:"linear-gradient(135deg,#0066cc,#0099ff)",color:"#fff",border:"none",borderRadius:6,padding:"12px",width:"100%",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>
          Unlock
        </button>
      </div>
    </div>
  );
}

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDZcopBmsQntA-6Y2PSIUUTVoAiVcowBV4",
  authDomain: "nexusgpu-crm.firebaseapp.com",
  databaseURL: "https://nexusgpu-crm-default-rtdb.firebaseio.com",
  projectId: "nexusgpu-crm",
  storageBucket: "nexusgpu-crm.firebasestorage.app",
  messagingSenderId: "261264617385",
  appId: "1:261264617385:web:5d09be3103b03b5a401eb8",
};

const GPU_SPECS     = { H100: { gpusPerNode: 8 }, H200: { gpusPerNode: 8 } };
const GPU_TYPES     = ["H100", "H200"];
const PAYMENT_TERMS = ["Prepaid 30 Days", "Prepaid 1st of Month", "Prepaid", "Biweekly", "Monthly", "After Use"];
const STATUSES = [
  { label: "Not Started",   color: "#64748b", bg: "rgba(100,116,139,0.15)" },
  { label: "Testing",       color: "#f59e0b", bg: "rgba(245,158,11,0.15)"  },
  { label: "In Production", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  { label: "Finished",      color: "#3b82f6", bg: "rgba(59,130,246,0.15)"  },
  { label: "Terminated",    color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
];
const SEED_DEALS = [
  { id:"seed1", customer:"Hyperion AI", fullContractValue:4920000, paymentTerms:"Prepaid 30 Days", status:"In Production", startDate:"", endDate:"", gpuAllocations:[{id:"s11",gpuType:"H100",nodes:16,ratePerGpuHour:2.85},{id:"s12",gpuType:"H200",nodes:4,ratePerGpuHour:3.40}], storageValue:0, storage30Day:0, payments:[{id:"p101",amount:985600,datePaid:"2025-01-01",period:"Jan 2025"}], notes:"" },
  { id:"seed2", customer:"Stellarbit Corp", fullContractValue:980000, paymentTerms:"Prepaid 1st of Month", status:"Testing", startDate:"", endDate:"", gpuAllocations:[{id:"s21",gpuType:"H200",nodes:4,ratePerGpuHour:3.40}], storageValue:0, storage30Day:0, payments:[], notes:"" },
];

const fmt      = (n) => n==null||isNaN(n) ? "—" : "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtShort = (n) => { if(n==null||isNaN(n)) return "—"; if(n>=1_000_000) return "$"+(n/1_000_000).toFixed(2)+"M"; if(n>=1_000) return "$"+(n/1_000).toFixed(1)+"K"; return "$"+n.toFixed(2); };
const uid      = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
function calc30DayAlloc(a){ const s=GPU_SPECS[a.gpuType]; if(!s||!a.nodes||!a.ratePerGpuHour) return 0; return Number(a.nodes)*s.gpusPerNode*Number(a.ratePerGpuHour)*24*30; }
const calcGPU30Day   = (allocs) => (allocs||[]).reduce((s,a)=>s+calc30DayAlloc(a),0);
const calcGrand30Day = (deal)   => calcGPU30Day(deal.gpuAllocations)+(Number(deal.storage30Day)||0);
const totalCollected = (deal)   => (deal.payments||[]).reduce((s,p)=>s+(Number(p.amount)||0),0);
const emptyAlloc     = () => ({id:uid(),gpuType:"H100",nodes:"",ratePerGpuHour:""});
const emptyDeal      = () => ({id:uid(),customer:"",startDate:"",endDate:"",gpuAllocations:[emptyAlloc()],storageValue:"",storage30Day:"",fullContractValue:"",paymentTerms:PAYMENT_TERMS[0],status:"Not Started",payments:[],notes:"",networking:"",architecture:""});
const emptyPayment   = () => ({id:uid(),amount:"",datePaid:new Date().toISOString().slice(0,10),period:""});
const gpuStyle       = (t) => t==="H200"?{bg:"rgba(139,92,246,.2)",color:"#a78bfa"}:{bg:"rgba(0,153,255,.15)",color:"#38bdf8"};
const normDeal       = (d)  => ({storageValue:0,storage30Day:0,notes:"",startDate:"",endDate:"",networking:"",architecture:"",...d,gpuAllocations:d.gpuAllocations||[],payments:d.payments||[]});

export default function App() {
  const [authed, setAuthed] = useState(() => {
    const a = localStorage.getItem("nexus-auth");
    return a === "1" || a === "tech";
  });
  const [role, setRole] = useState(() => localStorage.getItem("nexus-auth") === "tech" ? "tech" : "admin");

  if (!authed) return <PasswordGate onUnlock={(r) => { setAuthed(true); setRole(r); }} />;
  return <CRM role={role} setRole={setRole} />;
}

function CRM({ role = "admin", setRole }) {
  const { t, horizon, toggleTheme } = useTheme();
  const isTech = role === "tech";
  const [showTechModal, setShowTechModal] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techError, setTechError] = useState(false);
  const switchToTech = () => {
    if (techInput === TECH_PASSWORD) {
      localStorage.setItem("nexus-auth","tech");
      setRole("tech"); setShowTechModal(false); setTechInput("");
    } else { setTechError(true); setTimeout(()=>setTechError(false),1500); }
  };
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState(false);
  const switchToAdmin = () => {
    if (adminInput === PASSWORD) {
      localStorage.setItem("nexus-auth","1"); setRole("admin");
      setShowAdminModal(false); setAdminInput("");
    } else { setAdminError(true); setTimeout(()=>setAdminError(false),1500); }
  };
  const [fbReady, setFbReady]           = useState(false);
  const [fbError, setFbError]           = useState(null);
  const [deals, setDeals]               = useState([]);
  const [loadState, setLoadState]       = useState("loading");
  const [saveState, setSaveState]       = useState("idle");
  const [editingId, setEditingId]       = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [modalTab, setModalTab]         = useState("gpu");
  const [form, setForm]                 = useState(emptyDeal());
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]             = useState("");
  const [sortKey, setSortKey]           = useState(null);
  const [sortDir, setSortDir]           = useState(1);
  const [expandedId, setExpandedId]     = useState(null);
  const [expandTab, setExpandTab]       = useState({});
  const [paymentForms, setPaymentForms] = useState({});
  const [editingPayment, setEditingPayment] = useState(null);
  const [hideValues, setHideValues]     = useState(false);
  const [onlineUsers, setOnlineUsers]   = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [showHistory, setShowHistory]   = useState(false);
  const [history, setHistory]           = useState([]);
  const fbLib   = useRef(null);
  const localOp = useRef(false);

  const logEvent = (type, message, detail="") => {
    const id = uid();
    const entry = { id, type, message, detail, ts: Date.now() };
    // Push to local history immediately
    setHistory(h => [entry, ...h].slice(0, 200));
    // Also persist to Firebase if available
    if (fbLib.current) {
      const { db, ref, set } = fbLib.current;
      set(ref(db, "history/" + id), entry);
    }
  };

  const pushNotif = (type, message, detail="") => {
    const id = uid();
    setNotifications(n => [{ id, type, message, detail, ts: Date.now() }, ...n.slice(0, 4)]);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.type  = "module";
    script.textContent = `
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
      import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
      const app = initializeApp(${JSON.stringify(FIREBASE_CONFIG)});
      const db  = getDatabase(app);
      window.__nexusFirebase = { db, ref, onValue, set, onDisconnect };
      window.dispatchEvent(new Event("nexus-firebase-ready"));
    `;
    document.head.appendChild(script);
    const onReady = () => {
      const { db, ref, onValue, set, onDisconnect } = window.__nexusFirebase;
      fbLib.current = window.__nexusFirebase;
      setFbReady(true);
      const presenceKey = uid();
      const presRef = ref(db, "presence/"+presenceKey);
      set(presRef, {online:true,t:Date.now()});
      onDisconnect(presRef).remove();
      onValue(ref(db,"presence"), snap=>{ const v=snap.val(); setOnlineUsers(v?Object.keys(v).length:1); });
      onValue(ref(db,"history"), snap=>{
        const val = snap.val();
        if (val && typeof val === "object") {
          const items = Object.values(val).sort((a,b) => b.ts - a.ts);
          setHistory(items);
        }
      });
      onValue(ref(db,"deals"), snap=>{
        if(localOp.current){localOp.current=false;return;}
        const val=snap.val();
        if(val&&typeof val==="object"){ setDeals(Object.values(val).map(normDeal)); setLoadState("ready"); }
        else { const obj={}; SEED_DEALS.forEach(d=>{obj[d.id]=d;}); set(ref(db,"deals"),obj); setDeals(SEED_DEALS); setLoadState("ready"); }
      }, err=>{ setFbError(err.message); setDeals(SEED_DEALS); setLoadState("ready"); });
    };
    window.addEventListener("nexus-firebase-ready", onReady);
    return ()=>window.removeEventListener("nexus-firebase-ready", onReady);
  }, []);

  const persistDeals = useCallback(async(next)=>{
    if(!fbLib.current) return;
    const{db,ref,set}=fbLib.current;
    setSaveState("saving");
    try{ const obj={}; next.forEach(d=>{obj[d.id]=d;}); localOp.current=true; await set(ref(db,"deals"),obj); setSaveState("saved"); setTimeout(()=>setSaveState("idle"),2000); }
    catch{ setSaveState("error"); setTimeout(()=>setSaveState("idle"),3000); }
  },[]);

  const updateDeals = useCallback((updater)=>{
    setDeals(prev=>{ const next=typeof updater==="function"?updater(prev):updater; persistDeals(next); return next; });
  },[persistDeals]);

  const openNew    = () => { setForm(emptyDeal()); setEditingId(null); setModalTab("gpu"); setShowModal(true); };
  const openEdit   = (deal) => { setForm({...normDeal(deal),gpuAllocations:(deal.gpuAllocations||[]).map(a=>({...a})),payments:deal.payments||[]}); setEditingId(deal.id); setModalTab("gpu"); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingId(null); };
  const saveDeal   = () => {
    if(!form.customer.trim()) return;
    const deal={...form,fullContractValue:Number(form.fullContractValue)||0,storageValue:Number(form.storageValue)||0,storage30Day:Number(form.storage30Day)||0,startDate:form.startDate||"",endDate:form.endDate||"",payments:form.payments||[],notes:form.notes||"",gpuAllocations:(form.gpuAllocations||[]).map(a=>({...a,nodes:Number(a.nodes)||0,ratePerGpuHour:Number(a.ratePerGpuHour)||0})).filter(a=>a.nodes>0&&a.ratePerGpuHour>0)};
    if(editingId) {
      updateDeals(d=>d.map(x=>x.id===editingId?deal:x));
      logEvent("edit", "Deal edited", deal.customer);
      pushNotif("edit", "Deal edited", deal.customer);
    } else {
      updateDeals(d=>[...d,{...deal,id:uid()}]);
      logEvent("new_deal", "New deal added", deal.customer);
      pushNotif("new_deal", "New deal added", deal.customer);
    }
    closeModal();
  };
  const addAlloc    = () => setForm(f=>({...f,gpuAllocations:[...f.gpuAllocations,emptyAlloc()]}));
  const removeAlloc = (id) => setForm(f=>({...f,gpuAllocations:f.gpuAllocations.filter(a=>a.id!==id)}));
  const updateAlloc = (id,k,v) => setForm(f=>({...f,gpuAllocations:f.gpuAllocations.map(a=>a.id===id?{...a,[k]:v}:a)}));
  const deleteDeal  = (id) => { const d0=deals.find(x=>x.id===id); updateDeals(d=>d.filter(x=>x.id!==id)); if(expandedId===id) setExpandedId(null); if(d0){logEvent("delete_deal","Deal deleted",d0.customer);pushNotif("delete_deal","Deal deleted",d0.customer);} };
  const toggleExpand = (id,tab="payments") => { if(expandedId===id&&(expandTab[id]||"payments")===tab) setExpandedId(null); else{setExpandedId(id);setExpandTab(p=>({...p,[id]:tab}));} };
  const getPF=(id)=>paymentForms[id]||emptyPayment();
  const setPF=(id,v)=>setPaymentForms(p=>({...p,[id]:v}));
  const addPayment=(dealId)=>{ const pf=getPF(dealId); if(!pf.amount||!pf.datePaid) return; const d0=deals.find(x=>x.id===dealId); updateDeals(d=>d.map(x=>x.id===dealId?{...x,payments:[...(x.payments||[]),{id:uid(),amount:Number(pf.amount),datePaid:pf.datePaid,period:pf.period}]}:x)); setPF(dealId,emptyPayment()); if(d0){const msg=`$${Number(pf.amount).toLocaleString()} payment`;logEvent("payment_added","Payment added",`${msg} — ${d0.customer}`);pushNotif("payment_added","Payment added",`${msg} · ${d0.customer}`);}};
  const deletePayment=(dealId,pid)=>{ const d0=deals.find(x=>x.id===dealId); const p0=d0&&(d0.payments||[]).find(p=>p.id===pid); updateDeals(d=>d.map(x=>x.id===dealId?{...x,payments:(x.payments||[]).filter(p=>p.id!==pid)}:x)); if(d0&&p0){logEvent("payment_deleted","Payment deleted",`$${Number(p0.amount).toLocaleString()} — ${d0.customer}`);pushNotif("payment_deleted","Payment deleted",`$${Number(p0.amount).toLocaleString()} · ${d0.customer}`);}};
  const saveNotes=(dealId,notes)=>updateDeals(d=>d.map(x=>x.id===dealId?{...x,notes}:x));
  const startEditPayment=(dealId,p)=>setEditingPayment({dealId,paymentId:p.id,amount:String(p.amount),datePaid:p.datePaid,period:p.period||""});
  const cancelEditPayment=()=>setEditingPayment(null);
  const saveEditPayment=()=>{ if(!editingPayment||!editingPayment.amount) return; const{dealId,paymentId,amount,datePaid,period}=editingPayment; updateDeals(d=>d.map(x=>x.id===dealId?{...x,payments:(x.payments||[]).map(p=>p.id===paymentId?{...p,amount:Number(amount),datePaid,period}:p)}:x)); setEditingPayment(null); };
  const toggleSort=(key)=>{ if(sortKey===key) setSortDir(d=>-d); else{setSortKey(key);setSortDir(1);} };

  const visible=useMemo(()=>{ let list=deals.filter(d=>(filterStatus==="All"||d.status===filterStatus)&&d.customer.toLowerCase().includes(search.toLowerCase())); if(sortKey) list=[...list].sort((a,b)=>{ let av=sortKey==="totalCollected"?totalCollected(a):sortKey==="grand30"?calcGrand30Day(a):a[sortKey]; let bv=sortKey==="totalCollected"?totalCollected(b):sortKey==="grand30"?calcGrand30Day(b):b[sortKey]; if(typeof av==="string"){av=av.toLowerCase();bv=bv.toLowerCase();} return av<bv?-sortDir:av>bv?sortDir:0; }); return list; },[deals,filterStatus,search,sortKey,sortDir]);
  const MAX_H100=128,MAX_H200=65;
  const totals=useMemo(()=>{ const h100=deals.reduce((s,d)=>s+(d.gpuAllocations||[]).filter(a=>a.gpuType==="H100").reduce((ss,a)=>ss+(Number(a.nodes)||0),0),0); const h200=deals.reduce((s,d)=>s+(d.gpuAllocations||[]).filter(a=>a.gpuType==="H200").reduce((ss,a)=>ss+(Number(a.nodes)||0),0),0); return{deals:visible.length,pipeline:visible.reduce((s,d)=>s+(d.fullContractValue||0),0),collected:visible.reduce((s,d)=>s+totalCollected(d),0),monthly:visible.reduce((s,d)=>s+calcGrand30Day(d),0),h100Nodes:h100,h200Nodes:h200}; },[visible,deals]);
  const statusOf=(label)=>STATUSES.find(s=>s.label===label)||STATUSES[0];
  const saveBadge={saving:{color:"#f59e0b",text:"● Saving…",pulse:true},saved:{color:"#10b981",text:"✓ Saved",pulse:false},error:{color:"#ef4444",text:"✕ Save failed",pulse:false}}[saveState];
  const modal30=useMemo(()=>calcGPU30Day(form.gpuAllocations)+(Number(form.storage30Day)||0),[form.gpuAllocations,form.storage30Day]);
  const tabBtn=(active)=>({background:active?t.accentGlow:"transparent",border:`1px solid ${active?t.accent:t.borderSoft}`,color:active?t.accent:t.textDim,borderRadius:4,padding:"6px 16px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all .15s"});
  const inlineTabBtn=(active)=>({background:"transparent",border:"none",borderBottom:`2px solid ${active?t.accent:"transparent"}`,color:active?t.accent:t.textDim,padding:"6px 14px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all .15s"});
  const Redacted=({w=64})=><span style={{display:"inline-block",background:t.borderSoft,borderRadius:4,minWidth:w,height:"0.85em",verticalAlign:"middle"}}>&nbsp;</span>;
  const isMobile = useIsMobile();

  if (isMobile) return (
    <MobileCRM
      deals={deals} visible={visible} totals={totals} loadState={loadState}
      fbReady={fbReady} onlineUsers={onlineUsers} saveBadge={saveBadge}
      t={t} horizon={horizon} toggleTheme={toggleTheme}
      hideValues={hideValues} setHideValues={setHideValues}
      search={search} setSearch={setSearch}
      filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      expandedId={expandedId} toggleExpand={toggleExpand} expandTab={expandTab} setExpandTab={setExpandTab}
      paymentForms={paymentForms} setPF={setPF} getPF={getPF}
      addPayment={addPayment} deletePayment={deletePayment}
      editingPayment={editingPayment} startEditPayment={startEditPayment}
      cancelEditPayment={cancelEditPayment} saveEditPayment={saveEditPayment} setEditingPayment={setEditingPayment}
      openNew={openNew} openEdit={openEdit} deleteDeal={deleteDeal}
      saveNotes={saveNotes} notifications={notifications} setNotifications={setNotifications}
      showHistory={showHistory} setShowHistory={setShowHistory} history={history}
      showModal={showModal} closeModal={closeModal} saveDeal={saveDeal}
      form={form} setForm={setForm} modalTab={modalTab} setModalTab={setModalTab}
      editingId={editingId} modal30={modal30}
      addAlloc={addAlloc} removeAlloc={removeAlloc} updateAlloc={updateAlloc}
      MAX_H100={MAX_H100} MAX_H200={MAX_H200}
      isTech={isTech} role={role} setRole={setRole}
    />
  );

  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:t.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;} ::-webkit-scrollbar{width:6px;height:6px;} ::-webkit-scrollbar-track{background:${t.scrollTrack};} ::-webkit-scrollbar-thumb{background:${t.scrollThumb};border-radius:3px;}
        .row-hover:hover{background:${t.rowHover}!important;}
        .btn-primary{background:linear-gradient(135deg,${t.accentDark},${t.accent});color:#fff;border:none;border-radius:4px;padding:9px 20px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;transition:opacity .15s;} .btn-primary:hover{opacity:.85;}
        .btn-sm{background:linear-gradient(135deg,${t.accentDark},${t.accent});color:#fff;border:none;border-radius:4px;padding:6px 14px;font-family:inherit;font-size:11px;font-weight:600;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;transition:opacity .15s;white-space:nowrap;} .btn-sm:hover{opacity:.85;}
        .btn-ghost{background:transparent;color:${t.textMid};border:1px solid ${t.borderSoft};border-radius:4px;padding:7px 14px;font-family:inherit;font-size:11px;cursor:pointer;letter-spacing:0.06em;transition:all .15s;} .btn-ghost:hover{border-color:${t.accent};color:${t.accent};}
        .btn-danger{background:transparent;color:#ef4444;border:1px solid #3a1a1a;border-radius:4px;padding:5px 10px;font-family:inherit;font-size:11px;cursor:pointer;transition:all .15s;} .btn-danger:hover{background:rgba(239,68,68,.1);border-color:#ef4444;}
        .btn-icon{background:transparent;border:1px solid #1e3550;color:#4a6a8a;border-radius:4px;padding:4px 8px;font-family:inherit;font-size:11px;cursor:pointer;transition:all .15s;} .btn-icon:hover{border-color:#ef4444;color:#ef4444;}
        .btn-expand{background:transparent;border:none;color:#4a6a8a;cursor:pointer;font-family:inherit;font-size:12px;padding:2px 6px;transition:color .15s;} .btn-expand:hover{color:#0099ff;}
        input,select{background:${t.bgInput};border:1px solid ${t.borderSoft};color:${t.text};border-radius:4px;padding:9px 12px;font-family:inherit;font-size:12px;width:100%;outline:none;transition:border-color .15s;} input:focus,select:focus{border-color:${t.accent};} select option{background:${t.bgInput};}
        textarea{background:${t.bgInput};border:1px solid ${t.borderSoft};color:${t.text};border-radius:4px;padding:10px 12px;font-family:inherit;font-size:12px;width:100%;outline:none;transition:border-color .15s;resize:vertical;line-height:1.6;} textarea:focus{border-color:${t.accent};}
        .stat-card{background:${t.bgCard};border:1px solid ${t.border};border-radius:8px;padding:20px 24px;}
        th{cursor:pointer;user-select:none;} th:hover{color:#0099ff;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px);}
        .modal{background:${t.bgCard};border:1px solid ${t.borderSoft};border-radius:12px;padding:32px;width:640px;max-width:96vw;max-height:92vh;overflow-y:auto;}
        .filter-pill{padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.07em;cursor:pointer;border:1px solid transparent;transition:all .15s;text-transform:uppercase;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} .pulsing{animation:pulse 1.2s ease-in-out infinite;}
        @keyframes livepulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}} .livepulse{animation:livepulse 2s ease-in-out infinite;}
        .payment-input{background:${t.bgDeep};border:1px solid ${t.borderDeep};color:${t.text};border-radius:4px;padding:7px 10px;font-family:inherit;font-size:11px;width:100%;outline:none;transition:border-color .15s;} .payment-input:focus{border-color:${t.accent};}
        .expand-row{background:${t.bgRow};}
        .alloc-row{display:grid;grid-template-columns:110px 1fr 1fr 1fr auto;gap:10px;align-items:flex-end;margin-bottom:10px;}
        .add-alloc-btn{background:transparent;border:1px dashed ${t.borderSoft};color:${t.textDim};border-radius:6px;padding:8px;width:100%;font-family:inherit;font-size:11px;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;transition:all .15s;margin-top:4px;} .add-alloc-btn:hover{border-color:${t.accent};color:${t.accent};}
        .gpu-badge{display:inline-block;padding:3px 8px;border-radius:4px;font-weight:600;font-size:10px;}
        .inline-tab-bar{display:flex;border-bottom:1px solid ${t.borderDeep};margin-bottom:14px;}
        .notes-area{background:${t.bgDeep};border:1px solid ${t.borderDeep};color:${t.textMid};font-family:inherit;font-size:11px;width:100%;outline:none;resize:vertical;line-height:1.7;padding:12px 14px;min-height:110px;border-radius:6px;transition:border-color .15s;} .notes-area:focus{border-color:${t.accent};color:${t.text};}
        @keyframes sunSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sunPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.85}}
        @keyframes sunHalo{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.4);opacity:0}}
        @keyframes sunSparkle{0%,100%{opacity:0.6;transform:translate(0,0)}33%{opacity:1;transform:translate(1px,-1px)}66%{opacity:0.4;transform:translate(-1px,1px)}}
        @keyframes scan1{0%,100%{opacity:.1}40%{opacity:.95}} @keyframes scan2{0%,100%{opacity:.1}55%{opacity:.95}} @keyframes scan3{0%,100%{opacity:.1}70%{opacity:.95}}
        @keyframes pinA{0%,100%{opacity:.3}50%{opacity:1}} @keyframes core200{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes ring200{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes pinB{0%,100%{opacity:.25}60%{opacity:1}}
        @keyframes sunSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sunPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.85}}
        @keyframes sunHalo{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.4);opacity:0}}
        @keyframes sunSparkle{0%,100%{opacity:0.6;transform:translate(0,0)}33%{opacity:1;transform:translate(1px,-1px)}66%{opacity:0.4;transform:translate(-1px,1px)}}
        .sc1{animation:scan1 1.8s ease-in-out infinite} .sc2{animation:scan2 1.8s ease-in-out infinite} .sc3{animation:scan3 1.8s ease-in-out infinite}
        .pA{animation:pinA 1.4s ease-in-out infinite} .co200{animation:core200 1.6s ease-in-out infinite}
        .ri200{transform-origin:14px 14px;animation:ring200 3s linear infinite} .pB{animation:pinB 1.6s ease-in-out infinite}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${t.border}`,padding:"18px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:t.bgHeader,flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <HorizonLogo size={36} stop1={t.logoStop1} stop2={t.logoStop2}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:t.textBright,letterSpacing:"0.02em"}}>HORIZON<span style={{color:"#0099ff"}}>COMPUTE</span></div>
            <div style={{fontSize:10,color:t.textDim,letterSpacing:"0.15em",textTransform:"uppercase"}}>Sales Intelligence Platform</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          {saveBadge&&<span style={{fontSize:11,color:saveBadge.color,letterSpacing:"0.06em"}} className={saveBadge.pulse?"pulsing":""}>{saveBadge.text}</span>}
          {fbError&&<span style={{fontSize:10,color:"#ef4444"}}>⚠ {fbError}</span>}
          <span style={{fontSize:10,display:"flex",alignItems:"center",gap:5,color:fbReady?"#10b981":"#f59e0b",background:fbReady?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",border:`1px solid ${fbReady?"#1a4a2a":"#4a3000"}`,borderRadius:4,padding:"4px 10px",letterSpacing:"0.08em"}}>
            <span className={fbReady?"livepulse":""} style={{fontSize:8}}>●</span>
            {fbReady?`LIVE · ${onlineUsers} ONLINE`:"CONNECTING…"}
          </span>
          {isTech && <span style={{fontSize:10,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",color:"#a78bfa",borderRadius:4,padding:"4px 12px",letterSpacing:"0.1em",fontWeight:700}}>👷 TECH VIEW</span>}
          {!isTech && <button onClick={()=>setHideValues(h=>!h)} style={{background:hideValues?"rgba(239,68,68,0.12)":t.accentGlow,border:`1px solid ${hideValues?t.red:t.borderSoft}`,color:hideValues?t.red:t.textDim,borderRadius:4,padding:"6px 14px",fontFamily:"inherit",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .2s"}}>
            {hideValues?"🔒 Values Hidden":"👁 Hide Values"}
          </button>}
          {!isTech && <button onClick={()=>setShowHistory(true)} style={{background:"rgba(0,153,255,0.08)",border:"1px solid #1e3550",color:"#4a8aaa",borderRadius:4,padding:"6px 14px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all .15s",position:"relative"}} onMouseOver={e=>e.currentTarget.style.borderColor="#0099ff"} onMouseOut={e=>e.currentTarget.style.borderColor="#1e3550"}>
            🕐 History{history.length>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#0099ff",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{history.length>99?"99+":history.length}</span>}
          </button>}
          {isTech && history.length>0 && (
            <span style={{fontSize:10,color:"#2a6a4a",background:"rgba(16,185,129,0.06)",border:"1px solid #1a3a2a",borderRadius:4,padding:"4px 12px",letterSpacing:"0.06em"}}>
              🟢 UPDATED {(()=>{const d=new Date(history[0].ts);const now=new Date();const mins=Math.floor((now-d)/60000);if(mins<1)return"JUST NOW";if(mins<60)return`${mins}m AGO`;const hrs=Math.floor(mins/60);if(hrs<24)return`${hrs}h AGO`;return d.toLocaleDateString([],{month:"short",day:"numeric"});})()}
            </span>
          )}
          <button className="btn-primary" onClick={openNew}>+ New Deal</button>
        </div>
      </div>

      {/* Notification Bar */}
      {notifications.length > 0 && (
        <div style={{background:t.bgDeep,borderBottom:`1px solid ${t.borderDeep}`,padding:"0 16px"}}>
          {notifications.map((n, i) => {
            const icons = {new_deal:"🟢", edit:"✏️", payment_added:"💳", payment_deleted:"🗑", delete_deal:"❌"};
            const colors = {new_deal:"#10b981", edit:"#0099ff", payment_added:"#10b981", payment_deleted:"#f59e0b", delete_deal:"#ef4444"};
            return (
              <div key={n.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<notifications.length-1?"1px solid #0a1a2a":"none",opacity:i===0?1:0.5}}>
                <span style={{fontSize:13}}>{icons[n.type]||"•"}</span>
                <span style={{fontSize:11,color:colors[n.type]||"#c9d6e8",fontWeight:600,letterSpacing:"0.06em"}}>{n.message}</span>
                {n.detail&&<span style={{fontSize:11,color:"#4a6a8a"}}>— {n.detail}</span>}
                <span style={{fontSize:10,color:"#2a4060",marginLeft:"auto"}}>{new Date(n.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                {i===0&&<button onClick={()=>setNotifications([])} style={{background:"none",border:"none",color:"#2a4060",cursor:"pointer",fontSize:14,padding:"0 4px",lineHeight:1}} title="Dismiss all">×</button>}
              </div>
            );
          })}
        </div>
      )}

      {/* History Side Panel */}
      {showHistory && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
          <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setShowHistory(false)}/>
          <div style={{width:420,background:t.bgHeader,borderLeft:`1px solid ${t.border}`,display:"flex",flexDirection:"column",height:"100vh",overflowY:"auto"}}>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:t.bgHeader,zIndex:1}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:t.textBright}}>Activity History</div>
                <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em",marginTop:2}}>{history.length} EVENTS</div>
              </div>
              <button onClick={()=>setShowHistory(false)} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
            </div>
            <div style={{padding:"16px 24px",flex:1}}>
              {history.length === 0 && <div style={{color:"#2a4060",fontSize:12,textAlign:"center",marginTop:40}}>No activity yet.</div>}
              {history.map(e => {
                const icons = {new_deal:"🟢", edit:"✏️", payment_added:"💳", payment_deleted:"🗑", delete_deal:"❌"};
                const colors = {new_deal:"#10b981", edit:"#0099ff", payment_added:"#10b981", payment_deleted:"#f59e0b", delete_deal:"#ef4444"};
                const d = new Date(e.ts);
                const dateStr = d.toLocaleDateString([],{month:"short",day:"numeric"});
                const timeStr = d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                return (
                  <div key={e.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid #0a1520"}}>
                    <div style={{fontSize:16,minWidth:22,textAlign:"center",marginTop:1}}>{icons[e.type]||"•"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:colors[e.type]||"#c9d6e8",fontWeight:600}}>{e.message}</div>
                      {e.detail&&<div style={{fontSize:11,color:"#4a6a8a",marginTop:2}}>{e.detail}</div>}
                      <div style={{fontSize:10,color:"#2a4060",marginTop:4,letterSpacing:"0.06em"}}>{dateStr} · {timeStr}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {loadState==="loading"&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,gap:12,color:t.textDeep}}><span className="pulsing" style={{fontSize:20}}>◈</span><span style={{fontSize:13,letterSpacing:"0.12em"}}>CONNECTING TO FIREBASE…</span></div>}

      {loadState==="ready"&&(
        <div style={{padding:"28px 32px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:28}}>
            {(isTech?[{label:"Active Deals",value:String(totals.deals),plain:true}]:[{label:"Active Deals",value:String(totals.deals),plain:true},{label:"30-Day Run Rate",value:fmtShort(totals.monthly)},{label:"Total Collected",value:fmtShort(totals.collected)}]).map(s=>(
              <div className="stat-card" key={s.label}>
                <div style={{fontSize:10,color:t.textDim,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>{s.label}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:700,color:t.textBright,minHeight:34}}>
                  {(hideValues&&!s.plain)?<span style={{display:"inline-block",background:"#1e3a50",borderRadius:6,minWidth:100,height:28}}>&nbsp;</span>:s.value}
                </div>
              </div>
            ))}

            {/* Node Utilization */}
            <div className="stat-card">
              <div style={{fontSize:10,color:t.textDim,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Node Utilization</div>
              {[
                {type:"H100",used:totals.h100Nodes,max:MAX_H100,color:"#38bdf8",bg:"rgba(56,189,248,0.15)"},
                {type:"H200",used:totals.h200Nodes,max:MAX_H200,color:"#a78bfa",bg:"rgba(139,92,246,0.15)"},
              ].map(({type,used,max,color,bg})=>{
                const pct=Math.min(used/max,1); const warn=pct>=0.9; const barColor=warn?"#ef4444":pct>=0.7?"#f59e0b":color;
                const isH200=type==="H200";
                return (
                  <div key={type} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        {isH200 ? (
                          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                            <rect x="6" y="6" width="16" height="16" rx="2.5" fill="#100820" stroke="#a78bfa" strokeWidth="1.3"/>
                            <circle className="ri200" cx="14" cy="14" r="4.5" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="8 4" strokeLinecap="round"/>
                            <circle className="co200" cx="14" cy="14" r="3.2" fill="#a78bfa"/>
                            <circle cx="14" cy="14" r="1.4" fill="#e8d8ff"/>
                            {[8.5,11.5,14.5,17.5].map(x=><rect key={"t"+x} className="pB" x={x} y="3" width="1.8" height="2.5" rx=".6" fill="#a78bfa"/>)}
                            {[8.5,11.5,14.5,17.5].map(x=><rect key={"b"+x} className="pB" x={x} y="22.5" width="1.8" height="2.5" rx=".6" fill="#a78bfa"/>)}
                            {[8.5,11.5,14.5,17.5].map(y=><rect key={"l"+y} className="pB" x="3" y={y} width="2.5" height="1.8" rx=".6" fill="#a78bfa"/>)}
                            {[8.5,11.5,14.5,17.5].map(y=><rect key={"r"+y} className="pB" x="22.5" y={y} width="2.5" height="1.8" rx=".6" fill="#a78bfa"/>)}
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                            <rect x="6" y="6" width="16" height="16" rx="2.5" fill="#061420" stroke="#38bdf8" strokeWidth="1.3"/>
                            <rect className="sc1" x="9" y="10" width="10" height="1.5" rx=".75" fill="#38bdf8"/>
                            <rect className="sc2" x="9" y="13.25" width="10" height="1.5" rx=".75" fill="#38bdf8"/>
                            <rect className="sc3" x="9" y="16.5" width="10" height="1.5" rx=".75" fill="#38bdf8"/>
                            {[8.5,11.5,14.5,17.5].map(x=><rect key={"t"+x} className="pA" x={x} y="3" width="1.8" height="2.5" rx=".6" fill="#38bdf8"/>)}
                            {[8.5,11.5,14.5,17.5].map(x=><rect key={"b"+x} className="pA" x={x} y="22.5" width="1.8" height="2.5" rx=".6" fill="#38bdf8"/>)}
                            {[8.5,11.5,14.5,17.5].map(y=><rect key={"l"+y} className="pA" x="3" y={y} width="2.5" height="1.8" rx=".6" fill="#38bdf8"/>)}
                            {[8.5,11.5,14.5,17.5].map(y=><rect key={"r"+y} className="pA" x="22.5" y={y} width="2.5" height="1.8" rx=".6" fill="#38bdf8"/>)}
                          </svg>
                        )}
                        <span style={{background:bg,color,padding:"2px 7px",borderRadius:3,fontSize:10,fontWeight:700}}>{type}</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:warn?"#ef4444":color}}>{used}<span style={{color:"#3a5a7a",fontWeight:400}}>/{max}</span></span>
                    </div>
                    <div style={{height:5,background:"#0d1825",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct*100}%`,background:barColor,borderRadius:3,transition:"width .4s ease"}}/>
                    </div>
                    <div style={{fontSize:9,color:warn?"#ef4444":"#2a4a6a",marginTop:3,letterSpacing:"0.08em",textAlign:"right"}}>{Math.round(pct*100)}% UTILIZED · {max-used} FREE</div>
                  </div>
                );
              })}
            </div>
          {/* Config Breakdown Card */}
          <div className="stat-card">
            <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Config Breakdown</div>
            {[
              {label:"RoCE v2 + VM", net:"RoCE v2", arch:"VM", color:"#38bdf8"},
              {label:"RoCE v2 + BM", net:"RoCE v2", arch:"BM", color:"#10b981"},
              {label:"IB + BM",      net:"IB",      arch:"BM", color:"#a78bfa"},
            ].map(({label,net,arch,color})=>{
              const nodes = deals.filter(d=>d.networking===net&&d.architecture===arch).reduce((s,d)=>(d.gpuAllocations||[]).reduce((ss,a)=>ss+(Number(a.nodes)||0),s),0);
              const pct = Math.min(nodes/193,1);
              return (
                <div key={label} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,color:nodes>0?color:"#2a4a6a",fontWeight:nodes>0?600:400,letterSpacing:"0.06em"}}>{label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:nodes>0?color:"#1e3a5a"}}>{nodes}<span style={{color:"#2a4a6a",fontWeight:400,fontSize:10}}>/193</span></span>
                  </div>
                  <div style={{height:4,background:"#0a1220",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct*100}%`,background:color,borderRadius:2,transition:"width .4s ease",opacity:nodes>0?1:0.3}}/>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            <input style={{width:220}} placeholder="Search customer…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["All",...STATUSES.map(s=>s.label)].map(s=>{ const active=filterStatus===s; const st=STATUSES.find(x=>x.label===s); return <button key={s} className="filter-pill" onClick={()=>setFilterStatus(s)} style={{background:active?(st?st.bg:t.accentGlow):"transparent",borderColor:active?(st?st.color:t.accent):t.borderSoft,color:active?(st?st.color:t.accent):t.textDim}}>{s}</button>; })}
            </div>
          </div>

          <div style={{overflowX:"auto",background:t.bgTable,border:`1px solid ${t.border}`,borderRadius:10}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${t.border}`,background:t.bgHeader}}>
                  <th style={{width:32,padding:"13px 8px 13px 16px"}}></th>
                  {[["customer","Customer"],["startDate","Start Date"],["endDate","End Date"],[null,"GPU Allocations"],[null,"Nodes"],
                    ...(isTech?[]:[
                      [null,"Storage"],["grand30","30-Day Total"],["fullContractValue","Full Contract"],
                      ["paymentTerms","Payment Terms"],["totalCollected","Collected"]
                    ]),
                    ["status","Status"],[null,"Actions"]
                  ].map(([key,label])=>(
                    <th key={label} onClick={()=>key&&toggleSort(key)} style={{padding:"13px 16px",textAlign:"left",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:sortKey===key?t.accent:t.textDim,fontWeight:600,whiteSpace:"nowrap"}}>{label}{key&&sortKey===key?(sortDir===1?" ↑":" ↓"):""}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length===0&&<tr><td colSpan={13} style={{textAlign:"center",padding:48,color:"#2a4a6a",fontSize:13}}>No deals found</td></tr>}
                {visible.map(deal=>{
                  const allocs=deal.gpuAllocations||[]; const gpu30=calcGPU30Day(allocs); const stor30=Number(deal.storage30Day)||0; const grand30=gpu30+stor30;
                  const st=statusOf(deal.status); const collected=totalCollected(deal); const isExp=expandedId===deal.id; const curTab=expandTab[deal.id]||"payments";
                  const pf=getPF(deal.id); const totalNodes=allocs.reduce((s,a)=>s+(Number(a.nodes)||0),0); const hasNotes=!!(deal.notes&&deal.notes.trim());
                  return [
                    <tr key={deal.id} className="row-hover" style={{borderBottom:isExp?"none":`1px solid ${t.borderDeep}`,transition:"background .1s",background:isExp?"rgba(0,100,200,0.04)":"transparent"}}>
                      <td style={{padding:"13px 8px 13px 16px"}}><button className="btn-expand" onClick={()=>toggleExpand(deal.id,curTab)}><span style={{fontSize:10,display:"inline-block",transition:"transform .2s",transform:isExp?"rotate(90deg)":"rotate(0deg)"}}>▶</span></button></td>
                      <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{color:t.textBright,fontWeight:500}}>{deal.customer||"—"}</span>{hasNotes&&<span style={{fontSize:11,color:"#f59e0b"}}>✎</span>}<NetworkingBadge value={deal.networking}/><ArchitectureBadge value={deal.architecture}/></div></td>
                      <td style={{padding:"13px 16px",color:t.textMid,fontSize:11,whiteSpace:"nowrap"}}>{deal.startDate||"—"}</td>
                      <td style={{padding:"13px 16px",color:"#8aa8c8",fontSize:11,whiteSpace:"nowrap"}}>{deal.endDate||"—"}</td>
                      <td style={{padding:"13px 16px"}}><div style={{display:"flex",flexDirection:"column",gap:4}}>{allocs.length===0?<span style={{color:"#2a4060"}}>—</span>:allocs.map(a=>{const gs=gpuStyle(a.gpuType);return <div key={a.id} style={{display:"flex",alignItems:"center",gap:6}}><span className="gpu-badge" style={{background:gs.bg,color:gs.color}}>{a.gpuType}</span>{!hideValues&&!isTech&&<span style={{color:"#5a7a9a",fontSize:11}}>${Number(a.ratePerGpuHour||0).toFixed(2)}/hr</span>}</div>;})}</div></td>
                      <td style={{padding:"13px 16px"}}><div style={{display:"flex",flexDirection:"column",gap:4}}>{allocs.length===0?<span style={{color:"#2a4060"}}>—</span>:allocs.map(a=>{const gs=gpuStyle(a.gpuType);return <div key={a.id} style={{fontSize:11,color:"#8aa8c8"}}><span style={{color:gs.color,fontWeight:600}}>{a.nodes||0}</span><span style={{color:"#3a5a7a"}}> nodes</span></div>;})}{allocs.length>1&&<div style={{fontSize:10,color:"#3a5a7a",borderTop:"1px solid #0d1e30",paddingTop:3,marginTop:1}}>={totalNodes} total</div>}</div></td>
                      {!isTech&&<td style={{padding:"13px 16px"}}>{hideValues?<Redacted/>:(deal.storageValue||deal.storage30Day)?<div style={{display:"flex",flexDirection:"column",gap:3}}>{deal.storageValue?<span style={{fontSize:11,color:"#c9d6e8"}}>{fmtShort(Number(deal.storageValue))}</span>:null}{deal.storage30Day?<span style={{fontSize:10,color:"#f59e0b"}}>{fmtShort(Number(deal.storage30Day))}<span style={{color:"#4a4020"}}>/30d</span></span>:null}</div>:<span style={{color:"#2a4060",fontSize:11}}>—</span>}</td>}
                      {!isTech&&<td style={{padding:"13px 16px"}}>{hideValues?<Redacted/>:<div style={{display:"flex",flexDirection:"column",gap:3}}>{allocs.map(a=>{const v=calc30DayAlloc(a);const gs=gpuStyle(a.gpuType);return v>0?<div key={a.id} style={{fontSize:11}}><span style={{color:gs.color,fontSize:10,marginRight:4}}>{a.gpuType}</span><span style={{color:"#10b981"}}>{fmtShort(v)}</span></div>:null;})}{stor30>0&&<div style={{fontSize:11}}><span style={{color:"#f59e0b",fontSize:10,marginRight:4}}>STOR</span><span style={{color:"#10b981"}}>{fmtShort(stor30)}</span></div>}{grand30>0&&(allocs.length>1||stor30>0)&&<div style={{fontSize:12,color:"#10b981",fontWeight:700,borderTop:"1px solid #0d1e30",paddingTop:3,marginTop:1}}>={fmtShort(grand30)}</div>}{grand30>0&&allocs.length===1&&stor30===0&&<span style={{color:"#10b981",fontWeight:500,fontSize:12}}>{fmtShort(grand30)}</span>}{grand30===0&&<span style={{color:"#2a4060"}}>—</span>}</div>}</td>}
                      {!isTech&&<td style={{padding:"13px 16px"}}>{hideValues?<Redacted/>:<span style={{color:"#c9d6e8"}}>{deal.fullContractValue?fmtShort(deal.fullContractValue):"—"}</span>}</td>}
                      {!isTech&&<td style={{padding:"13px 16px",color:"#8aa8c8",fontSize:11}}>{deal.paymentTerms}</td>}
                      <td style={{padding:"13px 16px"}}><span style={{background:st.bg,color:st.color,padding:"4px 10px",borderRadius:4,fontSize:11,fontWeight:600}}>{deal.status}</span></td>
                      {!isTech&&<td style={{padding:"13px 16px"}}><div style={{display:"flex",flexDirection:"column",gap:2}}>{hideValues?<Redacted/>:<span style={{color:collected>0?"#10b981":"#4a6a8a",fontWeight:600}}>{collected>0?fmtShort(collected):"$0"}</span>}{(deal.payments||[]).length>0&&<span style={{fontSize:9,color:"#2a5a3a",letterSpacing:"0.08em"}}>{deal.payments.length} PMT{deal.payments.length!==1?"S":""}</span>}</div></td>}
                      <td style={{padding:"13px 16px"}}><div style={{display:"flex",gap:6}}>{!isTech&&<button className="btn-ghost" onClick={()=>openEdit(deal)}>Edit</button>}<button className="btn-danger" onClick={()=>deleteDeal(deal.id)}>✕</button></div></td>
                    </tr>,
                    isExp&&(
                      <tr key={`${deal.id}-exp`} className="expand-row">
                        <td colSpan={13} style={{padding:"0 24px 20px 56px",borderBottom:`1px solid ${t.borderDeep}`}}>
                          <div style={{borderTop:`1px solid ${t.borderDeep}`,paddingTop:14}}>
                            <div className="inline-tab-bar">
                              {(isTech?[["notes","✎ Notes"]]:[["payments","💳 Payments"],["notes","✎ Notes"]]).map(([tab,label])=>(
                                <button key={tab} style={inlineTabBtn(curTab===tab)} onClick={()=>{setExpandedId(deal.id);setExpandTab(p=>({...p,[deal.id]:tab}));}}>{label}</button>
                              ))}
                            </div>
                            {!isTech&&curTab==="payments"&&(
                              <div>
                                <div style={{fontSize:10,color:t.textDim,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Payment History — {deal.customer}</div>
                                {(deal.payments||[]).length===0?<div style={{fontSize:11,color:"#2a4060",marginBottom:14,fontStyle:"italic"}}>No payments recorded yet.</div>:<div style={{marginBottom:16}}>
                                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:6}}>{["Amount","Date Paid","Period",""].map(h=><div key={h} style={{fontSize:9,color:"#2a5060",letterSpacing:"0.12em",textTransform:"uppercase"}}>{h}</div>)}</div>
                                  {(deal.payments||[]).map(p=>{
                                    const isEditingThis=editingPayment&&editingPayment.dealId===deal.id&&editingPayment.paymentId===p.id;
                                    if(isEditingThis) return <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8,alignItems:"center",padding:"7px 0",borderTop:`1px solid ${t.borderDeep}`}}><input className="payment-input" type="number" min="0" step="0.01" value={editingPayment.amount} onChange={e=>setEditingPayment(ep=>({...ep,amount:e.target.value}))} autoFocus/><input className="payment-input" type="date" value={editingPayment.datePaid} onChange={e=>setEditingPayment(ep=>({...ep,datePaid:e.target.value}))}/><input className="payment-input" type="text" placeholder="Period" value={editingPayment.period} onChange={e=>setEditingPayment(ep=>({...ep,period:e.target.value}))}/><div style={{display:"flex",gap:4}}><button className="btn-sm" style={{padding:"4px 8px",fontSize:10}} onClick={saveEditPayment}>✓</button><button className="btn-ghost" style={{padding:"4px 8px",fontSize:10}} onClick={cancelEditPayment}>✕</button></div></div>;
                                    return <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"center",padding:"7px 0",borderTop:"1px solid #0a1a2a"}}>
                                      <div style={{color:"#10b981",fontWeight:600,fontSize:12}}>{hideValues?<Redacted w={80}/>:fmt(p.amount)}</div>
                                      <div style={{color:"#8aa8c8",fontSize:11}}>{p.datePaid}</div>
                                      <div style={{color:"#8aa8c8",fontSize:11}}>{p.period||"—"}</div>
                                      <div style={{display:"flex",gap:4}}><button className="btn-ghost" style={{padding:"3px 8px",fontSize:10}} onClick={()=>startEditPayment(deal.id,p)}>✎</button><button className="btn-danger" style={{padding:"3px 8px",fontSize:10}} onClick={()=>deletePayment(deal.id,p.id)}>✕</button></div>
                                    </div>;
                                  })}
                                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #0d2035",display:"flex",justifyContent:"flex-end",gap:8,alignItems:"center"}}>
                                    <span style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em"}}>TOTAL COLLECTED</span>
                                    <span style={{color:"#10b981",fontWeight:700,fontSize:14,fontFamily:"'Syne',sans-serif"}}>{hideValues?<Redacted w={90}/>:fmt(collected)}</span>
                                  </div>
                                </div>}
                                <div style={{background:t.bgDeep,border:`1px solid ${t.borderDeep}`,borderRadius:8,padding:"14px 16px"}}>
                                  <div style={{fontSize:10,color:t.textDeep,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>+ Log New Payment</div>
                                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"flex-end"}}>
                                    <div><div style={{fontSize:9,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Amount ($) *</div><input className="payment-input" type="number" min="0" step="0.01" placeholder="e.g. 120000" value={pf.amount} onChange={e=>setPF(deal.id,{...pf,amount:e.target.value})}/></div>
                                    <div><div style={{fontSize:9,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Date Paid *</div><input className="payment-input" type="date" value={pf.datePaid} onChange={e=>setPF(deal.id,{...pf,datePaid:e.target.value})}/></div>
                                    <div><div style={{fontSize:9,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Period Covered</div><input className="payment-input" type="text" placeholder="e.g. Feb 1–28 2025" value={pf.period} onChange={e=>setPF(deal.id,{...pf,period:e.target.value})}/></div>
                                    <button className="btn-sm" onClick={()=>addPayment(deal.id)}>Add</button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {curTab==="notes"&&(
                              <div>
                                <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Notes — {deal.customer}</div>
                                <textarea className="notes-area" placeholder="Type notes here… saved automatically when you click away." defaultValue={deal.notes||""} onBlur={e=>saveNotes(deal.id,e.target.value)} rows={6}/>
                                <div style={{fontSize:9,color:"#1a3a50",marginTop:5,letterSpacing:"0.08em"}}>AUTO-SAVED ON BLUR</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  ];
                })}
              </tbody>
            </table>
          </div>
          {!isTech && <div style={{marginTop:14,fontSize:10,color:t.textDeep,letterSpacing:"0.1em"}}>30-DAY TOTAL = GPU (NODES × 8 × $/GPU/HR × 24 × 30) + STORAGE &nbsp;·&nbsp; {visible.length} DEALS &nbsp;·&nbsp; 🔥 FIREBASE LIVE SYNC</div>}
          {isTech && history.length>0 && (
            <div style={{marginTop:14,display:"flex",alignItems:"center",gap:10,background:"rgba(16,185,129,0.05)",border:"1px solid #1a3a2a",borderRadius:6,padding:"8px 16px",fontSize:11,color:"#2a8a5a",letterSpacing:"0.06em"}}>
              <span style={{color:"#10b981"}}>🟢</span>
              <span>LAST UPDATED&nbsp;·&nbsp;{(()=>{const d=new Date(history[0].ts);const now=new Date();const mins=Math.floor((now-d)/60000);if(mins<1)return"JUST NOW";if(mins<60)return`${mins} MIN AGO`;const hrs=Math.floor(mins/60);if(hrs<24)return`${hrs}H AGO`;return d.toLocaleDateString([],{month:"short",day:"numeric"});})()}</span>
              <span style={{color:"#1a5a3a"}}>·</span>
              <span style={{color:"#1a6a4a"}}>{history[0].message}{history[0].detail?` · ${history[0].detail}`:""}</span>
              <span style={{marginLeft:"auto",fontSize:10,color:"#1a4a2a"}}>{visible.length} DEALS · 🔥 FIREBASE LIVE SYNC</span>
            </div>
          )}
          {/* Horizon Mode Toggle + View Switcher */}
          <div style={{marginTop:24,display:"flex",justifyContent:"center",gap:10,alignItems:"center"}}>
            <button onClick={toggleTheme} style={{display:"flex",alignItems:"center",gap:10,background:horizon?t.bgCard:t.bgCard,border:`1px solid ${horizon?t.accent:t.borderSoft}`,borderRadius:24,padding:"8px 20px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",color:horizon?t.accent:t.textDim,letterSpacing:"0.08em",transition:"all .3s",boxShadow:horizon?`0 0 12px ${t.accentGlow}`:"none"}}>
              <HorizonLogo size={18} stop1={t.logoStop1} stop2={t.logoStop2}/>
              {horizon ? "HORIZON MODE ON" : "HORIZON MODE"}
              <div style={{width:32,height:18,background:horizon?t.accent:t.borderSoft,borderRadius:9,position:"relative",transition:"background .3s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:horizon?15:3,width:12,height:12,background:"#fff",borderRadius:"50%",transition:"left .3s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
              </div>
            </button>
            {!isTech && <button onClick={()=>setShowTechModal(true)} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.25)",color:"#a78bfa",borderRadius:24,padding:"8px 20px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",transition:"all .3s"}}>
              <span style={{fontSize:14}}>👷</span> TECH VIEW
            </button>}
            {isTech && <button onClick={()=>setShowAdminModal(true)} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(16,185,129,0.08)",border:"1px solid #1a4a2a",color:"#10b981",borderRadius:24,padding:"8px 20px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",transition:"all .3s"}}>
              <span style={{fontSize:14}}>⬡</span> ADMIN VIEW
            </button>}
          </div>
        </div>
      )}

      {showTechModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&(setShowTechModal(false),setTechInput(""))}>
          <div className="modal" style={{maxWidth:400}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:t.textBright}}>Switch to Tech View</div>
              <button onClick={()=>{setShowTechModal(false);setTechInput("");}} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
            </div>
            <label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Tech View Password</label>
            <input type="password" placeholder="Enter tech password" value={techInput} onChange={e=>setTechInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&switchToTech()} style={{marginBottom:techError?6:16,borderColor:techError?"#ef4444":undefined}}/>
            {techError&&<div style={{color:"#ef4444",fontSize:11,marginBottom:12,letterSpacing:"0.06em"}}>Incorrect password</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-ghost" onClick={()=>{setShowTechModal(false);setTechInput("");}}>Cancel</button>
              <button className="btn-primary" onClick={switchToTech}>Switch to Tech View</button>
            </div>
          </div>
        </div>
      )}

      {showAdminModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&(setShowAdminModal(false),setAdminInput(""))}>
          <div className="modal" style={{maxWidth:400}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:t.textBright}}>Switch to Admin View</div>
              <button onClick={()=>{setShowAdminModal(false);setAdminInput("");}} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
            </div>
            <label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Admin Password</label>
            <input type="password" placeholder="Enter admin password" value={adminInput} onChange={e=>setAdminInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&switchToAdmin()} style={{marginBottom:adminError?6:16,borderColor:adminError?"#ef4444":undefined}} autoFocus/>
            {adminError&&<div style={{color:"#ef4444",fontSize:11,marginBottom:12,letterSpacing:"0.06em"}}>Incorrect password</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-ghost" onClick={()=>{setShowAdminModal(false);setAdminInput("");}}>Cancel</button>
              <button className="btn-primary" onClick={switchToAdmin}>Switch to Admin View</button>
            </div>
          </div>
        </div>
      )}

      {showModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="modal">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:t.textBright}}>{editingId?"Edit Deal":"New Deal"}</div>
              <button onClick={closeModal} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
            </div>
            <div style={{marginBottom:18}}><label style={{fontSize:10,color:t.textDim,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Customer Name *</label><input placeholder="e.g. Hyperion AI" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></div>
            <div style={{display:"flex",gap:8,marginBottom:18,borderBottom:"1px solid #1a2e45",paddingBottom:12,alignItems:"center"}}>
              {[["gpu","⬡ GPU"],["storage","💾 Storage"],["notes","✎ Notes"]].map(([tab,label])=>(<button key={tab} style={tabBtn(modalTab===tab)} onClick={()=>setModalTab(tab)}>{label}</button>))}
              {modal30>0&&<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,color:"#2a5060"}}>30-DAY TOTAL</span><span style={{fontSize:13,color:"#10b981",fontWeight:700}}>{fmt(modal30)}</span></div>}
            </div>
            {modalTab==="gpu"&&(<div style={{marginBottom:4}}><div style={{display:"grid",gridTemplateColumns:"110px 1fr 1fr 1fr auto",gap:10,marginBottom:6}}>{["GPU Type","Nodes","$/GPU/Hr","30-Day",""].map(h=><div key={h} style={{fontSize:9,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase"}}>{h}</div>)}</div>{form.gpuAllocations.map(alloc=>{const v30=calc30DayAlloc(alloc);return(<div key={alloc.id} className="alloc-row"><select value={alloc.gpuType} onChange={e=>updateAlloc(alloc.id,"gpuType",e.target.value)}>{GPU_TYPES.map(g=><option key={g}>{g}</option>)}</select><input type="number" min="0" placeholder="Nodes" value={alloc.nodes} onChange={e=>updateAlloc(alloc.id,"nodes",e.target.value)}/><input type="number" min="0" step="0.01" placeholder="Rate" value={alloc.ratePerGpuHour} onChange={e=>updateAlloc(alloc.id,"ratePerGpuHour",e.target.value)}/><div style={{background:"#060d18",border:"1px solid #0d2040",borderRadius:4,padding:"9px 10px",fontSize:12,color:v30>0?"#10b981":"#2a4060",fontWeight:600,textAlign:"right"}}>{v30>0?fmtShort(v30):"—"}</div>{form.gpuAllocations.length>1?<button className="btn-icon" onClick={()=>removeAlloc(alloc.id)}>✕</button>:<div/>}</div>);})}<button className="add-alloc-btn" onClick={addAlloc}>+ Add Another GPU Type</button></div>)}
            {modalTab==="storage"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:4}}><div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Storage Contract Value ($)</label><input type="number" min="0" step="0.01" placeholder="e.g. 50000" value={form.storageValue} onChange={e=>setForm(f=>({...f,storageValue:e.target.value}))}/></div><div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Storage 30-Day Value ($)</label><input type="number" min="0" step="0.01" placeholder="e.g. 5000" value={form.storage30Day} onChange={e=>setForm(f=>({...f,storage30Day:e.target.value}))}/></div>{(Number(form.storage30Day)||0)>0&&(<div style={{gridColumn:"1 / -1",background:"#060d18",border:"1px solid #0d2040",borderRadius:6,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,color:"#3a6060",letterSpacing:"0.1em"}}>STORAGE CONTRIBUTION TO 30-DAY TOTAL</span><span style={{color:"#10b981",fontWeight:700,fontSize:13}}>{fmt(Number(form.storage30Day))}</span></div>)}</div>)}
            {modalTab==="notes"&&(<div style={{marginBottom:4}}><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Deal Notes</label><textarea rows={7} placeholder="Enter any notes about this deal…" value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>)}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:16,marginTop:20}}>
              <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Full Contract Value ($)</label><input type="number" min="0" placeholder="e.g. 4920000" value={form.fullContractValue} onChange={e=>setForm(f=>({...f,fullContractValue:e.target.value}))}/></div>
              <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Start Date</label><input type="date" value={form.startDate||""} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}/></div>
              <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>End Date</label><input type="date" value={form.endDate||""} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))}/></div>
              <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Payment Terms</label><select value={form.paymentTerms} onChange={e=>setForm(f=>({...f,paymentTerms:e.target.value}))}>{PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:6}}>Status</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUSES.map(s=><option key={s.label}>{s.label}</option>)}</select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}>
              <div>
                <label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>🔗 Networking</label>
                <div style={{display:"flex",gap:8}}>
                  {["RoCE v2","IB"].map(opt=>{const active=form.networking===opt;return <button key={opt} onClick={()=>setForm(f=>({...f,networking:active?"":opt}))} style={{flex:1,background:active?"rgba(0,153,255,0.15)":"transparent",border:`1px solid ${active?"#0099ff":"#1e3550"}`,color:active?"#38bdf8":"#4a6a8a",borderRadius:6,padding:"8px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.06em",transition:"all .15s"}}>{opt}</button>;})}
                </div>
              </div>
              <div>
                <label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>🖥 Architecture</label>
                <div style={{display:"flex",gap:8}}>
                  {["VM","BM"].map(opt=>{const active=form.architecture===opt;return <button key={opt} onClick={()=>setForm(f=>({...f,architecture:active?"":opt}))} style={{flex:1,background:active?"rgba(245,158,11,0.12)":"transparent",border:`1px solid ${active?"#f59e0b":"#1e3550"}`,color:active?"#f59e0b":"#4a6a8a",borderRadius:6,padding:"8px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.06em",transition:"all .15s"}}>{opt}</button>;})}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}><button className="btn-ghost" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={saveDeal}>{editingId?"Save Changes":"Add Deal"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MOBILE CRM ────────────────────────────────────────────────────────────────
function MobileCRM(props) {
  const {
    deals, visible, totals, loadState, fbReady, onlineUsers, saveBadge,
    t, horizon, toggleTheme,
    hideValues, setHideValues, search, setSearch, filterStatus, setFilterStatus,
    expandedId, toggleExpand, expandTab, setExpandTab,
    paymentForms, setPF, getPF, addPayment, deletePayment,
    editingPayment, startEditPayment, cancelEditPayment, saveEditPayment, setEditingPayment,
    openNew, openEdit, deleteDeal, saveNotes,
    notifications, setNotifications, showHistory, setShowHistory, history,
    showModal, closeModal, saveDeal, form, setForm, modalTab, setModalTab,
    editingId, modal30, addAlloc, removeAlloc, updateAlloc, MAX_H100, MAX_H200,
    isTech, role, setRole,
  } = props;

  const [mobileTab, setMobileTab] = useState("deals"); // deals | stats | history
  const [showTechModalM, setShowTechModalM] = useState(false);
  const [techInputM, setTechInputM] = useState("");
  const [techErrorM, setTechErrorM] = useState(false);
  const switchToTechM = () => {
    if (techInputM === TECH_PASSWORD) { localStorage.setItem("nexus-auth","tech"); setRole("tech"); setShowTechModalM(false); setTechInputM(""); }
    else { setTechErrorM(true); setTimeout(()=>setTechErrorM(false),1500); }
  };
  const [showAdminModalM, setShowAdminModalM] = useState(false);
  const [adminInputM, setAdminInputM] = useState("");
  const [adminErrorM, setAdminErrorM] = useState(false);
  const switchToAdminM = () => {
    if (adminInputM === PASSWORD) {
      localStorage.setItem("nexus-auth","1"); setRole("admin");
      setShowAdminModalM(false); setAdminInputM("");
    } else { setAdminErrorM(true); setTimeout(()=>setAdminErrorM(false),1500); }
  };
  const Redacted = ({w=64}) => <span style={{display:"inline-block",background:"#1e3a50",borderRadius:4,minWidth:w,height:"0.85em",verticalAlign:"middle"}}>&nbsp;</span>;
  const statusOf = (label) => STATUSES.find(s=>s.label===label)||STATUSES[0];
  const tabBtn=(active)=>({background:active?"rgba(0,153,255,0.15)":"transparent",border:`1px solid ${active?"#0099ff":"#1e3550"}`,color:active?"#0099ff":"#4a6a8a",borderRadius:4,padding:"8px 14px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all .15s"});
  const inlineTabBtn=(active)=>({background:"transparent",border:"none",borderBottom:`2px solid ${active?"#0099ff":"transparent"}`,color:active?"#0099ff":"#4a6a8a",padding:"8px 14px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all .15s"});

  return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"'IBM Plex Mono','Courier New',monospace",color:t.text,paddingBottom:70}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;}
        input,select{background:${t.bgInput};border:1px solid ${t.borderSoft};color:${t.text};border-radius:6px;padding:10px 12px;font-family:inherit;font-size:14px;width:100%;outline:none;} input:focus,select:focus{border-color:${t.accent};} select option{background:${t.bgInput};}
        textarea{background:${t.bgInput};border:1px solid ${t.borderSoft};color:${t.text};border-radius:6px;padding:10px 12px;font-family:inherit;font-size:13px;width:100%;outline:none;resize:vertical;line-height:1.6;} textarea:focus{border-color:${t.accent};}
        .m-btn-primary{background:linear-gradient(135deg,${t.accentDark},${t.accent});color:#fff;border:none;border-radius:8px;padding:12px 20px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;width:100%;}
        .m-btn-ghost{background:transparent;color:${t.textMid};border:1px solid ${t.borderSoft};border-radius:6px;padding:10px 16px;font-family:inherit;font-size:12px;cursor:pointer;flex:1;}
        .m-btn-danger{background:transparent;color:#ef4444;border:1px solid #3a1a1a;border-radius:6px;padding:8px 14px;font-family:inherit;font-size:12px;cursor:pointer;}
        .m-card{background:${t.bgCard};border:1px solid ${t.border};border-radius:12px;padding:16px;margin-bottom:10px;}
        .m-pill{padding:4px 10px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:0.06em;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} .pulsing{animation:pulse 1.2s ease-in-out infinite;}
        @keyframes livepulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}} .livepulse{animation:livepulse 2s ease-in-out infinite;}
        .payment-input{background:${t.bgDeep};border:1px solid ${t.borderDeep};color:${t.text};border-radius:6px;padding:10px 12px;font-family:inherit;font-size:13px;width:100%;outline:none;} .payment-input:focus{border-color:${t.accent};}
        .gpu-badge{display:inline-block;padding:3px 8px;border-radius:4px;font-weight:600;font-size:10px;}
        .notes-area{background:${t.bgDeep};border:1px solid ${t.borderDeep};color:${t.textMid};font-family:inherit;font-size:13px;width:100%;outline:none;resize:vertical;line-height:1.7;padding:12px 14px;min-height:120px;border-radius:6px;} .notes-area:focus{border-color:${t.accent};color:${t.text};}
        .alloc-row-m{display:grid;grid-template-columns:90px 1fr 1fr;gap:8px;align-items:flex-end;margin-bottom:10px;}
        .add-alloc-btn{background:transparent;border:1px dashed ${t.borderSoft};color:${t.textDim};border-radius:6px;padding:10px;width:100%;font-family:inherit;font-size:12px;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;}
        @keyframes scan1{0%,100%{opacity:.1}40%{opacity:.95}} @keyframes scan2{0%,100%{opacity:.1}55%{opacity:.95}} @keyframes scan3{0%,100%{opacity:.1}70%{opacity:.95}}
        @keyframes pinA{0%,100%{opacity:.3}50%{opacity:1}} @keyframes core200{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes ring200{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes pinB{0%,100%{opacity:.25}60%{opacity:1}}
        .sc1{animation:scan1 1.8s ease-in-out infinite} .sc2{animation:scan2 1.8s ease-in-out infinite} .sc3{animation:scan3 1.8s ease-in-out infinite}
        .pA{animation:pinA 1.4s ease-in-out infinite} .co200{animation:core200 1.6s ease-in-out infinite}
        .ri200{transform-origin:14px 14px;animation:ring200 3s linear infinite} .pB{animation:pinB 1.6s ease-in-out infinite}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:flex-end;justify-content:center;z-index:100;}
        .modal-sheet{background:${t.bgCard};border:1px solid ${t.borderSoft};border-radius:20px 20px 0 0;padding:20px 20px 36px;width:100%;max-height:92vh;overflow-y:auto;}
      `}</style>

      {/* Header */}
      <div style={{background:t.bgHeader,borderBottom:`1px solid ${t.border}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <HorizonLogo size={30} stop1={t.logoStop1} stop2={t.logoStop2}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"#e8f0fc",letterSpacing:"0.02em"}}>HORIZON<span style={{color:"#0099ff"}}>COMPUTE</span></div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {saveBadge&&<span style={{fontSize:10,color:saveBadge.color}} className={saveBadge.pulse?"pulsing":""}>{saveBadge.text}</span>}
          <span style={{fontSize:9,display:"flex",alignItems:"center",gap:4,color:fbReady?"#10b981":"#f59e0b",background:fbReady?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",border:`1px solid ${fbReady?"#1a4a2a":"#4a3000"}`,borderRadius:4,padding:"3px 8px"}}>
            <span className={fbReady?"livepulse":""} style={{fontSize:7}}>●</span>
            {fbReady?`${onlineUsers} ONLINE`:"…"}
          </span>
          {isTech && <span style={{fontSize:9,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",color:"#a78bfa",borderRadius:4,padding:"3px 8px",letterSpacing:"0.08em",fontWeight:700}}>👷 TECH</span>}
          <button onClick={openNew} style={{background:"linear-gradient(135deg,#0066cc,#0099ff)",color:"#fff",border:"none",borderRadius:6,padding:"7px 14px",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Deal</button>
        </div>
      </div>

      {/* Notification Bar */}
      {notifications.length > 0 && (
        <div style={{background:"#060f1a",borderBottom:"1px solid #0d2a45",padding:"0 16px"}}>
          {notifications.slice(0,1).map((n) => {
            const icons = {new_deal:"🟢",edit:"✏️",payment_added:"💳",payment_deleted:"🗑",delete_deal:"❌"};
            const colors = {new_deal:"#10b981",edit:"#0099ff",payment_added:"#10b981",payment_deleted:"#f59e0b",delete_deal:"#ef4444"};
            return (
              <div key={n.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0"}}>
                <span>{icons[n.type]||"•"}</span>
                <span style={{fontSize:11,color:colors[n.type]||"#c9d6e8",fontWeight:600,flex:1}}>{n.message}{n.detail&&` — ${n.detail}`}</span>
                <button onClick={()=>setNotifications([])} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:16,padding:"0 4px"}}>×</button>
              </div>
            );
          })}
        </div>
      )}

      {loadState==="loading"&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,gap:12,color:"#2a4a6a"}}><span className="pulsing" style={{fontSize:20}}>◈</span><span style={{fontSize:12}}>CONNECTING…</span></div>}

      {loadState==="ready"&&(<>

        {/* Stats Tab */}
        {mobileTab==="stats"&&(
          <div style={{padding:"16px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {(isTech?[{label:"Active Deals",value:String(totals.deals),plain:true}]:[{label:"Active Deals",value:String(totals.deals),plain:true},{label:"30-Day Run Rate",value:fmtShort(totals.monthly)},{label:"Total Collected",value:fmtShort(totals.collected)}]).map(s=>(
                <div className="m-card" key={s.label} style={{padding:"14px 16px"}}>
                  <div style={{fontSize:9,color:t.textDim,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:t.textBright}}>
                    {hideValues&&!s.plain?<span style={{display:"inline-block",background:"#1e3a50",borderRadius:4,minWidth:80,height:24}}>&nbsp;</span>:s.value}
                  </div>
                </div>
              ))}
            </div>
            {/* Node utilization */}
            <div className="m-card">
              <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>Node Utilization</div>
              {[{type:"H100",used:totals.h100Nodes,max:MAX_H100,color:"#38bdf8",bg:"rgba(56,189,248,0.15)"},{type:"H200",used:totals.h200Nodes,max:MAX_H200,color:"#a78bfa",bg:"rgba(139,92,246,0.15)"}].map(({type,used,max,color,bg})=>{
                const pct=Math.min(used/max,1); const warn=pct>=0.9; const barColor=warn?"#ef4444":pct>=0.7?"#f59e0b":color;
                const isH200=type==="H200";
                return (
                  <div key={type} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        {isH200?(
                          <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="6" y="6" width="16" height="16" rx="2.5" fill="#100820" stroke="#a78bfa" strokeWidth="1.3"/><circle className="ri200" cx="14" cy="14" r="4.5" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="8 4" strokeLinecap="round"/><circle className="co200" cx="14" cy="14" r="3.2" fill="#a78bfa"/><circle cx="14" cy="14" r="1.4" fill="#e8d8ff"/></svg>
                        ):(
                          <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="6" y="6" width="16" height="16" rx="2.5" fill="#061420" stroke="#38bdf8" strokeWidth="1.3"/><rect className="sc1" x="9" y="10" width="10" height="1.5" rx=".75" fill="#38bdf8"/><rect className="sc2" x="9" y="13.25" width="10" height="1.5" rx=".75" fill="#38bdf8"/><rect className="sc3" x="9" y="16.5" width="10" height="1.5" rx=".75" fill="#38bdf8"/></svg>
                        )}
                        <span style={{background:bg,color,padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:700}}>{type}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:700,color:warn?"#ef4444":color}}>{used}<span style={{color:"#3a5a7a",fontWeight:400}}>/{max}</span></span>
                    </div>
                    <div style={{height:6,background:"#0a1220",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct*100}%`,background:barColor,borderRadius:3,transition:"width .4s"}}/>
                    </div>
                    <div style={{fontSize:9,color:warn?"#ef4444":"#2a4a6a",marginTop:3,letterSpacing:"0.08em",textAlign:"right"}}>{Math.round(pct*100)}% · {max-used} FREE</div>
                  </div>
                );
              })}
            </div>
            <div className="m-card" style={{padding:"14px 16px",marginBottom:10}}>
              <div style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Config Breakdown</div>
              {[
                {label:"RoCE v2 + VM", net:"RoCE v2", arch:"VM",  color:"#38bdf8"},
                {label:"RoCE v2 + BM", net:"RoCE v2", arch:"BM",  color:"#10b981"},
                {label:"IB + BM",      net:"IB",      arch:"BM",  color:"#a78bfa"},
              ].map(({label,net,arch,color})=>{
                const nodes = deals.filter(d=>d.networking===net&&d.architecture===arch).reduce((s,d)=>(d.gpuAllocations||[]).reduce((ss,a)=>ss+(Number(a.nodes)||0),s),0);
                const pct = Math.min(nodes/193,1);
                return (
                  <div key={label} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:11,color:nodes>0?color:"#2a4a6a",fontWeight:nodes>0?600:400}}>{label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:nodes>0?color:"#1e3a5a"}}>{nodes}<span style={{color:"#2a4a6a",fontWeight:400,fontSize:11}}>/193</span></span>
                    </div>
                    <div style={{height:4,background:"#0a1220",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct*100}%`,background:color,borderRadius:2,transition:"width .4s",opacity:nodes>0?1:0.3}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>setHideValues(h=>!h)} style={{background:hideValues?"rgba(239,68,68,0.1)":t.accentGlow,border:`1px solid ${hideValues?t.red:t.borderSoft}`,color:hideValues?t.red:t.textDim,borderRadius:6,padding:"10px 16px",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",width:"100%",marginTop:4}}>
              {hideValues?"🔒 Values Hidden":"👁 Hide Values"}
            </button>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={toggleTheme} style={{display:"flex",alignItems:"center",gap:8,background:t.bgCard,border:`1px solid ${horizon?t.accent:t.borderSoft}`,borderRadius:24,padding:"10px 16px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",color:horizon?t.accent:t.textDim,letterSpacing:"0.08em",flex:1,transition:"all .3s"}}>
                <HorizonLogo size={16} stop1={t.logoStop1} stop2={t.logoStop2}/>
                {horizon ? "HORIZON ON" : "HORIZON"}
                <div style={{width:28,height:16,background:horizon?t.accent:t.borderSoft,borderRadius:8,position:"relative",transition:"background .3s",marginLeft:"auto",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:horizon?12:2,width:12,height:12,background:"#fff",borderRadius:"50%",transition:"left .3s"}}/>
                </div>
              </button>
              {!isTech && <button onClick={()=>setShowTechModalM(true)} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.25)",color:"#a78bfa",borderRadius:24,padding:"10px 16px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.06em",flexShrink:0,transition:"all .3s"}}>
                <span>👷</span> TECH
              </button>}
              {isTech && <button onClick={()=>setShowAdminModalM(true)} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(16,185,129,0.08)",border:"1px solid #1a4a2a",color:"#10b981",borderRadius:24,padding:"10px 16px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",letterSpacing:"0.06em",flexShrink:0,transition:"all .3s"}}>
                <span>⬡</span> ADMIN
              </button>}
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {mobileTab==="deals"&&(
          <div style={{padding:"12px 16px"}}>
            {isTech && history.length>0 && (
              <div style={{background:"rgba(16,185,129,0.06)",border:"1px solid #1a3a2a",borderRadius:6,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#2a8a5a",letterSpacing:"0.06em"}}>
                <span style={{color:"#10b981"}}>🟢</span>
                <span>LAST UPDATED&nbsp;·&nbsp;{(()=>{const d=new Date(history[0].ts);const now=new Date();const mins=Math.floor((now-d)/60000);if(mins<1)return"JUST NOW";if(mins<60)return`${mins} MIN AGO`;const hrs=Math.floor(mins/60);if(hrs<24)return`${hrs}H AGO`;return d.toLocaleDateString([],{month:"short",day:"numeric"});})()}</span>
                <span style={{marginLeft:"auto",color:"#1a5a3a",fontSize:10}}>{history[0].message}{history[0].detail?` · ${history[0].detail}`:""}</span>
              </div>
            )}
            <input placeholder="Search customer…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:10,fontSize:14}}/>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:6}}>
              {["All",...STATUSES.map(s=>s.label)].map(s=>{ const active=filterStatus===s; const st=STATUSES.find(x=>x.label===s); return <button key={s} onClick={()=>setFilterStatus(s)} style={{background:active?(st?st.bg:"rgba(0,153,255,0.15)"):"transparent",border:`1px solid ${active?(st?st.color:"#0099ff"):"#1e3550"}`,color:active?(st?st.color:"#0099ff"):"#4a6a8a",borderRadius:20,padding:"5px 12px",fontFamily:"inherit",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{s}</button>; })}
            </div>
            {visible.length===0&&<div style={{textAlign:"center",padding:48,color:"#2a4a6a",fontSize:13}}>No deals found</div>}
            {visible.map(deal=>{
              const allocs=deal.gpuAllocations||[]; const st=statusOf(deal.status); const collected=totalCollected(deal); const grand30=calcGrand30Day(deal); const isExp=expandedId===deal.id; const curTab=expandTab[deal.id]||"payments"; const pf=getPF(deal.id);
              return (
                <div key={deal.id} className="m-card" style={{padding:0,overflow:"hidden"}}>
                  {/* Card Header */}
                  <div onClick={()=>toggleExpand(deal.id,curTab)} style={{padding:"14px 16px",cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span style={{fontWeight:600,color:"#d8e8f8",fontSize:14}}>{deal.customer||"—"}</span><NetworkingBadge value={deal.networking}/><ArchitectureBadge value={deal.architecture}/></div>
                      <span style={{background:st.bg,color:st.color,padding:"3px 9px",borderRadius:4,fontSize:10,fontWeight:600,flexShrink:0,marginLeft:8}}>{deal.status}</span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                      {allocs.map(a=>{const gs=gpuStyle(a.gpuType);return <span key={a.id} className="gpu-badge" style={{background:gs.bg,color:gs.color}}>{a.gpuType} · {a.nodes}n</span>;})}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        {!hideValues&&grand30>0&&<div style={{fontSize:12,color:"#10b981",fontWeight:600}}>{fmtShort(grand30)}<span style={{color:"#2a5040",fontWeight:400,fontSize:10}}>/30d</span></div>}
                        {hideValues&&<Redacted w={70}/>}
                      </div>
                      <div style={{textAlign:"right"}}>
                        {!isTech&&collected>0&&<div style={{fontSize:11,color:collected>0?"#10b981":"#4a6a8a",fontWeight:600}}>{hideValues?<Redacted w={60}/>:fmtShort(collected)}<span style={{fontSize:9,color:"#2a5040",marginLeft:3}}>collected</span></div>}
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExp&&(
                    <div style={{borderTop:"1px solid #0d2035",background:"#060e1a"}}>
                      {/* Tabs */}
                      <div style={{display:"flex",borderBottom:"1px solid #0d2035"}}>
                        {(isTech?[["notes","✎ Notes"]]:[["payments","💳 Payments"],["notes","✎ Notes"]]).map(([tab,label])=>(
                          <button key={tab} style={inlineTabBtn(curTab===tab)} onClick={()=>{setExpandTab(p=>({...p,[deal.id]:tab}));}}>{label}</button>
                        ))}
                        <div style={{marginLeft:"auto",display:"flex",gap:6,padding:"6px 12px"}}>
                          {!isTech&&<button className="m-btn-ghost" style={{padding:"5px 10px",fontSize:11,flex:"none"}} onClick={(e)=>{e.stopPropagation();openEdit(deal);}}>Edit</button>}
                          <button className="m-btn-danger" style={{padding:"5px 10px",fontSize:11}} onClick={(e)=>{e.stopPropagation();deleteDeal(deal.id);}}>✕</button>
                        </div>
                      </div>

                      {!isTech&&curTab==="payments"&&(
                        <div style={{padding:"14px 16px"}}>
                          {(deal.payments||[]).length===0?<div style={{fontSize:11,color:"#2a4060",marginBottom:12,fontStyle:"italic"}}>No payments yet.</div>:(
                            <div style={{marginBottom:14}}>
                              {(deal.payments||[]).map(p=>{
                                const isEditingThis=editingPayment&&editingPayment.dealId===deal.id&&editingPayment.paymentId===p.id;
                                if(isEditingThis) return (
                                  <div key={p.id} style={{background:"#080f1c",borderRadius:8,padding:12,marginBottom:8}}>
                                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                                      <input className="payment-input" type="number" placeholder="Amount" value={editingPayment.amount} onChange={e=>setEditingPayment(ep=>({...ep,amount:e.target.value}))}/>
                                      <input className="payment-input" type="date" value={editingPayment.datePaid} onChange={e=>setEditingPayment(ep=>({...ep,datePaid:e.target.value}))}/>
                                    </div>
                                    <input className="payment-input" type="text" placeholder="Period" value={editingPayment.period} onChange={e=>setEditingPayment(ep=>({...ep,period:e.target.value}))} style={{marginBottom:8}}/>
                                    <div style={{display:"flex",gap:8}}><button className="m-btn-ghost" onClick={saveEditPayment} style={{flex:1,background:"rgba(16,185,129,0.1)",color:"#10b981",border:"1px solid #1a4a2a"}}>✓ Save</button><button className="m-btn-ghost" onClick={cancelEditPayment} style={{flex:1}}>Cancel</button></div>
                                  </div>
                                );
                                return (
                                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #0a1a2a"}}>
                                    <div>
                                      <div style={{color:"#10b981",fontWeight:600,fontSize:13}}>{hideValues?<Redacted w={70}/>:fmt(p.amount)}</div>
                                      <div style={{fontSize:10,color:"#4a6a8a",marginTop:2}}>{p.datePaid}{p.period&&` · ${p.period}`}</div>
                                    </div>
                                    <div style={{display:"flex",gap:6}}>
                                      <button className="m-btn-ghost" style={{padding:"5px 10px",fontSize:11,flex:"none"}} onClick={()=>startEditPayment(deal.id,p)}>✎</button>
                                      <button className="m-btn-danger" style={{padding:"5px 10px",fontSize:11}} onClick={()=>deletePayment(deal.id,p.id)}>✕</button>
                                    </div>
                                  </div>
                                );
                              })}
                              <div style={{display:"flex",justifyContent:"flex-end",gap:8,alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid #0d2035"}}>
                                <span style={{fontSize:10,color:"#4a6a8a"}}>TOTAL</span>
                                <span style={{color:"#10b981",fontWeight:700,fontSize:15}}>{hideValues?<Redacted w={80}/>:fmt(collected)}</span>
                              </div>
                            </div>
                          )}
                          {/* Add payment form */}
                          <div style={{background:"#080f1c",border:"1px solid #0d2035",borderRadius:8,padding:14}}>
                            <div style={{fontSize:10,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>+ Log New Payment</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                              <div><div style={{fontSize:9,color:"#2a5060",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Amount ($) *</div><input className="payment-input" type="number" min="0" placeholder="e.g. 50000" value={pf.amount} onChange={e=>setPF(deal.id,{...pf,amount:e.target.value})}/></div>
                              <div><div style={{fontSize:9,color:"#2a5060",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Date Paid *</div><input className="payment-input" type="date" value={pf.datePaid} onChange={e=>setPF(deal.id,{...pf,datePaid:e.target.value})}/></div>
                            </div>
                            <div style={{marginBottom:10}}><div style={{fontSize:9,color:"#2a5060",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Period Covered</div><input className="payment-input" type="text" placeholder="e.g. Feb 1–28 2025" value={pf.period} onChange={e=>setPF(deal.id,{...pf,period:e.target.value})}/></div>
                            <button className="m-btn-primary" onClick={()=>addPayment(deal.id)}>Add Payment</button>
                          </div>
                        </div>
                      )}

                      {curTab==="notes"&&(
                        <div style={{padding:"14px 16px"}}>
                          <div style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Notes — {deal.customer}</div>
                          <textarea className="notes-area" placeholder="Type notes here…" defaultValue={deal.notes||""} onBlur={e=>saveNotes(deal.id,e.target.value)} rows={5}/>
                          <div style={{fontSize:9,color:"#1a3a50",marginTop:4,letterSpacing:"0.08em"}}>AUTO-SAVED ON BLUR</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* History Tab */}
        {mobileTab==="history"&&(
          <div style={{padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:"#e8f0fc"}}>Activity History</div>
              <div style={{fontSize:10,color:"#4a6a8a"}}>{history.length} EVENTS</div>
            </div>
            {history.length===0&&<div style={{color:"#2a4060",fontSize:12,textAlign:"center",marginTop:40}}>No activity yet.</div>}
            {history.map(e=>{
              const icons={new_deal:"🟢",edit:"✏️",payment_added:"💳",payment_deleted:"🗑",delete_deal:"❌"};
              const colors={new_deal:"#10b981",edit:"#0099ff",payment_added:"#10b981",payment_deleted:"#f59e0b",delete_deal:"#ef4444"};
              const d=new Date(e.ts);
              return (
                <div key={e.id} className="m-card" style={{display:"flex",gap:12,padding:"12px 14px"}}>
                  <div style={{fontSize:18,minWidth:24,textAlign:"center"}}>{icons[e.type]||"•"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:colors[e.type]||"#c9d6e8",fontWeight:600}}>{e.message}</div>
                    {e.detail&&<div style={{fontSize:11,color:"#4a6a8a",marginTop:2}}>{e.detail}</div>}
                    <div style={{fontSize:10,color:"#2a4060",marginTop:4}}>{d.toLocaleDateString([],{month:"short",day:"numeric"})} · {d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>)}

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:t.bgHeader,borderTop:`1px solid ${t.border}`,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",zIndex:50}}>
        {(isTech?[["deals","📋","Deals"],["stats","📊","Stats"]]:[["deals","📋","Deals"],["stats","📊","Stats"],["history","🕐","History"]]).map(([tab,icon,label])=>(
          <button key={tab} onClick={()=>setMobileTab(tab)} style={{background:"none",border:"none",color:mobileTab===tab?t.accent:t.textDim,fontFamily:"inherit",fontSize:10,fontWeight:600,cursor:"pointer",padding:"12px 4px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,letterSpacing:"0.06em",textTransform:"uppercase",borderTop:mobileTab===tab?`2px solid ${t.accent}`:"2px solid transparent"}}>
            <span style={{fontSize:18}}>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* New/Edit Deal Modal (bottom sheet) */}
      {showModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="modal-sheet">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:"#e8f0fc"}}>{editingId?"Edit Deal":"New Deal"}</div>
              <button onClick={closeModal} style={{background:"none",border:"none",color:"#4a6a8a",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
            </div>
            <div style={{marginBottom:14}}><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Customer Name *</label><input placeholder="e.g. Hyperion AI" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))}/></div>
            <div style={{display:"flex",gap:8,marginBottom:14,borderBottom:"1px solid #1a2e45",paddingBottom:12}}>
              {[["gpu","⬡ GPU"],["storage","💾 Storage"],["notes","✎ Notes"]].map(([tab,label])=>(<button key={tab} style={tabBtn(modalTab===tab)} onClick={()=>setModalTab(tab)}>{label}</button>))}
            </div>
            {modal30>0&&<div style={{background:"rgba(16,185,129,0.08)",border:"1px solid #1a4a2a",borderRadius:6,padding:"8px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,color:"#2a5060"}}>30-DAY TOTAL</span><span style={{fontSize:14,color:"#10b981",fontWeight:700}}>{fmt(modal30)}</span></div>}
            {modalTab==="gpu"&&(
              <div style={{marginBottom:4}}>
                <div style={{display:"grid",gridTemplateColumns:"90px 1fr 1fr",gap:8,marginBottom:6}}>{["GPU","Nodes","$/GPU/Hr"].map(h=><div key={h} style={{fontSize:9,color:"#2a5060",letterSpacing:"0.1em",textTransform:"uppercase"}}>{h}</div>)}</div>
                {form.gpuAllocations.map(alloc=>{
                  const v30=calc30DayAlloc(alloc);
                  return (
                    <div key={alloc.id} style={{marginBottom:10}}>
                      <div className="alloc-row-m">
                        <select value={alloc.gpuType} onChange={e=>updateAlloc(alloc.id,"gpuType",e.target.value)}>{GPU_TYPES.map(g=><option key={g}>{g}</option>)}</select>
                        <input type="number" min="0" placeholder="Nodes" value={alloc.nodes} onChange={e=>updateAlloc(alloc.id,"nodes",e.target.value)}/>
                        <input type="number" min="0" step="0.01" placeholder="Rate" value={alloc.ratePerGpuHour} onChange={e=>updateAlloc(alloc.id,"ratePerGpuHour",e.target.value)}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        {v30>0&&<span style={{fontSize:11,color:"#10b981",fontWeight:600}}>30d: {fmtShort(v30)}</span>}
                        {form.gpuAllocations.length>1&&<button onClick={()=>removeAlloc(alloc.id)} style={{background:"none",border:"1px solid #3a1a1a",color:"#ef4444",borderRadius:4,padding:"3px 10px",fontFamily:"inherit",fontSize:11,cursor:"pointer"}}>Remove</button>}
                      </div>
                    </div>
                  );
                })}
                <button className="add-alloc-btn" onClick={addAlloc}>+ Add GPU Type</button>
              </div>
            )}
            {modalTab==="storage"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
                <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Contract Value ($)</label><input type="number" min="0" placeholder="e.g. 50000" value={form.storageValue} onChange={e=>setForm(f=>({...f,storageValue:e.target.value}))}/></div>
                <div><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>30-Day Value ($)</label><input type="number" min="0" placeholder="e.g. 5000" value={form.storage30Day} onChange={e=>setForm(f=>({...f,storage30Day:e.target.value}))}/></div>
              </div>
            )}
            {modalTab==="notes"&&(
              <div style={{marginBottom:4}}><label style={{fontSize:10,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Deal Notes</label><textarea rows={5} placeholder="Enter any notes…" value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
              <div><label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Full Contract ($)</label><input type="number" min="0" placeholder="e.g. 4920000" value={form.fullContractValue} onChange={e=>setForm(f=>({...f,fullContractValue:e.target.value}))}/></div>
              <div><label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Payment Terms</label><select value={form.paymentTerms} onChange={e=>setForm(f=>({...f,paymentTerms:e.target.value}))}>{PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Start Date</label><input type="date" value={form.startDate||""} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}/></div>
              <div><label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Status</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUSES.map(s=><option key={s.label}>{s.label}</option>)}</select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
              <div>
                <label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:8}}>🔗 Networking</label>
                <div style={{display:"flex",gap:6}}>
                  {["RoCE v2","IB"].map(opt=>{const active=form.networking===opt;return <button key={opt} onClick={()=>setForm(f=>({...f,networking:active?"":opt}))} style={{flex:1,background:active?"rgba(0,153,255,0.15)":"transparent",border:`1px solid ${active?"#0099ff":"#1e3550"}`,color:active?"#38bdf8":"#4a6a8a",borderRadius:6,padding:"9px 4px",fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{opt}</button>;})}
                </div>
              </div>
              <div>
                <label style={{fontSize:9,color:"#4a6a8a",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:8}}>🖥 Architecture</label>
                <div style={{display:"flex",gap:6}}>
                  {["VM","BM"].map(opt=>{const active=form.architecture===opt;return <button key={opt} onClick={()=>setForm(f=>({...f,architecture:active?"":opt}))} style={{flex:1,background:active?"rgba(245,158,11,0.12)":"transparent",border:`1px solid ${active?"#f59e0b":"#1e3550"}`,color:active?"#f59e0b":"#4a6a8a",borderRadius:6,padding:"9px 4px",fontFamily:"inherit",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{opt}</button>;})}
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
              <button className="m-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="m-btn-primary" style={{margin:0}} onClick={saveDeal}>{editingId?"Save Changes":"Add Deal"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
