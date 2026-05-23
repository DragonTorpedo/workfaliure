import { useState, useEffect } from "react";

const BOOT_DATA = [
  {
    id: "FL-2026-05-22-ARCH",
    timestamp: "2026-05-22 13:45",
    domain: "ARCHITECTURE",
    severity: "LEVEL 04",
    incident: "A race condition occurred inside the Web Audio Hook initialization loop, causing the Master Node to drop gain connectivity under high UI interaction density.",
    rootCause: "State setter for the 'playing' boolean fired concurrently with the execution of the recursive blip() timeout loop. Discovered a lack of defensive null checking on gainRef.current.",
    patchPattern: "Implemented an immediate conditional return escape hatch inside the recursive timeout streams before any node scheduling occurs."
  },
  {
    id: "FL-2026-05-19-SOFT",
    timestamp: "2026-05-19 09:12",
    domain: "SOFTWARE",
    severity: "LEVEL 02",
    incident: "CSS linear-gradient syntax threw an unhandled compilation break during the deployment build phase due to a misplaced comma in the hex opacity matrix.",
    rootCause: "Typing code adjustments manually in the production layout bundle without running a local pre-commit verification lint script.",
    patchPattern: "Enforced an automated pre-commit husky hook that blocks git pushes if lint validation or production compilation fails."
  }
];

