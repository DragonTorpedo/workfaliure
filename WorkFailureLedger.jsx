import { useState, useEffect } from "react";

// Initial seed data to establish the premium layout out-of-the-box
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

  // State Management with local storage persistence
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("architect_failure_logs");
    return saved ? JSON.parse(saved) : BOOT_DATA;
  });

  const [activeLog, setActiveLog] = useState(logs[0] || null);

  // Form input bindings
  const [formDomain, setFormDomain] = useState("SOFTWARE");
  const [formSeverity, setFormSeverity] = useState("LEVEL 01");
  const [formIncident, setFormIncident] = useState("");
  const [formRootCause, setFormRootCause] = useState("");
  const [formPatchPattern, setFormPatchPattern] = useState("");

  useEffect(() => {
    localStorage.setItem("architect_failure_logs", JSON.stringify(logs));
  }, [logs]);

  // Telemetry metric aggregators
  const totalLogs = logs.length;
  const softCount = logs.filter(l => l.domain === "SOFTWARE").length;
  const archCount = logs.filter(l => l.domain === "ARCHITECTURE").length;
  const prodCount = logs.filter(l => l.domain === "PRODUCTIVITY").length;

  // Handler to forge a new ledger block
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

    // Wipe text fields post-commit
    setFormIncident("");
    setFormRootCause("");
    setFormPatchPattern("");
  };

  const handleWipeLedger = () => {
    if (window.confirm("EXECUTE TOTAL DATA PURGE? THIS RETROSPECTIVE LEDGER MATRIX WILL BE RESET.")) {
      setLogs([]);
      setActiveLog(null);
    }
  };

  // Color Palette Constants (The Crimson Matrix)
  const C = {
    bg: "#0a0506",      // Deep Void
    s1: "#12080a",      // Secondary Card Layer
    s2: "#1c0d10",      // Inside Input Elements
    bdr: "#2a1417",     // Structural Chassis Border
    bdrHi: "#451e23",   // High-intensity active border
    acc: "#ff334b",     // High-Ignition Neon Red
    accDim: "#b82334",  // Muted Oxide Red
    txt: "#e5d5d6",     // High contrast silver text
    dim: "#8c7a7b",     // Rose-gray text prose
    green: "#3cd070"    // System patched confirmation status
  };

  const cardStyle = { background: C.s1, border: `1px solid ${C.bdr}`, borderRadius: 6, padding: "14px" };
  const lblStyle = { fontFamily: mono, fontSize: 8, letterSpacing: "0.22em", color: C.dim, marginBottom: 6, display: "block" };
  const inputStyle = {
    width: "100%", background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 4,
    color: C.txt, fontFamily: mono, fontSize: 10, padding: "8px 10px",
    boxSizing: "border-box", transition: "all 0.2s ease"
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: mono, color: C.txt, padding: "16px", boxSizing: "border-box", userSelect: "none" }}>
      
      <style>{`
        textarea:focus, select:focus { border-color: ${C.bdrHi} !important; outline: none; box-shadow: 0 0 10px rgba(255, 51, 75, 0.15); }
        .log-row { cursor: pointer; transition: all 0.2s; }
        .log-row:hover { background: rgba(255, 51, 75, 0.04) !important; }
        .btn-crimson { background: ${C.acc}; color: ${C.bg}; border: 1px solid ${C.acc}; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-crimson:hover { background: transparent; color: ${C.acc}; box-shadow: 0 0 14px rgba(255, 51, 75, 0.4); }
        .btn-outline { background: transparent; color: ${C.dim}; border: 1px solid ${C.bdr}; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: ${C.bdrHi}; color: ${C.txt}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.bdr}; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.bdrHi}; }
      `}</style>

      {/* ── HEADER DECK ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: `1px solid ${C.bdr}`, paddingBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.3em", color: C.accDim }}>DIAG·//</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.acc, letterSpacing: "0.08em", textShadow: `0 0 20px ${C.acc}44` }}>THE RETROSPECTIVE LEDGER</span>
          <span style={{ fontSize: 8, color: C.dim, letterSpacing: "0.15em" }}>v1.0.4 // PROTOCOL CRIMSON</span>
        </div>
        <button onClick={handleWipeLedger} className="btn-outline" style={{ fontFamily: mono, fontSize: 8, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 3 }}>
          [ WIPE ALL CACHE ]
        </button>
      </div>

      {/* ── METRICS OVERLAY PANEL ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          ["TOTAL INCIDENTS LOGGED", totalLogs, C.acc],
          ["SOFTWARE COGNITIVE FAILS", softCount, C.txt],
          ["ARCHITECTURE FLUID BOTTLENECK", archCount, C.txt],
          ["PRODUCTIVITY FRICTION LOSS", prodCount, C.txt]
        ].map(([title, val, color], idx) => (
          <div key={idx} style={{ ...cardStyle, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: 7, letterSpacing: "0.16em", color: C.dim, marginBottom: 4 }}>// {title}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: color }}>{String(val).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN SPLIT ENGINE INTERFACE ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 12, height: "calc(100vh - 165px)" }}>
        
        {/* LEFT COLUMN: CONTROL ROOM & HISTORIC STREAM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
          
          {/* INGESTION ENTRY MODULE */}
          <div style={{ ...cardStyle }}>
            <span style={lblStyle}>// INGEST NEW INCIDENT TELEMETRY</span>
            <form onSubmit={handleCommitLog} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ ...lblStyle, fontSize: 7, marginBottom: 3 }}>DOMAIN MATRIX</span>
                  <select value={formDomain} onChange={e => setFormDomain(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="ARCHITECTURE">ARCHITECTURE</option>
                    <option value="PRODUCTIVITY">PRODUCTIVITY</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ ...lblStyle, fontSize: 7, marginBottom: 3 }}>CRITICAL SEVERITY</span>
                  <select value={formSeverity} onChange={e => setFormSeverity(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="LEVEL 01">LEVEL 01 (MINOR)</option>
                    <option value="LEVEL 02">LEVEL 02 (WARNING)</option>
                    <option value="LEVEL 03">LEVEL 03 (ELEVATED)</option>
                    <option value="LEVEL 04">LEVEL 04 (CRITICAL)</option>
                  </select>
                </div>
              </div>

              <div>
                <span style={{ ...lblStyle, fontSize: 7, marginBottom: 3 }}>01 // ANATOMY OF INCIDENT</span>
                <textarea value={formIncident} onChange={e => setFormIncident(e.target.value)} placeholder="Describe the symptom matrix exactly..." rows={2} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
              </div>

              <div>
                <span style={{ ...lblStyle, fontSize: 7, marginBottom: 3 }}>02 // ROOT CAUSE INTERROGATION</span>
                <textarea value={formRootCause} onChange={e => setFormRootCause(e.target.value)} placeholder="Isolate the precise core system structural failure or behavior flaw..." rows={2} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
              </div>

              <div>
                <span style={{ ...lblStyle, fontSize: 7, marginBottom: 3 }}>03 // PERMANENT HARDENING PATTERN</span>
                <textarea value={formPatchPattern} onChange={e => setFormPatchPattern(e.target.value)} placeholder="Declare invariant rules or defensive code shifts to permanently block repeat errors..." rows={2} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
              </div>

              <button type="submit" className="btn-crimson" style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", padding: "8px 0", borderRadius: 4, marginTop: 4 }}>
                COMMIT INCIDENT TO SYSTEM INVARIANTS
              </button>
            </form>
          </div>

          {/* HISTORIC STREAM ACCOUNT */}
          <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span style={lblStyle}>// HISTORIC LEDGER REGISTRY</span>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 2 }}>
              {logs.length === 0 ? (
                <div style={{ textAllign: "center", padding: "20px 0", color: C.dim, fontSize: 9, fontStyle: "italic" }}>
                  LEDGER SYSTEM EMPTY. SYSTEM INTEGRITY OPTIMAL.
                </div>
              ) : (
                logs.map((log) => {
                  const isActive = activeLog && activeLog.id === log.id;
                  return (
                    <div key={log.id} onClick={() => setActiveLog(log)} className="log-row" style={{
                      background: isActive ? `${C.acc}0a` : C.s2,
                      border: `1px solid ${isActive ? C.acc : C.bdr}`,
                      borderRadius: 4, padding: "8px 10px", transition: "all 0.2s"
                    }}>
                      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? C.acc : C.txt }}>{log.id}</span>
                        <span style={{ fontSize: 7, color: C.dim }}>{log.timestamp}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, fontSize: 7, letterSpacing: "0.05em" }}>
                        <span style={{ color: log.domain === "ARCHITECTURE" ? C.accDim : C.dim }}>[{log.domain}]</span>
                        <span style={{ color: C.acc }}>{log.severity}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EXPERT RETROSPECTIVE TERMINAL INSPECTOR */}
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
          <span style={lblStyle}>// INTERACTIVE SYSTEM FAULT DECONSTRUCTION TERMINAL</span>
          
          {activeLog ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", paddingRight: 4 }}>
              
              <div style={{ borderBottom: `1px dashed ${C.bdr}`, paddingBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.acc, letterSpacing: "-0.01em" }}>{activeLog.id}</div>
                  <div style={{ fontSize: 8, color: C.dim, marginTop: 4 }}>COMMITTED SYSTEM MARK: {activeLog.timestamp}</div>
                </div>
                <div style={{ textAllign: "right" }}>
                  <div style={{ fontSize: 8, color: C.txt, fontWeight: 700, background: `${C.acc}15`, border: `1px solid ${C.acc}40`, padding: "3px 10px", borderRadius: 2 }}>
                    {activeLog.severity}
                  </div>
                  <div style={{ fontSize: 7, color: C.dim, marginTop: 4, letterSpacing: "0.1em" }}>DOMAIN: {activeLog.domain}</div>
                </div>
              </div>

              {/* SECTION 01 */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, background: C.acc, transform: "rotate(45deg)" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.acc }}>01 // THE ANATOMY OF INCIDENT</span>
                </div>
                <div style={{ background: C.s2, borderLeft: `2px solid ${C.acc}`, padding: "10px 12px", fontSize: 11, lineHeight: 1.6, color: C.txt }}>
                  {activeLog.incident}
                </div>
              </div>

              {/* SECTION 02 */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, background: C.accDim, transform: "rotate(45deg)" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim }}>02 // ROOT CAUSE INTERROGATION PROFILE</span>
                </div>
                <div style={{ padding: "2px 12px", fontSize: 10, lineHeight: 1.6, color: C.dim, whiteSpace: "pre-wrap" }}>
                  {activeLog.rootCause}
                </div>
              </div>

              {/* SECTION 03 */}
              <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px dashed ${C.bdr}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, background: C.green, transform: "rotate(45deg)" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.green }}>03 // ENFORCED REUSABLE PATCH PATTERN INVARIANT</span>
                </div>
                <div style={{ background: "rgba(60, 208, 112, 0.04)", border: `1px solid rgba(60, 208, 112, 0.2)`, padding: "12px", borderRadius: 4, fontSize: 11, lineHeight: 1.6, color: C.txt, fontStyle: "italic" }}>
                  <span style={{ color: C.green, fontWeight: 700, fontStyle: "normal", display: "block", fontSize: 8, letterSpacing: "0.15em", marginBottom: 4 }}>[ SYSTEM HARDENING IMMUNITY CONTRACT ]</span>
                  "{activeLog.patchPattern}"
                </div>
              </div>

              <div style={{ fontSize: 7, color: C.dim, letterSpacing: "0.15em", textAllign: "center", marginTop: 8 }}>
                [ RETROSPECTIVE NODE ANCHORED // LEDGER CLOSED FOR SECTOR {activeLog.id.split("-")[3]} ]
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dim, gap: 8 }}>
              <div style={{ width: 16, height: 16, border: `1px dashed ${C.bdrHi}`, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)" }}>
                <div style={{ width: 4, height: 4, background: C.bdrHi }} />
              </div>
              <span style={{ fontSize: 8, letterSpacing: "0.2em" }}>SELECT SCAN LOG TO DECONSTRUCT SYSTEM BOUNDARY</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
