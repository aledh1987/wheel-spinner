import { useState, useRef, useEffect } from "react";

const COLORS = ["#FF6B6B","#FF8E53","#FFC947","#A8E063","#56CCF2","#6C63FF","#F953C6","#43E97B","#FA709A","#4FACFE","#F7971E","#43CBFF"];

const PALETTES = [
  { id:"default", name:"Default",  colors:["#FF6B6B","#FF8E53","#FFC947","#A8E063","#56CCF2","#6C63FF","#F953C6","#43E97B","#FA709A","#4FACFE","#F7971E","#43CBFF"] },
  { id:"fire",    name:"🔥 Fire",   colors:["#D00000","#E85D04","#F48C06","#FAA307","#DC2F02","#9D0208","#FF4500","#E55934","#F18F01","#C73E1D","#FF6B35","#FFBA08"] },
  { id:"ocean",   name:"🌊 Ocean",  colors:["#0077B6","#0096C7","#00B4D8","#023E8A","#0043A4","#4361EE","#3A86FF","#48CAE4","#0582CA","#2563EB","#1D3557","#457B9D"] },
  { id:"forest",  name:"🌿 Forest", colors:["#2D6A4F","#40916C","#1B4332","#52B788","#3A5A40","#588157","#344E41","#606C38","#386641","#4F772D","#283618","#6A994E"] },
  { id:"candy",   name:"🍭 Candy",  colors:["#FF006E","#FB5607","#FF9500","#8338EC","#3A86FF","#06D6A0","#EF476F","#F72585","#7209B7","#3F37C9","#4CC9F0","#FFBE0B"] },
  { id:"galaxy",  name:"🌌 Galaxy", colors:["#7B2FBE","#9D4EDD","#4361EE","#4895EF","#560BAD","#480CA8","#F72585","#B5179E","#7209B7","#3A0CA3","#4CC9F0","#C77DFF"] },
  { id:"vintage", name:"🎨 Vintage",colors:["#9E3A2B","#B85C36","#C17A3A","#8B9A46","#4A7C7E","#4472CA","#5B5EA6","#7B3F7E","#4E7252","#9B4F96","#CB6015","#4D7A4D"] },
  { id:"neon",    name:"⚡ Neon",   colors:["#FF073A","#FF6B35","#DDCC00","#00CC44","#00BFFF","#BF00FF","#FF1493","#00CC88","#FF4500","#00CCCC","#CC00CC","#99BB00"] },
];

// Each theme has both a dark and light background + sidebar
const THEMES = [
  { id:"cosmic", name:"Cosmic", swatch:"#6C63FF",
    bg:"linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)",
    lightBg:"linear-gradient(135deg,#f0eeff,#ebe5ff,#f8f2ff)",
    sidebar:"rgba(0,0,0,0.25)", lightSidebar:"rgba(108,99,255,0.07)",
    spinBtn:"linear-gradient(135deg,#6C63FF,#F953C6)", spinShadow:"rgba(108,99,255,0.4)",
    addBtn:"linear-gradient(135deg,#43e97b,#38f9d7)", addText:"#0f0c29",
    accent:"#6C63FF", soft:"rgba(108,99,255,0.18)", border:"rgba(108,99,255,0.5)", muted:"#7c6ff7", toggle:"#6C63FF",
    titleGrad:"linear-gradient(135deg,#fff,#a78bfa,#f9a8d4)",
    titleGradLight:"linear-gradient(135deg,#6C63FF,#9D4EDD,#F953C6)",
    confetti:["#FF6B6B","#6C63FF","#F953C6","#43E97B","#FFC947","#56CCF2","#a78bfa"] },
  { id:"sunset", name:"Sunset", swatch:"#FF6B35",
    bg:"linear-gradient(135deg,#1c0500,#2d0f00,#1c0015)",
    lightBg:"linear-gradient(135deg,#fff5ee,#ffe8d6,#fff0f8)",
    sidebar:"rgba(0,0,0,0.3)", lightSidebar:"rgba(255,107,53,0.07)",
    spinBtn:"linear-gradient(135deg,#FF6B35,#FFD700)", spinShadow:"rgba(255,107,53,0.4)",
    addBtn:"linear-gradient(135deg,#FF8C42,#FFBF69)", addText:"#1c0500",
    accent:"#FF6B35", soft:"rgba(255,107,53,0.18)", border:"rgba(255,107,53,0.5)", muted:"#e8621e", toggle:"#FF6B35",
    titleGrad:"linear-gradient(135deg,#fff,#FFB347,#FF6B35)",
    titleGradLight:"linear-gradient(135deg,#FF6B35,#E85D04,#D00000)",
    confetti:["#FF6B35","#FFD700","#FF4500","#FFA500","#FF69B4","#fff"] },
  { id:"ocean", name:"Ocean", swatch:"#00B4D8",
    bg:"linear-gradient(135deg,#001219,#014f6b,#001219)",
    lightBg:"linear-gradient(135deg,#e8f6ff,#d0eef8,#e0f4ff)",
    sidebar:"rgba(0,0,0,0.3)", lightSidebar:"rgba(0,180,216,0.07)",
    spinBtn:"linear-gradient(135deg,#0096C7,#48CAE4)", spinShadow:"rgba(0,180,216,0.4)",
    addBtn:"linear-gradient(135deg,#52B788,#74C69D)", addText:"#001219",
    accent:"#0096C7", soft:"rgba(0,180,216,0.15)", border:"rgba(0,180,216,0.5)", muted:"#0096C7", toggle:"#0096C7",
    titleGrad:"linear-gradient(135deg,#fff,#90E0EF,#00B4D8)",
    titleGradLight:"linear-gradient(135deg,#0096C7,#023E8A,#0077B6)",
    confetti:["#00B4D8","#52B788","#ADE8F4","#00F5D4","#fff"] },
  { id:"forest", name:"Forest", swatch:"#52B788",
    bg:"linear-gradient(135deg,#081c15,#1b4332,#081c15)",
    lightBg:"linear-gradient(135deg,#edf5ee,#d4eeda,#edf8ee)",
    sidebar:"rgba(0,0,0,0.3)", lightSidebar:"rgba(82,183,136,0.07)",
    spinBtn:"linear-gradient(135deg,#52B788,#2D6A4F)", spinShadow:"rgba(82,183,136,0.4)",
    addBtn:"linear-gradient(135deg,#95D5B2,#B7E4C7)", addText:"#081c15",
    accent:"#52B788", soft:"rgba(82,183,136,0.15)", border:"rgba(82,183,136,0.5)", muted:"#3a9e6e", toggle:"#52B788",
    titleGrad:"linear-gradient(135deg,#fff,#95D5B2,#52B788)",
    titleGradLight:"linear-gradient(135deg,#2D6A4F,#40916C,#52B788)",
    confetti:["#52B788","#95D5B2","#FFD166","#EF476F","#fff"] },
  { id:"neon", name:"Neon", swatch:"#00FF87",
    bg:"linear-gradient(135deg,#000,#0a0014,#000)",
    lightBg:"linear-gradient(135deg,#f0fff8,#e8f8ff,#f8f0ff)",
    sidebar:"rgba(255,255,255,0.025)", lightSidebar:"rgba(0,255,135,0.07)",
    spinBtn:"linear-gradient(135deg,#00FF87,#60EFFF)", spinShadow:"rgba(0,255,135,0.45)",
    addBtn:"linear-gradient(135deg,#FF006E,#FF6B9D)", addText:"#fff",
    accent:"#00CC6A", soft:"rgba(0,204,106,0.12)", border:"rgba(0,204,106,0.45)", muted:"#00AA58", toggle:"#00CC6A",
    titleGrad:"linear-gradient(135deg,#fff,#60EFFF,#00FF87)",
    titleGradLight:"linear-gradient(135deg,#00AA58,#009966,#007744)",
    confetti:["#00FF87","#60EFFF","#FF006E","#FFD60A","#fff"] },
];

