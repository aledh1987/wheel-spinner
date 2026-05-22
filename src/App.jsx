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

const THEMES = [
  { id:"cosmic", name:"Cosmic", swatch:"#6C63FF", bg:"linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)", sidebar:"rgba(0,0,0,0.25)", spinBtn:"linear-gradient(135deg,#6C63FF,#F953C6)", spinShadow:"rgba(108,99,255,0.4)", addBtn:"linear-gradient(135deg,#43e97b,#38f9d7)", addText:"#0f0c29", accent:"#6C63FF", soft:"rgba(108,99,255,0.22)", border:"rgba(108,99,255,0.55)", muted:"#a78bfa", toggle:"#6C63FF", titleGrad:"linear-gradient(135deg,#fff,#a78bfa,#f9a8d4)", confetti:["#FF6B6B","#6C63FF","#F953C6","#43E97B","#FFC947","#56CCF2","#fff"] },
  { id:"sunset", name:"Sunset", swatch:"#FF6B35", bg:"linear-gradient(135deg,#1c0500,#2d0f00,#1c0015)", sidebar:"rgba(0,0,0,0.3)", spinBtn:"linear-gradient(135deg,#FF6B35,#FFD700)", spinShadow:"rgba(255,107,53,0.4)", addBtn:"linear-gradient(135deg,#FF8C42,#FFBF69)", addText:"#1c0500", accent:"#FF6B35", soft:"rgba(255,107,53,0.22)", border:"rgba(255,107,53,0.55)", muted:"#FFB347", toggle:"#FF6B35", titleGrad:"linear-gradient(135deg,#fff,#FFB347,#FF6B35)", confetti:["#FF6B35","#FFD700","#FF4500","#FFA500","#FF69B4","#fff"] },
  { id:"ocean",  name:"Ocean",  swatch:"#00B4D8", bg:"linear-gradient(135deg,#001219,#014f6b,#001219)", sidebar:"rgba(0,0,0,0.3)", spinBtn:"linear-gradient(135deg,#0096C7,#48CAE4)", spinShadow:"rgba(0,180,216,0.4)", addBtn:"linear-gradient(135deg,#52B788,#74C69D)", addText:"#001219", accent:"#00B4D8", soft:"rgba(0,180,216,0.18)", border:"rgba(0,180,216,0.55)", muted:"#90E0EF", toggle:"#0096C7", titleGrad:"linear-gradient(135deg,#fff,#90E0EF,#00B4D8)", confetti:["#00B4D8","#52B788","#ADE8F4","#00F5D4","#fff"] },
  { id:"forest", name:"Forest", swatch:"#52B788", bg:"linear-gradient(135deg,#081c15,#1b4332,#081c15)", sidebar:"rgba(0,0,0,0.3)", spinBtn:"linear-gradient(135deg,#52B788,#2D6A4F)", spinShadow:"rgba(82,183,136,0.4)", addBtn:"linear-gradient(135deg,#95D5B2,#B7E4C7)", addText:"#081c15", accent:"#52B788", soft:"rgba(82,183,136,0.18)", border:"rgba(82,183,136,0.55)", muted:"#95D5B2", toggle:"#52B788", titleGrad:"linear-gradient(135deg,#fff,#95D5B2,#52B788)", confetti:["#52B788","#95D5B2","#FFD166","#EF476F","#fff"] },
  { id:"neon",   name:"Neon",   swatch:"#00FF87", bg:"linear-gradient(135deg,#000,#0a0014,#000)", sidebar:"rgba(255,255,255,0.025)", spinBtn:"linear-gradient(135deg,#00FF87,#60EFFF)", spinShadow:"rgba(0,255,135,0.45)", addBtn:"linear-gradient(135deg,#FF006E,#FF6B9D)", addText:"#fff", accent:"#00FF87", soft:"rgba(0,255,135,0.1)", border:"rgba(0,255,135,0.45)", muted:"#00FF87", toggle:"#00FF87", titleGrad:"linear-gradient(135deg,#fff,#60EFFF,#00FF87)", confetti:["#00FF87","#60EFFF","#FF006E","#FFD60A","#fff"] },
];

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
  if(options.length===0){ ctx.fillStyle="rgba(255,255,255,0.07)"; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("Add options to start",cx,cy); return; }
  const slice=getSliceAngle(options.length);
  options.forEach((opt,i)=>{
    const col=sliceColors[i%sliceColors.length];
    const start=rotation+i*slice, end=start+slice, mid=start+slice/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    if(i===winnerIdx&&glowPulse>0){ ctx.shadowColor=col; ctx.shadowBlur=14+28*glowPulse; } else ctx.shadowBlur=0;
    ctx.fillStyle=col; ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.lineWidth=2; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(mid); ctx.textAlign="right"; ctx.fillStyle="#fff";
    const fs=Math.max(10,Math.min(17,r/Math.max(options.length,1)*1.1));
    ctx.font=`bold ${fs}px sans-serif`; ctx.shadowColor="rgba(0,0,0,0.55)"; ctx.shadowBlur=5;
    ctx.fillText(opt.length>18?opt.slice(0,16)+"…":opt,r-16,fs/3); ctx.restore();
  });
  ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(cx,cy,20,0,2*Math.PI); ctx.fillStyle="#fff"; ctx.shadowBlur=8; ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.fill();
  ctx.shadowBlur=0; ctx.beginPath(); ctx.arc(cx,cy,12,0,2*Math.PI); ctx.fillStyle="#080816"; ctx.fill();
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