export default function WorkFailureLedger() {
  const mono = "'JetBrains Mono','Fira Code','Courier New',monospace";

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("architect_failure_logs");
    return saved ? JSON.parse(saved) : BOOT_DATA;
  });

  const [activeLog, setActiveLog] = useState(logs[0] || null);
  const [formDomain, setFormDomain] = useState("SOFTWARE");
  const [formSeverity, setFormSeverity] = useState("LEVEL 01");
  const [formIncident, setFormIncident] = useState("");
  const [formRootCause, setFormRootCause] = useState("");
  const [formPatchPattern, setFormPatchPattern] = useState("");

  useEffect(() => {
    localStorage.setItem("architect_failure_logs", JSON.stringify(logs));
  }, [logs]);

  const totalLogs = logs.length;
  const softCount = logs.filter(l => l.domain === "SOFTWARE").length;
  const archCount = logs.filter(l => l.domain === "ARCHITECTURE").length;
  const prodCount = logs.filter(l => l.domain === "PRODUCTIVITY").length;

  const handleCommitLog = (e) => {
    e.preventDefault();
    if (!formIncident.trim() || !formRootCause.trim() || !formPatchPattern.trim()) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timeStr = `${year}-${month}-${day} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    
    const domShort = formDomain.substring(0, 4);
    const uniqueId = `FL-${year}-${month}-${day}-${domShort}-${Math.floor(100 + Math.random() * 900)}`;

    const newLog = {
      id: uniqueId,
      timestamp: timeStr,
      domain: formDomain,
      severity: formSeverity,
      incident: formIncident,
      rootCause: formRootCause,
      patchPattern: formPatchPattern
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setActiveLog(newLog);

    setFormIncident("");
    setFormRootCause("");
    setFormPatchPattern("");
  };

  const handleWipeLedger = () => {
    if (window.confirm("EXECUTE TOTAL DATA PURGE?")) {
      setLogs([]);
      setActiveLog(null);
    }
  };

  const C = {
    bg: "#0a0506", s1: "#12080a", s2: "#1c0d10", bdr: "#2a1417", bdrHi: "#451e23",
    acc: "#ff334b", accDim: "#b82334", txt: "#e5d5d6", dim: "#8c7a7b", green: "#3cd070"
  };

  const cardStyle = { background: C.s1, border: `1px solid ${C.bdr}`, borderRadius: 6, padding: "14px" };
  const lblStyle = { fontFamily: mono, fontSize: 8, letterSpacing: "0.22em", color: C.dim, marginBottom: 6, display: "block" };
  const inputStyle = {
    width: "100%", background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 4,
    color: C.txt, fontFamily: mono, fontSize: 10, padding: "8px 10px", boxSizing: "border-box"
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: mono, color: C.txt, padding: "16px", boxSizing: "border-box" }}>
      
      <style>{`
        textarea:focus, select:focus { border-color: ${C.bdrHi} !important; outline: none; }
        .log-row { cursor: pointer; }
        .log-row:hover { background: rgba(255, 51, 75, 0.04) !important; }
        .btn-crimson { background: ${C.acc}; color: ${C.bg}; border: 1px solid ${C.acc}; font-weight: 700; cursor: pointer; }
        .btn-outline { background: transparent; color: ${C.dim}; border: 1px solid ${C.bdr}; cursor: pointer; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: `1px solid ${C.bdr}`, paddingBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.acc, letterSpacing: "0.08em" }}>THE RETROSPECTIVE LEDGER</span>
        </div>
        <button onClick={handleWipeLedger} className="btn-outline" style={{ fontFamily: mono, fontSize: 8, padding: "4px 10px", borderRadius: 3 }}>
          [ WIPE ALL CACHE ]
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          ["TOTAL INCIDENTS LOGGED", totalLogs, C.acc],
          ["SOFTWARE COGNITIVE FAILS", softCount, C.txt],
          ["ARCHITECTURE FLUID BOTTLENECK", archCount, C.txt],
          ["PRODUCTIVITY FRICTION LOSS", prodCount, C.txt]
        ].map(([title, val, color], idx) => (
          <div key={idx} style={{ ...cardStyle, padding: "10px 14px" }}>
            <span style={{ fontSize: 7, color: C.dim, display: "block" }}>// {title}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: color }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...cardStyle }}>
            <form onSubmit={handleCommitLog} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <select value={formDomain} onChange={e => setFormDomain(e.target.value)} style={inputStyle}>
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="ARCHITECTURE">ARCHITECTURE</option>
                    <option value="PRODUCTIVITY">PRODUCTIVITY</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <select value={formSeverity} onChange={e => setFormSeverity(e.target.value)} style={inputStyle}>
                    <option value="LEVEL 01">LEVEL 01</option>
                    <option value="LEVEL 02">LEVEL 02</option>
                    <option value="LEVEL 03">LEVEL 03</option>
                    <option value="LEVEL 04">LEVEL 04</option>
                  </select>
                </div>
              </div>
              <textarea value={formIncident} onChange={e => setFormIncident(e.target.value)} placeholder="01 // Incident description..." rows={2} style={inputStyle} />
              <textarea value={formRootCause} onChange={e => setFormRootCause(e.target.value)} placeholder="02 // Root cause..." rows={2} style={inputStyle} />
              <textarea value={formPatchPattern} onChange={e => setFormPatchPattern(e.target.value)} placeholder="03 // Permanent patch..." rows={2} style={inputStyle} />
              <button type="submit" className="btn-crimson" style={{ fontFamily: mono, fontSize: 9, padding: "8px 0", borderRadius: 4 }}>
                COMMIT INCIDENT
              </button>
            </form>
          </div>

          <div style={{ ...cardStyle }}>
            <span style={lblStyle}>// HISTORIC REGISTRY</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {logs.map((log) => (
                <div key={log.id} onClick={() => setActiveLog(log)} className="log-row" style={{ background: C.s2, border: `1px solid ${C.bdr}`, padding: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                    <span style={{ color: C.acc }}>{log.id}</span>
                    <span style={{ color: C.dim }}>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle }}>
          {activeLog ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span style={{ color: C.acc, fontSize: 14, fontWeight: "bold" }}>{activeLog.id}</span>
                <span style={{ color: C.dim, fontSize: 10, display: "block" }}>{activeLog.domain} | {activeLog.severity}</span>
              </div>
              <div>
                <span style={lblStyle}>01 // ANATOMY</span>
                <div style={{ background: C.s2, padding: "10px", fontSize: 11 }}>{activeLog.incident}</div>
              </div>
              <div>
                <span style={lblStyle}>02 // ROOT CAUSE</span>
                <div style={{ fontSize: 10, color: C.dim }}>{activeLog.rootCause}</div>
              </div>
              <div>
                <span style={lblStyle}>03 // PERMANENT PATCH</span>
                <div style={{ background: "rgba(60, 208, 112, 0.05)", border: `1px solid ${C.green}`, padding: "10px", fontSize: 11 }}>
                  {activeLog.patchPattern}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: C.dim, fontSize: 10 }}>SELECT A LOG TO VIEW DETAILS</div>
          )}
        </div>
      </div>
    </div>
  );
}
