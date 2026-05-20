import { useState, useRef, useEffect } from "react";

// ── Slice colours (wheel segments — fixed for readability) ────────────────────
const COLORS = [
  "#FF6B6B","#FF8E53","#FFC947","#A8E063",
  "#56CCF2","#6C63FF","#F953C6","#43E97B",
  "#FA709A","#4FACFE","#F7971E","#43CBFF",
];

// ── Themes ───────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id:"cosmic",   name:"Cosmic",  swatch:"#6C63FF",
    bg:"linear-gradient(135deg,#0f0c29 0%,#1a1a3e 50%,#24243e 100%)",
    sidebar:"rgba(0,0,0,0.25)",
    spinBtn:"linear-gradient(135deg,#6C63FF,#F953C6)", spinShadow:"rgba(108,99,255,0.4)",
    addBtn:"linear-gradient(135deg,#43e97b,#38f9d7)", addText:"#0f0c29",
    accent:"#6C63FF", soft:"rgba(108,99,255,0.22)", border:"rgba(108,99,255,0.55)", muted:"#a78bfa",
    toggle:"#6C63FF",
    titleGrad:"linear-gradient(135deg,#fff 0%,#a78bfa 55%,#f9a8d4 100%)",
    confetti:["#FF6B6B","#6C63FF","#F953C6","#43E97B","#FFC947","#56CCF2","#fff","#f9a8d4"],
  },
  {
    id:"sunset",   name:"Sunset",  swatch:"#FF6B35",
    bg:"linear-gradient(135deg,#1c0500 0%,#2d0f00 40%,#1c0015 100%)",
    sidebar:"rgba(0,0,0,0.3)",
    spinBtn:"linear-gradient(135deg,#FF6B35,#FFD700)", spinShadow:"rgba(255,107,53,0.4)",
    addBtn:"linear-gradient(135deg,#FF8C42,#FFBF69)", addText:"#1c0500",
    accent:"#FF6B35", soft:"rgba(255,107,53,0.22)", border:"rgba(255,107,53,0.55)", muted:"#FFB347",
    toggle:"#FF6B35",
    titleGrad:"linear-gradient(135deg,#fff 0%,#FFB347 55%,#FF6B35 100%)",
    confetti:["#FF6B35","#FFD700","#FF4500","#FFA500","#FF69B4","#FFFF00","#fff","#FFB347"],
  },
  {
    id:"ocean",    name:"Ocean",   swatch:"#00B4D8",
    bg:"linear-gradient(135deg,#001219 0%,#014f6b 50%,#001219 100%)",
    sidebar:"rgba(0,0,0,0.3)",
    spinBtn:"linear-gradient(135deg,#0096C7,#48CAE4)", spinShadow:"rgba(0,180,216,0.4)",
    addBtn:"linear-gradient(135deg,#52B788,#74C69D)", addText:"#001219",
    accent:"#00B4D8", soft:"rgba(0,180,216,0.18)", border:"rgba(0,180,216,0.55)", muted:"#90E0EF",
    toggle:"#0096C7",
    titleGrad:"linear-gradient(135deg,#fff 0%,#90E0EF 55%,#00B4D8 100%)",
    confetti:["#00B4D8","#0096C7","#52B788","#ADE8F4","#00F5D4","#fff","#CAF0F8","#48CAE4"],
  },
  {
    id:"forest",   name:"Forest",  swatch:"#52B788",
    bg:"linear-gradient(135deg,#081c15 0%,#1b4332 50%,#081c15 100%)",
    sidebar:"rgba(0,0,0,0.3)",
    spinBtn:"linear-gradient(135deg,#52B788,#2D6A4F)", spinShadow:"rgba(82,183,136,0.4)",
    addBtn:"linear-gradient(135deg,#95D5B2,#B7E4C7)", addText:"#081c15",
    accent:"#52B788", soft:"rgba(82,183,136,0.18)", border:"rgba(82,183,136,0.55)", muted:"#95D5B2",
    toggle:"#52B788",
    titleGrad:"linear-gradient(135deg,#fff 0%,#95D5B2 55%,#52B788 100%)",
    confetti:["#52B788","#2D6A4F","#95D5B2","#B7E4C7","#FFD166","#EF476F","#fff","#06D6A0"],
  },
  {
    id:"neon",     name:"Neon",    swatch:"#00FF87",
    bg:"linear-gradient(135deg,#000 0%,#0a0014 50%,#000 100%)",
    sidebar:"rgba(255,255,255,0.025)",
    spinBtn:"linear-gradient(135deg,#00FF87,#60EFFF)", spinShadow:"rgba(0,255,135,0.45)",
    addBtn:"linear-gradient(135deg,#FF006E,#FF6B9D)", addText:"#fff",
    accent:"#00FF87", soft:"rgba(0,255,135,0.1)", border:"rgba(0,255,135,0.45)", muted:"#00FF87",
    toggle:"#00FF87",
    titleGrad:"linear-gradient(135deg,#fff 0%,#60EFFF 55%,#00FF87 100%)",
    confetti:["#00FF87","#60EFFF","#FF006E","#FFD60A","#9B5DE5","#F15BB5","#fff","#00F5FF"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }
function defaultSpinner(name = "My Spinner") {
  return { id: uid(), name, options: ["Option 1", "Option 2", "Option 3"], history: [], removeWinner: false };
}
function getSliceAngle(n) { return (2 * Math.PI) / n; }
function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 5) return "just now"; if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