function WinnerOverlay({ winner, color, onDismiss }) {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    const iv = setInterval(() => setProgress(p => { if(p<=0){clearInterval(iv);onDismiss();return 0;} return p-1; }), 50);
    return () => clearInterval(iv);
  }, []); // eslint-disable-line

  return (
    <div onClick={onDismiss} style={{ position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.78)",backdropFilter:"blur(10px)",animation:"overlayIn 0.3s ease",cursor:"pointer" }}>
      <div onClick={e=>e.stopPropagation()} className="winner-card" style={{ textAlign:"center",padding:"52px 64px",borderRadius:28,background:"rgba(255,255,255,0.06)",border:`1px solid ${color}66`,boxShadow:`0 0 100px ${color}55, 0 0 40px ${color}33, 0 32px 80px rgba(0,0,0,0.7)`,maxWidth:"min(560px,90vw)",width:"100%",position:"relative",overflow:"hidden",cursor:"default" }}>
        {/* Background glow orb */}
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:400,background:`radial-gradient(circle, ${color}2a 0%, transparent 65%)`,pointerEvents:"none" }}/>

        {/* Sparkle ring */}
        <div style={{ fontSize:32,marginBottom:12,animation:"spin 8s linear infinite",display:"inline-block" }}>✨</div>

        <div style={{ fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:20 }}>🎉 We have a winner!</div>

        <div style={{ fontSize:"clamp(32px,7vw,68px)",fontWeight:900,lineHeight:1.1,marginBottom:36,color:"#fff",textShadow:`0 0 30px ${color}, 0 0 60px ${color}88, 0 4px 20px rgba(0,0,0,0.5)`,wordBreak:"break-word",position:"relative" }}>
          {winner}
        </div>

        {/* Dismiss button */}
        <button onClick={onDismiss} style={{ background:`${color}33`,border:`1.5px solid ${color}88`,color:"#fff",borderRadius:100,padding:"12px 40px",cursor:"pointer",fontFamily:"inherit",fontSize:15,fontWeight:700,transition:"background 0.2s",marginBottom:16 }}>
          Continue
        </button>

        <div style={{ fontSize:11,color:"rgba(255,255,255,0.25)",marginBottom:20 }}>or click anywhere to close</div>

        {/* Auto-dismiss progress bar */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(255,255,255,0.08)",borderRadius:"0 0 28px 28px" }}>
          <div style={{ height:"100%",width:`${progress}%`,background:color,borderRadius:"0 0 28px 28px",transition:"width 0.05s linear" }}/>
        </div>
      </div>
    </div>
  );
}