// ── Mode helper ───────────────────────────────────────────────────────────────
// Returns all adaptive neutral colours based on dark vs light preference
function buildMode(isLight, theme) {
  return isLight ? {
    light: true,
    text:    "#1a1a2e",
    sub:     "rgba(0,0,0,0.58)",
    faint:   "rgba(0,0,0,0.40)",
    ghost:   "rgba(0,0,0,0.25)",
    xghost:  "rgba(0,0,0,0.16)",
    surface: "rgba(0,0,0,0.045)",
    surfaceHov: "rgba(0,0,0,0.075)",
    bdr:     "rgba(0,0,0,0.09)",
    inputBg: "rgba(0,0,0,0.05)",
    inputBdr:"rgba(0,0,0,0.18)",
    ph:      "rgba(0,0,0,0.36)",
    bg:      theme.lightBg,
    sbBg:    theme.lightSidebar,
    divider: "rgba(0,0,0,0.08)",
    scroll:  "rgba(0,0,0,0.15)",
    modalBg: "rgba(0,0,0,0.55)",
    modalCard:"rgba(255,255,255,0.97)",
    titleGrad: theme.titleGradLight,
  } : {
    light: false,
    text:    "#fff",
    sub:     "rgba(255,255,255,0.58)",
    faint:   "rgba(255,255,255,0.40)",
    ghost:   "rgba(255,255,255,0.26)",
    xghost:  "rgba(255,255,255,0.16)",
    surface: "rgba(255,255,255,0.05)",
    surfaceHov: "rgba(255,255,255,0.09)",
    bdr:     "rgba(255,255,255,0.07)",
    inputBg: "rgba(255,255,255,0.08)",
    inputBdr:"rgba(255,255,255,0.15)",
    ph:      "rgba(255,255,255,0.36)",
    bg:      theme.bg,
    sbBg:    theme.sidebar,
    divider: "rgba(255,255,255,0.07)",
    scroll:  "rgba(255,255,255,0.15)",
    modalBg: "rgba(0,0,0,0.78)",
    modalCard:"rgba(8,8,22,0.98)",
    titleGrad: theme.titleGrad,
  };
}

function uid() { return Math.random().toString(36).slice(2,9); }
function defaultSpinner(name="My Spinner") { return { id:uid(), name, options:["Option 1","Option 2","Option 3"], history:[], removeWinner:false, colors:null }; }
function getSliceAngle(n) { return (2*Math.PI)/n; }
function timeAgo(ts) { const d=Math.floor((Date.now()-ts)/1000); if(d<5)return"just now"; if(d<60)return`${d}s ago`; if(d<3600)return`${Math.floor(d/60)}m ago`; return`${Math.floor(d/3600)}h ago`; }