// ── Audio (Web Audio API — no external files needed) ──────────────────────────
let _actx = null;
function getACtx() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  if (_actx.state === "suspended") _actx.resume();
  return _actx;
}
function playTick() {
  try {
    const c = getACtx(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "triangle"; o.frequency.value = 550 + Math.random() * 200;
    g.gain.setValueAtTime(0.13, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.045);
    o.start(c.currentTime); o.stop(c.currentTime + 0.05);
  } catch {}
}
function playWin() {
  try {
    const c = getACtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination); o.type = "sine"; o.frequency.value = freq;
      const t = c.currentTime + i * 0.13;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      o.start(t); o.stop(t + 0.6);
    });
  } catch {}
}

// ── Wheel Canvas ──────────────────────────────────────────────────────────────
function drawWheel(canvas, options, rotation, winnerIdx = -1, glowPulse = 0) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
  const r = Math.min(cx, cy) - 10;
  ctx.clearRect(0, 0, W, H);

  if (options.length === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "bold 14px Sora,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Add options to start", cx, cy); return;
  }

  const slice = getSliceAngle(options.length);
  options.forEach((opt, i) => {
    const start = rotation + i * slice, end = start + slice, mid = start + slice / 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();

    if (i === winnerIdx && glowPulse > 0) {
      ctx.shadowColor = COLORS[i % COLORS.length];
      ctx.shadowBlur = 14 + 28 * glowPulse;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();

    ctx.save(); ctx.translate(cx, cy); ctx.rotate(mid); ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    const fs = Math.max(10, Math.min(18, r / Math.max(options.length, 1) * 1.1));
    ctx.font = `bold ${fs}px Sora,sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 4;
    ctx.fillText(opt.length > 18 ? opt.slice(0, 16) + "…" : opt, r - 18, fs / 3);
    ctx.restore();
  });

  // Centre hub
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 10; ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
  ctx.fillStyle = "#080816"; ctx.fill();
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function ConfettiCanvas({ trigger, colors }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current; if (!canvas) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const ps = Array.from({ length: 170 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 160,
      vx: (Math.random() - 0.5) * 5,
      vy: 1.5 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      w: 7 + Math.random() * 10, h: 4 + Math.random() * 6,
      rot: Math.random() * 360, rv: (Math.random() - 0.5) * 9,
    }));
    let t0 = null, id; const DUR = 4600;
    function draw(ts) {
      if (!t0) t0 = ts; const el = ts - t0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fade = DUR * 0.68;
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.rot += p.rv;
        const op = el > fade ? Math.max(0, 1 - (el - fade) / (DUR - fade)) : 1;
        ctx.save(); ctx.globalAlpha = op; ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180); ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (el < DUR) id = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  }, [trigger]);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, width: "100%", height: "100%" }} />;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ spinners, activeId, onSelect, onAdd, onDelete, onRename, collapsed, onToggle, theme }) {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  if (collapsed) return (
    <div style={{ width: 44, background: theme.sidebar, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
      <button onClick={onToggle} title="Expand" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: 6 }}>☰</button>
    </div>
  );
  return (
    <div style={{ width: 210, background: theme.sidebar, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: "16px 10px", flexShrink: 0, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>My Spinners</span>
        <button onClick={onToggle} title="Collapse" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 13 }}>◀</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {spinners.map(s => (
          <div key={s.id} className="sb-item" onClick={() => onSelect(s.id)} style={{ borderRadius: 10, padding: "9px 10px", cursor: "pointer", background: s.id === activeId ? theme.soft : "transparent", border: `1px solid ${s.id === activeId ? theme.border : "transparent"}`, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
            {editId === s.id ? (
              <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                onBlur={() => { if (editName.trim()) onRename(s.id, editName.trim()); setEditId(null); }}
                onKeyDown={e => { if (e.key === "Enter" && editName.trim()) { onRename(s.id, editName.trim()); setEditId(null); } if (e.key === "Escape") setEditId(null); }}
                onClick={e => e.stopPropagation()}
                style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: `1px solid ${theme.border}`, borderRadius: 6, color: "#fff", fontFamily: "inherit", fontSize: 12, padding: "2px 7px", outline: "none" }} />
            ) : (
              <>
                <span style={{ flex: 1, fontSize: 13, fontWeight: s.id === activeId ? 600 : 400, color: s.id === activeId ? "#e8e4ff" : "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                <div className="sb-btns" style={{ display: "flex", gap: 1, opacity: 0, transition: "opacity 0.15s" }}>
                  <button onClick={e => { e.stopPropagation(); setEditId(s.id); setEditName(s.name); }} title="Rename" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11, padding: "2px 3px" }}>✏️</button>
                  {spinners.length > 1 && <button onClick={e => { e.stopPropagation(); onDelete(s.id); }} title="Delete" style={{ background: "none", border: "none", color: "rgba(255,100,100,0.65)", cursor: "pointer", fontSize: 11, padding: "2px 3px" }}>🗑️</button>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={onAdd} style={{ marginTop: 12, background: theme.soft, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: 10, padding: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
        + New Spinner
      </button>
    </div>
  );
}

// ── Spinner View ──────────────────────────────────────────────────────────────
function SpinnerView({ spinner, onUpdate, theme, soundRef }) {
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [tab, setTab] = useState("options");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [confTrigger, setConfTrigger] = useState(0);

  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const animRef = useRef(null);
  const glowRef = useRef(null);
  const winIdxRef = useRef(-1);
  const spinnerRef = useRef(spinner);
  const lastSlotRef = useRef(-1);

  useEffect(() => { spinnerRef.current = spinner; }, [spinner]);

  // Reset on spinner switch (key prop handles remount)
  useEffect(() => {
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current);
    rotRef.current = 0; winIdxRef.current = -1;
    setResult(null); setShowResult(false); setSpinning(false); setEditIdx(null);
    if (canvasRef.current) drawWheel(canvasRef.current, spinner.options, 0);
  }, [spinner.id]); // eslint-disable-line

  // Redraw on options change only when no glow is active
  useEffect(() => {
    if (canvasRef.current && winIdxRef.current === -1 && !spinning)
      drawWheel(canvasRef.current, spinner.options, rotRef.current);
  }, [spinner.options]); // eslint-disable-line

  // Cleanup on unmount
  useEffect(() => () => { cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current); }, []);

  function addOption() { const t = input.trim(); if (!t || spinner.options.includes(t)) return; onUpdate({ options: [...spinner.options, t] }); setInput(""); }
  function removeOption(i) { onUpdate({ options: spinner.options.filter((_, j) => j !== i) }); }
  function commitEdit(i) { const t = editVal.trim(); if (t && t !== spinner.options[i]) { const o = [...spinner.options]; o[i] = t; onUpdate({ options: o }); } setEditIdx(null); }

  function spin() {
    if (spinning || spinner.options.length < 2) return;
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current);
    winIdxRef.current = -1;
    if (soundRef.current) { try { getACtx().resume(); } catch {} }
    setSpinning(true); setShowResult(false); setResult(null); lastSlotRef.current = -1;

    const opts = [...spinner.options];
    const slice = getSliceAngle(opts.length);
    const totalRot = 2 * Math.PI * (6 + Math.random() * 6);
    const dur = 4000 + Math.random() * 1500;
    const t0 = performance.now(), r0 = rotRef.current;
    const ease = t => 1 - Math.pow(1 - t, 4);
    if (canvasRef.current) drawWheel(canvasRef.current, opts, rotRef.current);

    function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      rotRef.current = r0 + totalRot * ease(p);

      // Tick sounds on each slice boundary
      if (soundRef.current) {
        const n = ((rotRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const slot = Math.floor(((2 * Math.PI - n) % (2 * Math.PI)) / slice) % opts.length;
        if (slot !== lastSlotRef.current) { playTick(); lastSlotRef.current = slot; }
      }

      if (canvasRef.current) drawWheel(canvasRef.current, opts, rotRef.current);
      if (p < 1) { animRef.current = requestAnimationFrame(frame); return; }

      // ── Spin complete ──
      setSpinning(false);
      const n = ((rotRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const wIdx = Math.floor(((2 * Math.PI - n) % (2 * Math.PI)) / slice) % opts.length;
      const winner = opts[wIdx];

      setResult(winner); setTimeout(() => setShowResult(true), 80);
      setConfTrigger(k => k + 1);
      if (soundRef.current) playWin();

      // Pulsing glow for 2.4 s then settle
      winIdxRef.current = wIdx;
      const gs = performance.now(); const GDUR = 2400;
      function gloop(ts) {
        const el = ts - gs;
        const pulse = el < GDUR ? (Math.sin(el / 290 * Math.PI * 2) + 1) / 2 : 0.65;
        if (canvasRef.current) drawWheel(canvasRef.current, opts, rotRef.current, wIdx, pulse);
        if (el < GDUR + 60) { glowRef.current = requestAnimationFrame(gloop); }
        else {
          // Glow done — sync canvas to current spinner options
          winIdxRef.current = -1;
          if (canvasRef.current) drawWheel(canvasRef.current, spinnerRef.current.options, rotRef.current);
        }
      }
      glowRef.current = requestAnimationFrame(gloop);

      // Persist result + optionally remove winner
      const cur = spinnerRef.current;
      const newHist = [{ result: winner, timestamp: Date.now() }, ...(cur.history || [])].slice(0, 25);
      const upd = { history: newHist };
      if (cur.removeWinner && opts.length > 1) upd.options = opts.filter((_, i) => i !== wIdx);
      onUpdate(upd);
    }
    animRef.current = requestAnimationFrame(frame);
  }

  const { options, history, removeWinner } = spinner;
  const tabStyle = (id) => ({
    flex: 1, padding: "8px", border: "none", borderRadius: 9, fontFamily: "inherit",
    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
    background: tab === id ? `${theme.accent}99` : "transparent",
    color: tab === id ? "#fff" : "rgba(255,255,255,0.4)",
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 48px", gap: 18, overflowY: "auto" }}>
      <ConfettiCanvas trigger={confTrigger} colors={theme.confetti} />

      {/* Wheel */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", right: -13, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderRight: "28px solid #fff", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.75))" }} />
        <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius: "50%", boxShadow: "0 0 60px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.55)", display: "block" }} />
      </div>

      <button className="spin-btn" onClick={spin} disabled={spinning || options.length < 2}>
        {spinning ? "Spinning…" : "SPIN!"}
      </button>
      {options.length < 2 && !spinning && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>Add at least 2 options to spin</p>}

      {showResult && result && (
        <div className="result-pop" style={{ background: `linear-gradient(135deg,${theme.soft},${theme.accent}22)`, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "14px 32px", textAlign: "center", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 5, letterSpacing: 2, textTransform: "uppercase" }}>🎉 Winner!</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{result}</div>
          {removeWinner && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 5 }}>Removed from the wheel</div>}
        </div>
      )}

      {/* Tab panel */}
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 14, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4 }}>
          <button onClick={() => setTab("options")} style={tabStyle("options")}>Options ({options.length})</button>
          <button onClick={() => setTab("history")} style={tabStyle("history")}>History ({history.length})</button>
        </div>

        {tab === "options" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Remove-winner toggle */}
            <div onClick={() => onUpdate({ removeWinner: !removeWinner })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", userSelect: "none" }}>
              <div style={{ width: 36, height: 20, borderRadius: 100, background: removeWinner ? theme.toggle : "rgba(255,255,255,0.12)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: removeWinner ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Remove winner after spin</span>
            </div>

            {/* Add input */}
            <div style={{ display: "flex", gap: 8 }}>
              <input className="opt-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addOption()} placeholder="Type an option…" maxLength={40} />
              <button className="add-btn" onClick={addOption}>Add</button>
            </div>

            {/* Options list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 280, overflowY: "auto" }}>
              {options.map((opt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  {editIdx === i ? (
                    <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)}
                      onBlur={() => commitEdit(i)}
                      onKeyDown={e => { if (e.key === "Enter") commitEdit(i); if (e.key === "Escape") setEditIdx(null); }}
                      style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: `1px solid ${theme.border}`, borderRadius: 6, color: "#fff", fontFamily: "inherit", fontSize: 13, padding: "2px 8px", outline: "none" }} />
                  ) : (
                    <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{opt}</span>
                  )}
                  <button onClick={() => { setEditIdx(i); setEditVal(opt); }} title="Edit" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 13, padding: "2px 4px" }}>✏️</button>
                  <button onClick={() => removeOption(i)} title="Remove" style={{ background: "none", border: "none", color: "rgba(255,107,107,0.5)", cursor: "pointer", fontSize: 16, padding: "2px 4px", lineHeight: 1 }}>×</button>
                </div>
              ))}
              {options.length === 0 && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", padding: "20px 0", margin: 0 }}>No options yet — add some above!</p>}
            </div>
            {options.length > 0 && <button onClick={() => onUpdate({ options: [] })} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b", borderRadius: 10, padding: "8px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>Clear all options</button>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 380, overflowY: "auto" }}>
            {history.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", padding: "28px 0", margin: 0 }}>No spins yet — spin the wheel!</p>
            ) : (
              <>
                {history.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: theme.muted, minWidth: 28, textAlign: "center" }}>#{history.length - i}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{item.result}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{timeAgo(item.timestamp)}</span>
                  </div>
                ))}
                <button onClick={() => onUpdate({ history: [] })} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b", borderRadius: 10, padding: "8px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600, marginTop: 4 }}>Clear history</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [spinners, setSpinners] = useState(() => {
    try {
      const r = localStorage.getItem("wheel-spinners-v2");
      if (r) { const d = JSON.parse(r); if (Array.isArray(d) && d.length > 0) return d.map(s => ({ history: [], removeWinner: false, ...s })); }
    } catch {}
    return [defaultSpinner("My First Spinner")];
  });
  const [activeId, setActiveId] = useState(spinners[0]?.id);
  const [collapsed, setCollapsed] = useState(false);
  const [themeId, setThemeId] = useState(() => localStorage.getItem("wheel-theme") || "cosmic");
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem("wheel-sound") !== "false");
  const soundRef = useRef(soundOn);
  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);

  useEffect(() => { localStorage.setItem("wheel-spinners-v2", JSON.stringify(spinners)); }, [spinners]);
  useEffect(() => { localStorage.setItem("wheel-theme", themeId); }, [themeId]);
  useEffect(() => { localStorage.setItem("wheel-sound", soundOn ? "true" : "false"); }, [soundOn]);

  function updateSpinner(id, updates) { setSpinners(p => p.map(s => s.id === id ? { ...s, ...updates } : s)); }
  function addSpinner() { const s = defaultSpinner(`Spinner ${spinners.length + 1}`); setSpinners(p => [...p, s]); setActiveId(s.id); }
  function deleteSpinner(id) { if (spinners.length === 1) return; const r = spinners.filter(s => s.id !== id); setSpinners(r); if (activeId === id) setActiveId(r[0].id); }

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const active = spinners.find(s => s.id === activeId) || spinners[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'Sora','Segoe UI',sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .spin-btn { background:${theme.spinBtn}; border:none; color:#fff; font-family:inherit; font-size:18px; font-weight:800; padding:16px 48px; border-radius:100px; cursor:pointer; letter-spacing:1px; transition:transform 0.15s,box-shadow 0.15s,opacity 0.2s; box-shadow:0 8px 32px ${theme.spinShadow}; }
        .spin-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.04); box-shadow:0 12px 40px ${theme.spinShadow}; }
        .spin-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .add-btn { background:${theme.addBtn}; border:none; color:${theme.addText}; font-family:inherit; font-size:14px; font-weight:700; padding:11px 22px; border-radius:100px; cursor:pointer; transition:transform 0.15s; box-shadow:0 4px 16px rgba(0,0,0,0.25); white-space:nowrap; }
        .add-btn:hover { transform:translateY(-1px); }
        .opt-input { background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.15); border-radius:100px; padding:11px 20px; color:#fff; font-family:inherit; font-size:14px; outline:none; transition:border-color 0.2s; width:100%; }
        .opt-input::placeholder { color:rgba(255,255,255,0.35); }
        .opt-input:focus { border-color:${theme.border}; }
        .result-pop { animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes popIn { from{opacity:0;transform:scale(0.7) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .sb-item:hover { background:rgba(255,255,255,0.05) !important; }
        .sb-item:hover .sb-btns { opacity:1 !important; }
        .swatch-btn:hover { transform:scale(1.2) !important; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:3px; }
      `}</style>

      <Sidebar spinners={spinners} activeId={active.id} onSelect={setActiveId} onAdd={addSpinner} onDelete={deleteSpinner} onRename={(id, name) => updateSpinner(id, { name })} collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} theme={theme} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "11px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {collapsed && <button onClick={() => setCollapsed(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 18, padding: "2px 4px" }}>☰</button>}
          <h1 style={{ margin: 0, fontSize: "clamp(14px,2.8vw,20px)", fontWeight: 800, background: theme.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{active.name}</h1>

          {/* Mute toggle */}
          <button onClick={() => setSoundOn(p => !p)} title={soundOn ? "Mute sounds" : "Enable sounds"} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 8, padding: "5px 9px", cursor: "pointer", fontSize: 15, lineHeight: 1, transition: "background 0.15s", flexShrink: 0 }}>
            {soundOn ? "🔊" : "🔇"}
          </button>

          {/* Theme swatches */}
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
            {THEMES.map(t => (
              <button key={t.id} className="swatch-btn" onClick={() => setThemeId(t.id)} title={t.name} style={{ width: 21, height: 21, borderRadius: "50%", background: t.swatch, border: themeId === t.id ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "transform 0.15s, border 0.15s", transform: themeId === t.id ? "scale(1.25)" : "scale(1)", flexShrink: 0 }} />
            ))}
          </div>
        </div>

        <SpinnerView key={active.id} spinner={active} onUpdate={u => updateSpinner(active.id, u)} theme={theme} soundRef={soundRef} />
      </div>
    </div>
  );
}