function Sidebar({spinners,activeId,onSelect,onAdd,onDelete,onRename,collapsed,onToggle,theme}) {
  const [editId,setEditId]=useState(null), [editName,setEditName]=useState("");
  if(collapsed) return(
    <div style={{width:42,background:theme.sidebar,borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:14}}>
      <button onClick={onToggle} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:17,padding:6}}>☰</button>
    </div>
  );
  return(
    <div style={{width:200,background:theme.sidebar,borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",padding:"14px 9px",flexShrink:0,minHeight:"100vh"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 3px",marginBottom:12}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Spinners</span>
        <button onClick={onToggle} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:12}}>◀</button>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
        {spinners.map(s=>(
          <div key={s.id} className="sb-item" onClick={()=>onSelect(s.id)} style={{borderRadius:9,padding:"8px 9px",cursor:"pointer",background:s.id===activeId?theme.soft:"transparent",border:`1px solid ${s.id===activeId?theme.border:"transparent"}`,transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>
            {editId===s.id?(
              <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                onBlur={()=>{if(editName.trim())onRename(s.id,editName.trim());setEditId(null);}}
                onKeyDown={e=>{if(e.key==="Enter"&&editName.trim()){onRename(s.id,editName.trim());setEditId(null);}if(e.key==="Escape")setEditId(null);}}
                onClick={e=>e.stopPropagation()}
                style={{flex:1,background:"rgba(255,255,255,0.1)",border:`1px solid ${theme.border}`,borderRadius:5,color:"#fff",fontFamily:"inherit",fontSize:12,padding:"1px 6px",outline:"none"}}/>
            ):(
              <>
                <span style={{flex:1,fontSize:12,fontWeight:s.id===activeId?600:400,color:s.id===activeId?"#e8e4ff":"rgba(255,255,255,0.55)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                <div className="sb-btns" style={{display:"flex",gap:1,opacity:0,transition:"opacity 0.15s"}}>
                  <button onClick={e=>{e.stopPropagation();setEditId(s.id);setEditName(s.name);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,padding:"1px 2px"}}>✏️</button>
                  {spinners.length>1&&<button onClick={e=>{e.stopPropagation();onDelete(s.id);}} style={{background:"none",border:"none",color:"rgba(255,100,100,0.6)",cursor:"pointer",fontSize:11,padding:"1px 2px"}}>🗑️</button>}
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

function SpinnerView({spinner,onUpdate,theme,soundRef}) {
  const [input,setInput]=useState("");
  const [spinning,setSpinning]=useState(false);
  const [result,setResult]=useState(null);
  const [showResult,setShowResult]=useState(false);
  const [tab,setTab]=useState("options");
  const [editIdx,setEditIdx]=useState(null);
  const [editVal,setEditVal]=useState("");
  const [confTrigger,setConfTrigger]=useState(0);
  const [resultColor,setResultColor]=useState(COLORS[0]);
  const [dragOver,setDragOver]=useState(null);
  const [draggingIdx,setDraggingIdx]=useState(null);
  const [showImport,setShowImport]=useState(false);
  const [importText,setImportText]=useState("");

  const canvasRef=useRef(null), rotRef=useRef(0), animRef=useRef(null), glowRef=useRef(null);
  const winIdxRef=useRef(-1), spinnerRef=useRef(spinner), lastSlotRef=useRef(-1), dragSrcRef=useRef(null);

  useEffect(()=>{spinnerRef.current=spinner;},[spinner]);

  const activeColors = spinner.colors || COLORS;

  useEffect(()=>{
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current);
    rotRef.current=0; winIdxRef.current=-1;
    setResult(null); setShowResult(false); setSpinning(false); setEditIdx(null);
    if(canvasRef.current) drawWheel(canvasRef.current,spinner.options,0,-1,0,spinner.colors||COLORS);
  },[spinner.id]); // eslint-disable-line

  useEffect(()=>{
    if(canvasRef.current&&winIdxRef.current===-1&&!spinning)
      drawWheel(canvasRef.current,spinner.options,rotRef.current,-1,0,spinner.colors||COLORS);
  },[spinner.options,spinner.colors]); // eslint-disable-line

  useEffect(()=>()=>{cancelAnimationFrame(animRef.current);cancelAnimationFrame(glowRef.current);},[]);

  // ── Options helpers ──
  function addOption(){
    const t=input.trim(); if(!t||spinner.options.includes(t))return;
    const upd={options:[...spinner.options,t]};
    if(spinner.colors) upd.colors=[...spinner.colors, COLORS[spinner.options.length%COLORS.length]];
    onUpdate(upd); setInput("");
  }
  function removeOption(i){
    const upd={options:spinner.options.filter((_,j)=>j!==i)};
    if(spinner.colors) upd.colors=spinner.colors.filter((_,j)=>j!==i);
    onUpdate(upd);
  }
  function commitEdit(i){ const t=editVal.trim(); if(t&&t!==spinner.options[i]){const o=[...spinner.options];o[i]=t;onUpdate({options:o});} setEditIdx(null); }

  // ── Drag helpers ──
  function onDragStart(i,e){ dragSrcRef.current=i; setDraggingIdx(i); e.dataTransfer.effectAllowed="move"; e.dataTransfer.setData("text/plain",String(i)); }
  function onDragOver(i,e){ e.preventDefault(); if(dragSrcRef.current!==null&&i!==dragSrcRef.current)setDragOver(i); }
  function onDrop(i,e){
    e.preventDefault(); const src=dragSrcRef.current; if(src===null||src===i){setDragOver(null);return;}
    const next=[...spinner.options]; const[item]=next.splice(src,1); next.splice(i,0,item);
    const upd={options:next};
    if(spinner.colors){ const nc=[...spinner.colors]; const[ci]=nc.splice(src,1); nc.splice(i,0,ci); upd.colors=nc; }
    onUpdate(upd); dragSrcRef.current=null; setDraggingIdx(null); setDragOver(null);
  }
  function onDragEnd(){ dragSrcRef.current=null; setDraggingIdx(null); setDragOver(null); }

  // ── Import helper ──
  function importList(){
    const incoming=importText.split(/[,\n\r]+/).map(s=>s.trim()).filter(s=>s.length>0&&!spinner.options.includes(s));
    if(incoming.length){
      const upd={options:[...spinner.options,...incoming]};
      if(spinner.colors) upd.colors=[...spinner.colors,...incoming.map((_,k)=>COLORS[(spinner.options.length+k)%COLORS.length])];
      onUpdate(upd);
    }
    setImportText(""); setShowImport(false);
  }

  // ── Colour helpers ──
  function applyPalette(paletteColors){
    // Expand palette to match options length (cycling)
    const cols=spinner.options.map((_,i)=>paletteColors[i%paletteColors.length]);
    onUpdate({colors:cols});
  }
  function updateColor(idx,color){
    // Expand base colors to at least options.length
    const base=spinner.colors ? [...spinner.colors] : spinner.options.map((_,i)=>COLORS[i%COLORS.length]);
    while(base.length<=idx) base.push(COLORS[base.length%COLORS.length]);
    base[idx]=color;
    onUpdate({colors:base});
  }
  function resetColors(){ onUpdate({colors:null}); }

  // ── Spin ──
  function spin(){
    if(spinning||spinner.options.length<2)return;
    cancelAnimationFrame(animRef.current); cancelAnimationFrame(glowRef.current);
    winIdxRef.current=-1;
    if(soundRef.current){try{getACtx().resume();}catch{}}
    setSpinning(true); setShowResult(false); setResult(null); lastSlotRef.current=-1;
    const opts=[...spinner.options];
    const spinColors=spinner.colors?[...spinner.colors]:COLORS;
    const slice=getSliceAngle(opts.length);
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
      const winner=opts[wIdx];
      setResult(winner); setResultColor(spinColors[wIdx%spinColors.length]); setTimeout(()=>setShowResult(true),80);
      setConfTrigger(k=>k+1); if(soundRef.current)playWin();
      winIdxRef.current=wIdx;
      const gs=performance.now(); const GDUR=2400;
      function gloop(ts){ const el=ts-gs; const pulse=el<GDUR?(Math.sin(el/290*Math.PI*2)+1)/2:0.65; if(canvasRef.current)drawWheel(canvasRef.current,opts,rotRef.current,wIdx,pulse,spinColors); if(el<GDUR+60){glowRef.current=requestAnimationFrame(gloop);}else{winIdxRef.current=-1;if(canvasRef.current)drawWheel(canvasRef.current,spinnerRef.current.options,rotRef.current,-1,0,spinnerRef.current.colors||COLORS);} }
      glowRef.current=requestAnimationFrame(gloop);
      const cur=spinnerRef.current, newHist=[{result:winner,timestamp:Date.now()},...(cur.history||[])].slice(0,25);
      const upd={history:newHist};
      if(cur.removeWinner&&opts.length>1){ upd.options=opts.filter((_,i)=>i!==wIdx); if(cur.colors)upd.colors=cur.colors.filter((_,i)=>i!==wIdx); }
      onUpdate(upd);
    }
    animRef.current=requestAnimationFrame(frame);
  }

  const {options,history,removeWinner}=spinner;
  const tabBtn=(id)=>({ onClick:()=>setTab(id), style:{ flex:1,padding:"7px",border:"none",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.15s", background:tab===id?`${theme.accent}99`:"transparent", color:tab===id?"#fff":"rgba(255,255,255,0.4)" } });

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 40px",gap:16,overflowY:"auto"}}>
      <ConfettiCanvas trigger={confTrigger} colors={theme.confetti}/>

      {/* Wheel */}
      <div style={{position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",right:-12,top:"50%",transform:"translateY(-50%)",zIndex:10,width:0,height:0,borderTop:"13px solid transparent",borderBottom:"13px solid transparent",borderRight:"26px solid #fff",filter:"drop-shadow(0 0 7px rgba(255,255,255,0.7))"}}/>
        <canvas ref={canvasRef} width={280} height={280} style={{borderRadius:"50%",boxShadow:"0 0 50px rgba(0,0,0,0.45),0 16px 50px rgba(0,0,0,0.5)",display:"block"}}/>
      </div>

      <button className="spin-btn" onClick={spin} disabled={spinning||options.length<2}>{spinning?"Spinning…":"SPIN!"}</button>
      {options.length<2&&!spinning&&<p style={{color:"rgba(255,255,255,0.35)",fontSize:11,margin:0}}>Add at least 2 options to spin</p>}

      {showResult&&result&&(
        <div onClick={()=>setShowResult(false)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:16}}>
          <div className="winner-modal" onClick={e=>e.stopPropagation()} style={{background:`radial-gradient(ellipse at top, ${resultColor}2a 0%, rgba(8,8,22,0.98) 65%)`,border:`2px solid ${resultColor}66`,borderRadius:28,padding:"44px 52px",textAlign:"center",maxWidth:460,width:"100%",boxShadow:`0 0 100px ${resultColor}33, 0 40px 80px rgba(0,0,0,0.7)`,cursor:"default",position:"relative"}}>
            {/* Close button */}
            <button onClick={()=>setShowResult(false)} style={{position:"absolute",top:14,right:16,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            {/* Trophy */}
            <div style={{fontSize:52,marginBottom:6,lineHeight:1}}>🏆</div>
            <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:14,fontWeight:600}}>Winner</div>
            {/* Winner name — big gradient text using the slice colour */}
            <div style={{fontSize:"clamp(30px,8vw,54px)",fontWeight:900,lineHeight:1.1,marginBottom:28,wordBreak:"break-word",background:`linear-gradient(135deg,#fff 0%,${resultColor} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {result}
            </div>
            {removeWinner&&<p style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginBottom:24,marginTop:-12}}>Removed from the wheel</p>}
            {/* Action buttons */}
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>setShowResult(false)} style={{background:`linear-gradient(135deg,${resultColor},${resultColor}bb)`,border:"none",color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:700,padding:"12px 30px",borderRadius:100,cursor:"pointer",boxShadow:`0 6px 24px ${resultColor}55`,transition:"transform 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                Continue →
              </button>
              <button onClick={()=>{setShowResult(false);setTimeout(spin,120);}} disabled={spinner.options.length<2} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:700,padding:"12px 30px",borderRadius:100,cursor:"pointer",transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
                🔄 Spin Again
              </button>
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.22)",marginTop:20,marginBottom:0}}>Click anywhere outside to close</p>
          </div>
        </div>
      )}

      {/* Tabs — Options / Colours / History */}
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{display:"flex",gap:3,marginBottom:12,background:"rgba(255,255,255,0.05)",borderRadius:10,padding:3}}>
          <button {...tabBtn("options")}>Options ({options.length})</button>
          <button {...tabBtn("colours")}>🎨 Colours</button>
          <button {...tabBtn("history")}>History ({history.length})</button>
        </div>

        {/* ── OPTIONS TAB ── */}
        {tab==="options"&&(
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            <div onClick={()=>onUpdate({removeWinner:!removeWinner})} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",userSelect:"none"}}>
              <div style={{width:34,height:19,borderRadius:100,background:removeWinner?theme.toggle:"rgba(255,255,255,0.12)",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:removeWinner?18:3,width:13,height:13,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
              </div>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>Remove winner after spin</span>
            </div>
            <div style={{display:"flex",gap:7}}>
              <input className="opt-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOption()} placeholder="Type an option…" maxLength={40}/>
              <button className="add-btn" onClick={addOption}>Add</button>
            </div>
            <button onClick={()=>setShowImport(p=>!p)} style={{display:"flex",alignItems:"center",gap:6,background:showImport?theme.soft:"rgba(255,255,255,0.06)",border:`1px solid ${showImport?theme.border:"rgba(255,255,255,0.1)"}`,color:theme.muted,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
              <span style={{fontSize:14}}>{showImport?"✕":"📋"}</span>{showImport?"Close import":"Import a list"}
            </button>
            {showImport&&(
              <div style={{display:"flex",flexDirection:"column",gap:8,padding:"12px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:`1px solid ${theme.border}`}}>
                <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.4)"}}>Paste items separated by commas or new lines</p>
                <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"pizza, tacos, sushi\nor one per line"} rows={4} style={{background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"9px 12px",color:"#fff",fontFamily:"inherit",fontSize:13,outline:"none",resize:"vertical",width:"100%"}}/>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={importList} disabled={!importText.trim()} style={{flex:1,background:importText.trim()?theme.soft:"rgba(255,255,255,0.05)",border:`1px solid ${theme.border}`,color:importText.trim()?theme.muted:"rgba(255,255,255,0.3)",borderRadius:100,padding:"8px",cursor:importText.trim()?"pointer":"default",fontFamily:"inherit",fontSize:12,fontWeight:700}}>✓ Add all items</button>
                  <button onClick={()=>{setImportText("");setShowImport(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",borderRadius:100,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Cancel</button>
                </div>
              </div>
            )}
            {options.length>0&&<p style={{margin:"2px 0 0",fontSize:11,color:"rgba(255,255,255,0.3)"}}>⠿ Drag rows to reorder</p>}
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:260,overflowY:"auto"}}>
              {options.map((opt,i)=>(
                <div key={i} draggable onDragStart={e=>onDragStart(i,e)} onDragOver={e=>onDragOver(i,e)} onDrop={e=>onDrop(i,e)} onDragEnd={onDragEnd}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px 7px 5px",background:dragOver===i?theme.soft:"rgba(255,255,255,0.05)",borderRadius:9,border:`1px solid ${dragOver===i?theme.border:"rgba(255,255,255,0.07)"}`,opacity:draggingIdx===i?0.3:1,cursor:"grab",transition:"background 0.1s,border-color 0.1s,opacity 0.1s"}}>
                  <span style={{color:"rgba(255,255,255,0.3)",fontSize:14,cursor:"grab",lineHeight:1,userSelect:"none",flexShrink:0}}>⠿</span>
                  <span style={{width:10,height:10,borderRadius:"50%",background:activeColors[i%activeColors.length],flexShrink:0}}/>
                  {editIdx===i?(
                    <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={()=>commitEdit(i)} onKeyDown={e=>{if(e.key==="Enter")commitEdit(i);if(e.key==="Escape")setEditIdx(null);}} style={{flex:1,background:"rgba(255,255,255,0.1)",border:`1px solid ${theme.border}`,borderRadius:5,color:"#fff",fontFamily:"inherit",fontSize:12,padding:"2px 7px",outline:"none"}}/>
                  ):(
                    <span style={{flex:1,fontSize:12,color:"rgba(255,255,255,0.85)"}}>{opt}</span>
                  )}
                  <button onClick={()=>{setEditIdx(i);setEditVal(opt);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:12,padding:"2px 3px"}}>✏️</button>
                  <button onClick={()=>removeOption(i)} style={{background:"none",border:"none",color:"rgba(255,107,107,0.5)",cursor:"pointer",fontSize:15,padding:"2px 3px",lineHeight:1}}>×</button>
                </div>
              ))}
              {options.length===0&&<p style={{color:"rgba(255,255,255,0.25)",fontSize:12,textAlign:"center",padding:"18px 0",margin:0}}>No options yet!</p>}
            </div>
            {options.length>0&&<button onClick={()=>onUpdate({options:[],colors:null})} style={{background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",color:"#ff6b6b",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>Clear all options</button>}
          </div>
        )}

        {/* ── COLOURS TAB ── */}
        {tab==="colours"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Palette grid */}
            <div>
              <p style={{margin:"0 0 8px",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.45)",letterSpacing:1,textTransform:"uppercase"}}>Colour Palettes</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {PALETTES.map(p=>{
                  const isActive=spinner.colors&&spinner.colors.length>0&&p.colors.some((c,i)=>spinner.colors[i%spinner.colors.length]===c);
                  return(
                    <button key={p.id} onClick={()=>applyPalette(p.colors)}
                      style={{background:isActive?theme.soft:"rgba(255,255,255,0.05)",border:`1px solid ${isActive?theme.border:"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"8px 10px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                      {/* Colour strip */}
                      <div style={{display:"flex",borderRadius:5,overflow:"hidden",marginBottom:6,height:14}}>
                        {p.colors.slice(0,8).map((c,i)=>(<div key={i} style={{flex:1,background:c}}/>))}
                      </div>
                      <span style={{fontSize:11,fontWeight:600,color:isActive?theme.muted:"rgba(255,255,255,0.65)"}}>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Per-slice colour pickers */}
            {options.length>0&&(
              <div>
                <p style={{margin:"0 0 8px",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.45)",letterSpacing:1,textTransform:"uppercase"}}>Individual Slice Colours</p>
                <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.35)"}}>Click a colour circle to change that slice</p>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:240,overflowY:"auto"}}>
                  {options.map((opt,i)=>{
                    const col=activeColors[i%activeColors.length];
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.07)"}}>
                        {/* Colour swatch — clicking opens native picker */}
                        <label title="Click to change colour" style={{position:"relative",width:28,height:28,flexShrink:0,cursor:"pointer"}}>
                          <div style={{position:"absolute",inset:0,borderRadius:"50%",background:col,border:"2.5px solid rgba(255,255,255,0.35)",boxShadow:`0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px ${col}88`,transition:"transform 0.15s",pointerEvents:"none"}}/>
                          <input type="color" value={col} onChange={e=>updateColor(i,e.target.value)}
                            style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%",border:"none",padding:0}}/>
                        </label>
                        <span style={{flex:1,fontSize:12,color:"rgba(255,255,255,0.82)"}}>{opt}</span>
                        <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"monospace"}}>{col.toUpperCase()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reset */}
            {spinner.colors&&(
              <button onClick={resetColors} style={{background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",color:"#ff6b6b",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>↺ Reset to default colours</button>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:360,overflowY:"auto"}}>
            {history.length===0?(
              <p style={{color:"rgba(255,255,255,0.25)",fontSize:12,textAlign:"center",padding:"24px 0",margin:0}}>No spins yet!</p>
            ):(
              <>
                {history.map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",background:"rgba(255,255,255,0.05)",borderRadius:9,border:"1px solid rgba(255,255,255,0.07)"}}>
                    <span style={{fontSize:12,fontWeight:800,color:theme.muted,minWidth:26,textAlign:"center"}}>#{history.length-i}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:600}}>{item.result}</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap"}}>{timeAgo(item.timestamp)}</span>
                  </div>
                ))}
                <button onClick={()=>onUpdate({history:[]})} style={{background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",color:"#ff6b6b",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,marginTop:3}}>Clear history</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [spinners,setSpinners]=useState(()=>{
    try{ const r=localStorage.getItem("wheel-v3"); if(r){const d=JSON.parse(r);if(Array.isArray(d)&&d.length>0)return d.map(s=>({history:[],removeWinner:false,colors:null,...s}));} }catch{}
    return[defaultSpinner("My First Spinner")];
  });
  const [activeId,setActiveId]=useState(spinners[0]?.id);
  const [collapsed,setCollapsed]=useState(false);
  const [themeId,setThemeId]=useState(()=>{try{return localStorage.getItem("wheel-theme")||"cosmic";}catch{return"cosmic";}});
  const [soundOn,setSoundOn]=useState(()=>{try{return localStorage.getItem("wheel-sound")!=="false";}catch{return true;}});
  const soundRef=useRef(soundOn);
  useEffect(()=>{soundRef.current=soundOn;},[soundOn]);
  useEffect(()=>{try{localStorage.setItem("wheel-v3",JSON.stringify(spinners));}catch{}},[spinners]);
  useEffect(()=>{try{localStorage.setItem("wheel-theme",themeId);}catch{}},[themeId]);
  useEffect(()=>{try{localStorage.setItem("wheel-sound",String(soundOn));}catch{}},[soundOn]);

  function updateSpinner(id,updates){setSpinners(p=>p.map(s=>s.id===id?{...s,...updates}:s));}
  function addSpinner(){const s=defaultSpinner(`Spinner ${spinners.length+1}`);setSpinners(p=>[...p,s]);setActiveId(s.id);}
  function deleteSpinner(id){if(spinners.length===1)return;const r=spinners.filter(s=>s.id!==id);setSpinners(r);if(activeId===id)setActiveId(r[0].id);}

  const theme=THEMES.find(t=>t.id===themeId)||THEMES[0];
  const active=spinners.find(s=>s.id===activeId)||spinners[0];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:theme.bg,fontFamily:"'Segoe UI',sans-serif",color:"#fff"}}>
      <style>{`
        *{box-sizing:border-box;}
        .spin-btn{background:${theme.spinBtn};border:none;color:#fff;font-family:inherit;font-size:17px;font-weight:800;padding:14px 44px;border-radius:100px;cursor:pointer;letter-spacing:1px;transition:transform 0.15s,box-shadow 0.15s,opacity 0.2s;box-shadow:0 8px 28px ${theme.spinShadow};}
        .spin-btn:hover:not(:disabled){transform:translateY(-2px) scale(1.04);}
        .spin-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .add-btn{background:${theme.addBtn};border:none;color:${theme.addText};font-family:inherit;font-size:13px;font-weight:700;padding:10px 18px;border-radius:100px;cursor:pointer;transition:transform 0.15s;white-space:nowrap;}
        .add-btn:hover{transform:translateY(-1px);}
        .opt-input{background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);border-radius:100px;padding:10px 18px;color:#fff;font-family:inherit;font-size:13px;outline:none;transition:border-color 0.2s;width:100%;}
        .opt-input::placeholder{color:rgba(255,255,255,0.35);}
        .opt-input:focus{border-color:${theme.border};}
        .result-pop{animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        .winner-modal{animation:modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.75) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .sb-item:hover{background:rgba(255,255,255,0.05) !important;}
        .sb-item:hover .sb-btns{opacity:1 !important;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px;}
        textarea{color-scheme:dark;}
      `}</style>

      <Sidebar spinners={spinners} activeId={active.id} onSelect={setActiveId} onAdd={addSpinner} onDelete={deleteSpinner} onRename={(id,name)=>updateSpinner(id,{name})} collapsed={collapsed} onToggle={()=>setCollapsed(p=>!p)} theme={theme}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{position:"relative",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",flexShrink:0,minHeight:46}}>
          <div style={{display:"flex",alignItems:"center",zIndex:1}}>
            {collapsed&&<button onClick={()=>setCollapsed(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:17,padding:"2px 4px"}}>☰</button>}
          </div>
          <h1 style={{position:"absolute",left:0,right:0,margin:0,textAlign:"center",fontSize:"clamp(13px,2.5vw,18px)",fontWeight:800,background:theme.titleGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",pointerEvents:"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",padding:"0 120px"}}>{active.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto",zIndex:1}}>
            <button onClick={()=>setSoundOn(p=>!p)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"#fff",borderRadius:7,padding:"4px 8px",cursor:"pointer",fontSize:14,lineHeight:1}}>{soundOn?"🔊":"🔇"}</button>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {THEMES.map(t=>(<button key={t.id} onClick={()=>setThemeId(t.id)} title={t.name} style={{width:18,height:18,borderRadius:"50%",background:t.swatch,border:themeId===t.id?"2px solid #fff":"2px solid rgba(255,255,255,0.2)",cursor:"pointer",padding:0,transition:"transform 0.15s",transform:themeId===t.id?"scale(1.3)":"scale(1)"}}/>))}
            </div>
          </div>
        </div>
        <SpinnerView key={active.id} spinner={active} onUpdate={u=>updateSpinner(active.id,u)} theme={theme} soundRef={soundRef}/>
      </div>
    </div>
  );
}