let _actx=null;
function getACtx(){ if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)(); if(_actx.state==="suspended")_actx.resume(); return _actx; }
function playTick(){ try{ const c=getACtx(),o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type="triangle";o.frequency.value=550+Math.random()*200; g.gain.setValueAtTime(0.13,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.045); o.start(c.currentTime);o.stop(c.currentTime+0.05); }catch{} }
function playWin(){ try{ const c=getACtx(); [523,659,784,1047].forEach((f,i)=>{ const o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type="sine";o.frequency.value=f; const t=c.currentTime+i*0.13; g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.3,t+0.05);g.gain.exponentialRampToValueAtTime(0.001,t+0.55); o.start(t);o.stop(t+0.6); }); }catch{} }

function drawWheel(canvas, options, rotation, winnerIdx=-1, glowPulse=0, sliceColors=COLORS) {
  const ctx=canvas.getContext("2d"), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, r=Math.min(cx,cy)-10;
  ctx.clearRect(0,0,W,H);
  if(options.length===0){ ctx.fillStyle="rgba(128,128,128,0.2)"; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI); ctx.fill(); ctx.fillStyle="rgba(128,128,128,0.5)"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("Add options to start",cx,cy); return; }
  const slice=getSliceAngle(options.length);
  options.forEach((opt,i)=>{
    const col=sliceColors[i%sliceColors.length];
    const start=rotation+i*slice, end=start+slice, mid=start+slice/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    if(i===winnerIdx&&glowPulse>0){ ctx.shadowColor=col; ctx.shadowBlur=14+28*glowPulse; } else ctx.shadowBlur=0;
    ctx.fillStyle=col; ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle="rgba(255,255,255,0.28)"; ctx.lineWidth=2; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(mid); ctx.textAlign="right"; ctx.fillStyle="#fff";
    const fs=Math.max(10,Math.min(17,r/Math.max(options.length,1)*1.1));
    ctx.font=`bold ${fs}px sans-serif`; ctx.shadowColor="rgba(0,0,0,0.55)"; ctx.shadowBlur=5;
    ctx.fillText(opt.length>18?opt.slice(0,16)+"…":opt,r-16,fs/3); ctx.restore();
  });
  ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(cx,cy,20,0,2*Math.PI); ctx.fillStyle="#fff"; ctx.shadowBlur=8; ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.fill();
  ctx.shadowBlur=0; ctx.beginPath(); ctx.arc(cx,cy,12,0,2*Math.PI); ctx.fillStyle="#0a0820"; ctx.fill();
}

function ConfettiCanvas({trigger,colors}) {
  const ref=useRef(null);
  useEffect(()=>{
    if(!trigger)return;
    const canvas=ref.current; if(!canvas)return;
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    const ctx=canvas.getContext("2d");
    const ps=Array.from({length:160},()=>({ x:Math.random()*canvas.width, y:-10-Math.random()*150, vx:(Math.random()-.5)*5, vy:1.5+Math.random()*5, c:colors[Math.floor(Math.random()*colors.length)], w:7+Math.random()*9, h:4+Math.random()*5, rot:Math.random()*360, rv:(Math.random()-.5)*9 }));
    let t0=null,id; const DUR=4500;
    function draw(ts){ if(!t0)t0=ts; const el=ts-t0; ctx.clearRect(0,0,canvas.width,canvas.height); const fade=DUR*0.68;
      ps.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.09; p.rot+=p.rv; const op=el>fade?Math.max(0,1-(el-fade)/(DUR-fade)):1; ctx.save(); ctx.globalAlpha=op; ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); });
      if(el<DUR)id=requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height); }
    id=requestAnimationFrame(draw);
    return()=>{ cancelAnimationFrame(id); ctx.clearRect(0,0,canvas.width,canvas.height); };
  },[trigger]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,width:"100%",height:"100%"}}/>;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({spinners,activeId,onSelect,onAdd,onDelete,onRename,collapsed,onToggle,theme,mode}) {
  const [editId,setEditId]=useState(null), [editName,setEditName]=useState("");
  if(collapsed) return(
    <div style={{width:42,background:mode.sbBg,borderRight:`1px solid ${mode.divider}`,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:14,transition:"background 0.3s"}}>
      <button onClick={onToggle} style={{background:"none",border:"none",color:mode.faint,cursor:"pointer",fontSize:17,padding:6}}>☰</button>
    </div>
  );
  return(
    <div style={{width:200,background:mode.sbBg,borderRight:`1px solid ${mode.divider}`,display:"flex",flexDirection:"column",padding:"14px 9px",flexShrink:0,minHeight:"100vh",transition:"background 0.3s"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 3px",marginBottom:12}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:2,color:mode.ghost,textTransform:"uppercase"}}>Spinners</span>
        <button onClick={onToggle} style={{background:"none",border:"none",color:mode.ghost,cursor:"pointer",fontSize:12}}>◀</button>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
        {spinners.map(s=>(
          <div key={s.id} className="sb-item" onClick={()=>onSelect(s.id)} style={{borderRadius:9,padding:"8px 9px",cursor:"pointer",background:s.id===activeId?theme.soft:"transparent",border:`1px solid ${s.id===activeId?theme.border:"transparent"}`,transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>
            {editId===s.id?(
              <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                onBlur={()=>{if(editName.trim())onRename(s.id,editName.trim());setEditId(null);}}
                onKeyDown={e=>{if(e.key==="Enter"&&editName.trim()){onRename(s.id,editName.trim());setEditId(null);}if(e.key==="Escape")setEditId(null);}}
                onClick={e=>e.stopPropagation()}
                style={{flex:1,background:mode.inputBg,border:`1px solid ${theme.border}`,borderRadius:5,color:mode.text,fontFamily:"inherit",fontSize:12,padding:"1px 6px",outline:"none"}}/>
            ):(
              <>
                <span style={{flex:1,fontSize:12,fontWeight:s.id===activeId?600:400,color:s.id===activeId?theme.muted:mode.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                <div className="sb-btns" style={{display:"flex",gap:1,opacity:0,transition:"opacity 0.15s"}}>
                  <button onClick={e=>{e.stopPropagation();setEditId(s.id);setEditName(s.name);}} style={{background:"none",border:"none",color:mode.faint,cursor:"pointer",fontSize:11,padding:"1px 2px"}}>✏️</button>
                  {spinners.length>1&&<button onClick={e=>{e.stopPropagation();onDelete(s.id);}} style={{background:"none",border:"none",color:"rgba(220,50,50,0.6)",cursor:"pointer",fontSize:11,padding:"1px 2px"}}>🗑️</button>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={onAdd} style={{marginTop:10,background:theme.soft,border:`1px solid ${theme.border}`,color:theme.muted,borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ New Spinner</button>
    </div>
  );
}

// ── Spinner View ──────────────────────────────────────────────────────────────
function SpinnerView({spinner,onUpdate,theme,mode,soundRef}) {
  const [input,setInput]=useState("");
  const [spinning,setSpinning]=useState(false);
  const [result,setResult]=useState(null);
  const [resultColor,setResultColor]=useState(COLORS[0]);
  const [showResult,setShowResult]=useState(false);
  const [tab,setTab]=useState("options");
  const [editIdx,setEditIdx]=useState(null);
  const [editVal,setEditVal]=useState("");
  const [confTrigger,setConfTrigger]=useState(0);
  const [dragOver,setDragOver]=useState(null);
  const [draggingIdx,setDraggingIdx]=useState(null);
  const [showImport,setShowImport]=useState(false);
  const [importText,setImportText]=useState("");

  const canvasRef=useRef(null), rotRef=useRef(0), animRef=useRef(null), glowRef=useRef(null);
  const winIdxRef=useRef(-1), spinnerRef=useRef(spinner), lastSlotRef=useRef(-1), dragSrcRef=useRef(null);

  useEffect(()=>{spinnerRef.current=spinner;},[spinner]);
  const activeColors=spinner.colors||COLORS;

  useEffect(()=>{
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current);
    rotRef.current=0; winIdxRef.current=-1;
    setResult(null); setShowResult(false); setSpinning(false); setEditIdx(null);
    if(canvasRef.current) drawWheel(canvasRef.current,spinner.options,0,-1,0,activeColors);
  },[spinner.id]); // eslint-disable-line

  useEffect(()=>{
    if(canvasRef.current&&winIdxRef.current===-1&&!spinning)
      drawWheel(canvasRef.current,spinner.options,rotRef.current,-1,0,activeColors);
  },[spinner.options,spinner.colors]); // eslint-disable-line

  useEffect(()=>()=>{cancelAnimationFrame(animRef.current);cancelAnimationFrame(glowRef.current);},[]);

  function addOption(){ const t=input.trim(); if(!t||spinner.options.includes(t))return; const u={options:[...spinner.options,t]}; if(spinner.colors)u.colors=[...spinner.colors,COLORS[spinner.options.length%COLORS.length]]; onUpdate(u); setInput(""); }
  function removeOption(i){ const u={options:spinner.options.filter((_,j)=>j!==i)}; if(spinner.colors)u.colors=spinner.colors.filter((_,j)=>j!==i); onUpdate(u); }
  function commitEdit(i){ const t=editVal.trim(); if(t&&t!==spinner.options[i]){const o=[...spinner.options];o[i]=t;onUpdate({options:o});} setEditIdx(null); }

  function onDragStart(i,e){ dragSrcRef.current=i; setDraggingIdx(i); e.dataTransfer.effectAllowed="move"; e.dataTransfer.setData("text/plain",String(i)); }
  function onDragOver(i,e){ e.preventDefault(); if(dragSrcRef.current!==null&&i!==dragSrcRef.current)setDragOver(i); }
  function onDrop(i,e){ e.preventDefault(); const src=dragSrcRef.current; if(src===null||src===i){setDragOver(null);return;} const next=[...spinner.options]; const[item]=next.splice(src,1); next.splice(i,0,item); const u={options:next}; if(spinner.colors){const nc=[...spinner.colors];const[ci]=nc.splice(src,1);nc.splice(i,0,ci);u.colors=nc;} onUpdate(u); dragSrcRef.current=null; setDraggingIdx(null); setDragOver(null); }
  function onDragEnd(){ dragSrcRef.current=null; setDraggingIdx(null); setDragOver(null); }

  function importList(){ const inc=importText.split(/[,\n\r]+/).map(s=>s.trim()).filter(s=>s.length>0&&!spinner.options.includes(s)); if(inc.length){const u={options:[...spinner.options,...inc]};if(spinner.colors)u.colors=[...spinner.colors,...inc.map((_,k)=>COLORS[(spinner.options.length+k)%COLORS.length])];onUpdate(u);} setImportText(""); setShowImport(false); }
  function applyPalette(pc){ onUpdate({colors:spinner.options.map((_,i)=>pc[i%pc.length])}); }
  function updateColor(idx,color){ const base=spinner.colors?[...spinner.colors]:spinner.options.map((_,i)=>COLORS[i%COLORS.length]); while(base.length<=idx)base.push(COLORS[base.length%COLORS.length]); base[idx]=color; onUpdate({colors:base}); }

  function spin(){
    if(spinning||spinner.options.length<2)return;
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current); winIdxRef.current=-1;
    if(soundRef.current){try{getACtx().resume();}catch{}}
    setSpinning(true); setShowResult(false); setResult(null); lastSlotRef.current=-1;
    const opts=[...spinner.options], spinColors=spinner.colors?[...spinner.colors]:COLORS, slice=getSliceAngle(opts.length);
    const totalRot=2*Math.PI*(6+Math.random()*6), dur=4000+Math.random()*1500;
    const t0=performance.now(), r0=rotRef.current, ease=t=>1-Math.pow(1-t,4);
    if(canvasRef.current)drawWheel(canvasRef.current,opts,rotRef.current,-1,0,spinColors);
    function frame(now){
      const p=Math.min((now-t0)/dur,1); rotRef.current=r0+totalRot*ease(p);
      if(soundRef.current){ const n=((rotRef.current%(2*Math.PI))+2*Math.PI)%(2*Math.PI); const slot=Math.floor(((2*Math.PI-n)%(2*Math.PI))/slice)%opts.length; if(slot!==lastSlotRef.current){playTick();lastSlotRef.current=slot;} }
      if(canvasRef.current)drawWheel(canvasRef.current,opts,rotRef.current,-1,0,spinColors);
      if(p<1){animRef.current=requestAnimationFrame(frame);return;}
      setSpinning(false);
      const n=((rotRef.current%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      const wIdx=Math.floor(((2*Math.PI-n)%(2*Math.PI))/slice)%opts.length;
      const winner=opts[wIdx]; const wColor=spinColors[wIdx%spinColors.length];
      setResult(winner); setResultColor(wColor); setTimeout(()=>setShowResult(true),80);
      setConfTrigger(k=>k+1); if(soundRef.current)playWin();
      winIdxRef.current=wIdx;
      const gs=performance.now(); const GDUR=2400;
      function gloop(ts){ const el=ts-gs; const pulse=el<GDUR?(Math.sin(el/290*Math.PI*2)+1)/2:0.65; if(canvasRef.current)drawWheel(canvasRef.current,opts,rotRef.current,wIdx,pulse,spinColors); if(el<GDUR+60){glowRef.current=requestAnimationFrame(gloop);}else{winIdxRef.current=-1;if(canvasRef.current)drawWheel(canvasRef.current,spinnerRef.current.options,rotRef.current,-1,0,spinnerRef.current.colors||COLORS);} }
      glowRef.current=requestAnimationFrame(gloop);
      const cur=spinnerRef.current, newHist=[{result:winner,timestamp:Date.now()},...(cur.history||[])].slice(0,25);
      const upd={history:newHist};
      if(cur.removeWinner&&opts.length>1){upd.options=opts.filter((_,i)=>i!==wIdx);if(cur.colors)upd.colors=cur.colors.filter((_,i)=>i!==wIdx);}
      onUpdate(upd);
    }
    animRef.current=requestAnimationFrame(frame);
  }

  const {options,history,removeWinner}=spinner;
  const tabBtn=(id,label)=>({ onClick:()=>setTab(id), children:label, style:{ flex:1,padding:"7px",border:"none",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.15s", background:tab===id?`${theme.accent}99`:"transparent", color:tab===id?"#fff":mode.faint } });

  // Shared styles
  const surfaceItem={display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:mode.surface,borderRadius:9,border:`1px solid ${mode.bdr}`};

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 40px",gap:16,overflowY:"auto",transition:"background 0.3s"}}>
      <ConfettiCanvas trigger={confTrigger} colors={theme.confetti}/>

      {/* Winner modal */}
      {showResult&&result&&(
        <div onClick={()=>setShowResult(false)} style={{position:"fixed",inset:0,zIndex:1000,background:mode.modalBg,backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:16}}>
          <div className="winner-modal" onClick={e=>e.stopPropagation()} style={{background:mode.light?`linear-gradient(160deg,#fff 60%,${resultColor}18 100%)`:mode.modalCard,border:`2px solid ${resultColor}66`,borderRadius:28,padding:"44px 52px",textAlign:"center",maxWidth:460,width:"100%",boxShadow:`0 0 100px ${resultColor}33,0 40px 80px rgba(0,0,0,0.5)`,cursor:"default",position:"relative"}}>
            <button onClick={()=>setShowResult(false)} style={{position:"absolute",top:14,right:16,background:mode.surface,border:`1px solid ${mode.bdr}`,color:mode.faint,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            <div style={{fontSize:52,marginBottom:6,lineHeight:1}}>🏆</div>
            <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:mode.faint,marginBottom:14,fontWeight:600}}>Winner</div>
            <div style={{fontSize:"clamp(30px,8vw,54px)",fontWeight:900,lineHeight:1.1,marginBottom:28,wordBreak:"break-word",background:`linear-gradient(135deg,${mode.light?resultColor:"#fff"} 0%,${resultColor} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{result}</div>
            {removeWinner&&<p style={{fontSize:12,color:mode.faint,marginBottom:24,marginTop:-12}}>Removed from the wheel</p>}
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>setShowResult(false)} style={{background:`linear-gradient(135deg,${resultColor},${resultColor}bb)`,border:"none",color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:700,padding:"12px 30px",borderRadius:100,cursor:"pointer",boxShadow:`0 6px 24px ${resultColor}55`}}>Continue →</button>
              <button onClick={()=>{setShowResult(false);setTimeout(spin,120);}} disabled={options.length<2} style={{background:mode.surface,border:`1px solid ${mode.bdr}`,color:mode.text,fontFamily:"inherit",fontSize:14,fontWeight:700,padding:"12px 30px",borderRadius:100,cursor:"pointer"}}>🔄 Spin Again</button>
            </div>
            <p style={{fontSize:11,color:mode.ghost,marginTop:20,marginBottom:0}}>Click anywhere outside to close</p>
          </div>
        </div>
      )}

      {/* Wheel */}
      <div style={{position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",right:-12,top:"50%",transform:"translateY(-50%)",zIndex:10,width:0,height:0,borderTop:"13px solid transparent",borderBottom:"13px solid transparent",borderRight:"26px solid #fff",filter:"drop-shadow(0 0 7px rgba(255,255,255,0.7))"}}/>
        <canvas ref={canvasRef} width={280} height={280} style={{borderRadius:"50%",boxShadow:"0 0 50px rgba(0,0,0,0.35),0 16px 50px rgba(0,0,0,0.4)",display:"block"}}/>
      </div>

      <button className="spin-btn" onClick={spin} disabled={spinning||options.length<2}>{spinning?"Spinning…":"SPIN!"}</button>
      {options.length<2&&!spinning&&<p style={{color:mode.ghost,fontSize:11,margin:0}}>Add at least 2 options to spin</p>}

      {/* Tabs */}
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{display:"flex",gap:3,marginBottom:12,background:mode.surface,borderRadius:10,padding:3}}>
          <button {...tabBtn("options",`Options (${options.length})`)}/>
          <button {...tabBtn("colours","🎨 Colours")}/>
          <button {...tabBtn("history",`History (${history.length})`)}/>
        </div>

        {/* ── OPTIONS ── */}
        {tab==="options"&&(
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            <div onClick={()=>onUpdate({removeWinner:!removeWinner})} style={{...surfaceItem,cursor:"pointer",userSelect:"none",padding:"9px 12px"}}>
              <div style={{width:34,height:19,borderRadius:100,background:removeWinner?theme.toggle:mode.bdr,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:removeWinner?18:3,width:13,height:13,borderRadius:"50%",background:mode.light?removeWinner?"#fff":"rgba(0,0,0,0.3)":"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.25)"}}/>
              </div>
              <span style={{fontSize:12,color:mode.sub}}>Remove winner after spin</span>
            </div>
            <div style={{display:"flex",gap:7}}>
              <input className="opt-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOption()} placeholder="Type an option…" maxLength={40}/>
              <button className="add-btn" onClick={addOption}>Add</button>
            </div>
            <button onClick={()=>setShowImport(p=>!p)} style={{display:"flex",alignItems:"center",gap:6,background:showImport?theme.soft:mode.surface,border:`1px solid ${showImport?theme.border:mode.bdr}`,color:showImport?theme.muted:mode.sub,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
              <span style={{fontSize:14}}>{showImport?"✕":"📋"}</span>{showImport?"Close import":"Import a list"}
            </button>
            {showImport&&(
              <div style={{display:"flex",flexDirection:"column",gap:8,padding:"12px",background:mode.surface,borderRadius:10,border:`1px solid ${theme.border}`}}>
                <p style={{margin:0,fontSize:11,color:mode.faint}}>Paste items separated by commas or new lines</p>
                <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"pizza, tacos, sushi\nor one per line"} rows={4} style={{background:mode.inputBg,border:`1.5px solid ${mode.inputBdr}`,borderRadius:8,padding:"9px 12px",color:mode.text,fontFamily:"inherit",fontSize:13,outline:"none",resize:"vertical",width:"100%"}}/>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={importList} disabled={!importText.trim()} style={{flex:1,background:importText.trim()?theme.soft:mode.surface,border:`1px solid ${theme.border}`,color:importText.trim()?theme.muted:mode.faint,borderRadius:100,padding:"8px",cursor:importText.trim()?"pointer":"default",fontFamily:"inherit",fontSize:12,fontWeight:700}}>✓ Add all items</button>
                  <button onClick={()=>{setImportText("");setShowImport(false);}} style={{background:mode.surface,border:`1px solid ${mode.bdr}`,color:mode.faint,borderRadius:100,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Cancel</button>
                </div>
              </div>
            )}
            {options.length>0&&<p style={{margin:"2px 0 0",fontSize:11,color:mode.ghost}}>⠿ Drag rows to reorder</p>}
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:260,overflowY:"auto"}}>
              {options.map((opt,i)=>(
                <div key={i} draggable onDragStart={e=>onDragStart(i,e)} onDragOver={e=>onDragOver(i,e)} onDrop={e=>onDrop(i,e)} onDragEnd={onDragEnd}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px 7px 5px",background:dragOver===i?theme.soft:mode.surface,borderRadius:9,border:`1px solid ${dragOver===i?theme.border:mode.bdr}`,opacity:draggingIdx===i?0.3:1,cursor:"grab",transition:"background 0.1s,border-color 0.1s,opacity 0.1s"}}>
                  <span style={{color:mode.ghost,fontSize:14,cursor:"grab",lineHeight:1,userSelect:"none",flexShrink:0}}>⠿</span>
                  <span style={{width:10,height:10,borderRadius:"50%",background:activeColors[i%activeColors.length],flexShrink:0}}/>
                  {editIdx===i?(
                    <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={()=>commitEdit(i)} onKeyDown={e=>{if(e.key==="Enter")commitEdit(i);if(e.key==="Escape")setEditIdx(null);}} style={{flex:1,background:mode.inputBg,border:`1px solid ${theme.border}`,borderRadius:5,color:mode.text,fontFamily:"inherit",fontSize:12,padding:"2px 7px",outline:"none"}}/>
                  ):(
                    <span style={{flex:1,fontSize:12,color:mode.sub}}>{opt}</span>
                  )}
                  <button onClick={()=>{setEditIdx(i);setEditVal(opt);}} style={{background:"none",border:"none",color:mode.ghost,cursor:"pointer",fontSize:12,padding:"2px 3px"}}>✏️</button>
                  <button onClick={()=>removeOption(i)} style={{background:"none",border:"none",color:"rgba(220,50,50,0.55)",cursor:"pointer",fontSize:15,padding:"2px 3px",lineHeight:1}}>×</button>
                </div>
              ))}
              {options.length===0&&<p style={{color:mode.ghost,fontSize:12,textAlign:"center",padding:"18px 0",margin:0}}>No options yet!</p>}
            </div>
            {options.length>0&&<button onClick={()=>onUpdate({options:[],colors:null})} style={{background:"rgba(220,50,50,0.1)",border:"1px solid rgba(220,50,50,0.2)",color:"#dc3232",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>Clear all options</button>}
          </div>
        )}

        {/* ── COLOURS ── */}
        {tab==="colours"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <p style={{margin:"0 0 8px",fontSize:11,fontWeight:600,color:mode.faint,letterSpacing:1,textTransform:"uppercase"}}>Colour Palettes</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {PALETTES.map(p=>(
                  <button key={p.id} onClick={()=>applyPalette(p.colors)} style={{background:mode.surface,border:`1px solid ${mode.bdr}`,borderRadius:10,padding:"8px 10px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                    <div style={{display:"flex",borderRadius:5,overflow:"hidden",marginBottom:6,height:14}}>
                      {p.colors.slice(0,8).map((c,i)=>(<div key={i} style={{flex:1,background:c}}/>))}
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:mode.sub}}>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {options.length>0&&(
              <div>
                <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,color:mode.faint,letterSpacing:1,textTransform:"uppercase"}}>Individual Slice Colours</p>
                <p style={{margin:"0 0 10px",fontSize:11,color:mode.ghost}}>Click a colour circle to change that slice</p>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:240,overflowY:"auto"}}>
                  {options.map((opt,i)=>{
                    const col=activeColors[i%activeColors.length];
                    return(
                      <div key={i} style={{...surfaceItem}}>
                        <label title="Click to change colour" style={{position:"relative",width:28,height:28,flexShrink:0,cursor:"pointer"}}>
                          <div style={{position:"absolute",inset:0,borderRadius:"50%",background:col,border:"2.5px solid rgba(255,255,255,0.35)",boxShadow:`0 0 0 1px rgba(0,0,0,0.15),0 2px 8px ${col}88`,pointerEvents:"none"}}/>
                          <input type="color" value={col} onChange={e=>updateColor(i,e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%",border:"none",padding:0}}/>
                        </label>
                        <span style={{flex:1,fontSize:12,color:mode.sub}}>{opt}</span>
                        <span style={{fontSize:10,color:mode.ghost,fontFamily:"monospace"}}>{col.toUpperCase()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {spinner.colors&&<button onClick={()=>onUpdate({colors:null})} style={{background:"rgba(220,50,50,0.1)",border:"1px solid rgba(220,50,50,0.2)",color:"#dc3232",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>↺ Reset to default colours</button>}
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:360,overflowY:"auto"}}>
            {history.length===0?(<p style={{color:mode.ghost,fontSize:12,textAlign:"center",padding:"24px 0",margin:0}}>No spins yet!</p>):(
              <>
                {history.map((item,i)=>(
                  <div key={i} style={{...surfaceItem,padding:"9px 12px"}}>
                    <span style={{fontSize:12,fontWeight:800,color:theme.muted,minWidth:26,textAlign:"center"}}>#{history.length-i}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:600,color:mode.text}}>{item.result}</span>
                    <span style={{fontSize:10,color:mode.ghost,whiteSpace:"nowrap"}}>{timeAgo(item.timestamp)}</span>
                  </div>
                ))}
                <button onClick={()=>onUpdate({history:[]})} style={{background:"rgba(220,50,50,0.1)",border:"1px solid rgba(220,50,50,0.2)",color:"#dc3232",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,marginTop:3}}>Clear history</button>
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
  const [spinners,setSpinners]=useState(()=>{ try{ const r=localStorage.getItem("wheel-v3"); if(r){const d=JSON.parse(r);if(Array.isArray(d)&&d.length>0)return d.map(s=>({history:[],removeWinner:false,colors:null,...s}));} }catch{} return[defaultSpinner("My First Spinner")]; });
  const [activeId,setActiveId]=useState(spinners[0]?.id);
  const [collapsed,setCollapsed]=useState(false);
  const [themeId,setThemeId]=useState(()=>{try{return localStorage.getItem("wheel-theme")||"cosmic";}catch{return"cosmic";}});
  const [soundOn,setSoundOn]=useState(()=>{try{return localStorage.getItem("wheel-sound")!=="false";}catch{return true;}});
  const [isLight,setIsLight]=useState(()=>{try{return localStorage.getItem("wheel-light")==="true";}catch{return false;}});
  const soundRef=useRef(soundOn);
  useEffect(()=>{soundRef.current=soundOn;},[soundOn]);
  useEffect(()=>{try{localStorage.setItem("wheel-v3",JSON.stringify(spinners));}catch{}},[spinners]);
  useEffect(()=>{try{localStorage.setItem("wheel-theme",themeId);}catch{}},[themeId]);
  useEffect(()=>{try{localStorage.setItem("wheel-sound",String(soundOn));}catch{}},[soundOn]);
  useEffect(()=>{try{localStorage.setItem("wheel-light",String(isLight));}catch{}},[isLight]);

  function updateSpinner(id,updates){setSpinners(p=>p.map(s=>s.id===id?{...s,...updates}:s));}
  function addSpinner(){const s=defaultSpinner(`Spinner ${spinners.length+1}`);setSpinners(p=>[...p,s]);setActiveId(s.id);}
  function deleteSpinner(id){if(spinners.length===1)return;const r=spinners.filter(s=>s.id!==id);setSpinners(r);if(activeId===id)setActiveId(r[0].id);}

  const theme=THEMES.find(t=>t.id===themeId)||THEMES[0];
  const mode=buildMode(isLight,theme);
  const active=spinners.find(s=>s.id===activeId)||spinners[0];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:mode.bg,fontFamily:"'Segoe UI',sans-serif",color:mode.text,transition:"background 0.35s,color 0.35s"}}>
      <style>{`
        *{box-sizing:border-box;}
        .spin-btn{background:${theme.spinBtn};border:none;color:#fff;font-family:inherit;font-size:17px;font-weight:800;padding:14px 44px;border-radius:100px;cursor:pointer;letter-spacing:1px;transition:transform 0.15s,box-shadow 0.15s,opacity 0.2s;box-shadow:0 8px 28px ${theme.spinShadow};}
        .spin-btn:hover:not(:disabled){transform:translateY(-2px) scale(1.04);}
        .spin-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .add-btn{background:${theme.addBtn};border:none;color:${theme.addText};font-family:inherit;font-size:13px;font-weight:700;padding:10px 18px;border-radius:100px;cursor:pointer;transition:transform 0.15s;white-space:nowrap;}
        .add-btn:hover{transform:translateY(-1px);}
        .opt-input{background:${mode.inputBg};border:1.5px solid ${mode.inputBdr};border-radius:100px;padding:10px 18px;color:${mode.text};font-family:inherit;font-size:13px;outline:none;transition:border-color 0.2s,background 0.3s;width:100%;}
        .opt-input::placeholder{color:${mode.ph};}
        .opt-input:focus{border-color:${theme.border};}
        .winner-modal{animation:modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.75) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .sb-item:hover{background:${mode.surfaceHov} !important;}
        .sb-item:hover .sb-btns{opacity:1 !important;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${mode.scroll};border-radius:3px;}
        textarea{color-scheme:${isLight?"light":"dark"};background:${mode.inputBg};color:${mode.text};}
      `}</style>

      <Sidebar spinners={spinners} activeId={active.id} onSelect={setActiveId} onAdd={addSpinner} onDelete={deleteSpinner} onRename={(id,name)=>updateSpinner(id,{name})} collapsed={collapsed} onToggle={()=>setCollapsed(p=>!p)} theme={theme} mode={mode}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Header */}
        <div style={{position:"relative",padding:"10px 16px",borderBottom:`1px solid ${mode.divider}`,display:"flex",alignItems:"center",flexShrink:0,minHeight:46,transition:"border-color 0.3s"}}>
          <div style={{display:"flex",alignItems:"center",zIndex:1}}>
            {collapsed&&<button onClick={()=>setCollapsed(false)} style={{background:"none",border:"none",color:mode.faint,cursor:"pointer",fontSize:17,padding:"2px 4px"}}>☰</button>}
          </div>
          {/* Centred title */}
          <h1 style={{position:"absolute",left:0,right:0,margin:0,textAlign:"center",fontSize:"clamp(13px,2.5vw,18px)",fontWeight:800,background:mode.titleGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",pointerEvents:"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",padding:"0 160px"}}>{active.name}</h1>
          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:7,marginLeft:"auto",zIndex:1}}>
            {/* Dark / Light toggle */}
            <button onClick={()=>setIsLight(p=>!p)} title={isLight?"Switch to dark mode":"Switch to light mode"}
              style={{background:mode.surface,border:`1px solid ${mode.bdr}`,color:mode.text,borderRadius:8,padding:"4px 9px",cursor:"pointer",fontSize:15,lineHeight:1,transition:"all 0.2s"}}>
              {isLight?"🌙":"☀️"}
            </button>
            {/* Sound toggle */}
            <button onClick={()=>setSoundOn(p=>!p)} title={soundOn?"Mute":"Unmute"} style={{background:mode.surface,border:`1px solid ${mode.bdr}`,color:mode.text,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:14,lineHeight:1}}>
              {soundOn?"🔊":"🔇"}
            </button>
            {/* Theme swatches */}
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {THEMES.map(t=>(<button key={t.id} onClick={()=>setThemeId(t.id)} title={t.name} style={{width:18,height:18,borderRadius:"50%",background:t.swatch,border:themeId===t.id?"2.5px solid "+mode.text:"2px solid rgba(128,128,128,0.3)",cursor:"pointer",padding:0,transition:"transform 0.15s,border 0.15s",transform:themeId===t.id?"scale(1.3)":"scale(1)"}}/>))}
            </div>
          </div>
        </div>

        <SpinnerView key={active.id} spinner={active} onUpdate={u=>updateSpinner(active.id,u)} theme={theme} mode={mode} soundRef={soundRef}/>
      </div>
    </div>
  );
}