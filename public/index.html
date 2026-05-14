<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>MCM — My Community Manager</title>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#05050a;color:#fff;font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:4px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
input,textarea,select,button{font-family:'DM Sans',sans-serif;color:#fff}
input,textarea,select{background:#0d0d1f;border:1px solid #2a2a3a;border-radius:8px;padding:10px 12px;width:100%;outline:none;font-size:13px;color:#fff}
input::placeholder,textarea::placeholder{color:#555}
textarea{resize:none}
select{appearance:none;cursor:pointer}
select option{background:#0d0d1f;color:#fff}
.lbl{font-size:10px;color:#aaa;letter-spacing:1.5px;text-transform:uppercase;display:block;margin-bottom:5px}
.card{background:#0d0d1f;border:1px solid #1e1e30;border-radius:12px;padding:14px}
.del-btn{opacity:0;transition:opacity 0.2s}
.mwrap:hover .del-btn{opacity:1!important}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useRef } = React;
const G = "linear-gradient(135deg,#7c3aed,#ec4899)";

const NETWORKS = [
  {id:"instagram",label:"Instagram",icon:"📸",color:"#E1306C"},
  {id:"linkedin", label:"LinkedIn", icon:"💼",color:"#0A66C2"},
  {id:"twitter",  label:"X/Twitter",icon:"🐦",color:"#1DA1F2"},
  {id:"facebook", label:"Facebook", icon:"👥",color:"#1877F2"},
  {id:"tiktok",   label:"TikTok",   icon:"🎵",color:"#69C9D0"},
];

const INDUSTRIES = [
  "Restaurante / Gastronomía","Moda / Indumentaria","Salud y bienestar",
  "Tecnología","Inmobiliaria","Educación","Turismo","Retail / Tienda",
  "Servicios profesionales","Construcción","Automotriz","Entretenimiento",
  "Fitness / Deporte","Belleza / Estética","Fotografía","Arquitectura",
  "Veterinaria","Música / DJ","Abogacía","Contabilidad",
];

// ─── IMAGE GENERATION ───────────────────────────────────────────
function wrapText(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach(w => {
    const test = line + (line ? " " : "") + w;
    if (ctx.measureText(test).width > maxW) { if (line) lines.push(line); line = w; }
    else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

function drawBackground(ctx, color, style) {
  if (style === 1) {
    // Minimalista: dark gradient + glow
    const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
    bg.addColorStop(0, "#0d0520"); bg.addColorStop(1, "#05050a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1080);
    const g1 = ctx.createRadialGradient(1080, 0, 0, 1080, 0, 700);
    g1.addColorStop(0, color + "55"); g1.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(1080, 0, 700, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.fill();
    const g2 = ctx.createRadialGradient(0, 1080, 0, 0, 1080, 500);
    g2.addColorStop(0, "#7c3aed33"); g2.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(0, 1080, 500, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.fill();
  } else if (style === 2) {
    // Bold: dark + grid + color splash
    ctx.fillStyle = "#060609"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x <= 1080; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke(); }
    for (let y = 0; y <= 1080; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
    const g = ctx.createRadialGradient(540, 540, 0, 540, 540, 520);
    g.addColorStop(0, color + "40"); g.addColorStop(0.5, color + "18"); g.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(540, 540, 520, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    // Top/bottom accent bars
    const bar = ctx.createLinearGradient(0, 0, 1080, 0);
    bar.addColorStop(0, color); bar.addColorStop(1, "#7c3aed");
    ctx.fillStyle = bar; ctx.fillRect(0, 0, 1080, 8); ctx.fillRect(0, 1072, 1080, 8);
  } else {
    // Editorial: dark + side panel + color band
    const bg = ctx.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, "#0a0a14"); bg.addColorStop(1, "#05050a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "rgba(255,255,255,0.015)"; ctx.fillRect(560, 0, 520, 1080);
    const band = ctx.createLinearGradient(0, 0, 0, 1080);
    band.addColorStop(0, color); band.addColorStop(1, "#7c3aed");
    ctx.fillStyle = band; ctx.fillRect(0, 0, 10, 1080);
    const g = ctx.createRadialGradient(280, 540, 0, 280, 540, 380);
    g.addColorStop(0, color + "22"); g.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(280, 540, 380, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  }
}

function renderDesign(ctx, style, quote, bizName, netColor, textColor, fontSize, textPos) {
  const tc = textColor || '#fff';
  const fs = fontSize || 42;
  const tp = textPos || 'bottom';
  if (style === 1) {
    // Minimalista: text at bottom, thin accent line
    const gr = ctx.createLinearGradient(0, 660, 0, 1080);
    gr.addColorStop(0, "rgba(0,0,0,0)");
    gr.addColorStop(0.4, "rgba(0,0,0,0.75)");
    gr.addColorStop(1, "rgba(0,0,0,0.96)");
    ctx.fillStyle = gr; ctx.fillRect(0, 660, 1080, 420);
    // Accent line
    ctx.fillStyle = netColor; ctx.fillRect(60, 710, 4, 60);
    // Biz name
    if (bizName) {
      ctx.font = "500 19px 'DM Sans',sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(bizName.toUpperCase(), 76, 742);
    }
    // Quote with custom settings
    ctx.font = `${fs >= 52 ? 800 : 700} ${fs}px 'DM Sans',sans-serif`;
    ctx.fillStyle = tc;
    const lines = wrapText(ctx, quote, 920);
    const shown = lines.slice(0, 4);
    const lh = fs + 12;
    const totalH1 = shown.length * lh;
    let startY;
    if (tp === 'top') startY = 120;
    else if (tp === 'center') startY = (1080 - totalH1) / 2;
    else startY = bizName ? 795 : 770;
    shown.forEach((l, i) => ctx.fillText(l, 76, startY + i * lh));
    // Branding
    ctx.font = "400 16px 'DM Sans',sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillText("MCM · My Community Manager", 60, 1062);

  } else if (style === 2) {
    // Bold: overlay + centered text
    ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.textAlign = "center";
    ctx.font = `800 ${fs}px 'DM Sans',sans-serif`;
    ctx.fillStyle = tc;
    const lines = wrapText(ctx, quote, 920);
    const shown = lines.slice(0, 5);
    const lh2 = fs + 12;
    const totalH = shown.length * lh2;
    let startY2;
    if (tp === 'top') startY2 = 120;
    else if (tp === 'bottom') startY2 = 1080 - totalH - 80;
    else startY2 = (1080 - totalH) / 2 + 20;
    shown.forEach((l, i) => ctx.fillText(l, 540, startY2 + i * lh2));
    if (bizName) {
      ctx.font = "500 21px 'DM Sans',sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(bizName, 540, 1052);
    }
    ctx.textAlign = "left";

  } else {
    // Editorial: right column text
    ctx.fillStyle = "rgba(0,0,0,0.52)"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "rgba(0,0,0,0.78)"; ctx.fillRect(565, 0, 515, 1080);
    ctx.font = "700 13px 'DM Sans',sans-serif";
    ctx.fillStyle = netColor;
    ctx.fillText("● MCM", 610, 78);
    if (bizName) {
      ctx.font = "500 18px 'DM Sans',sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(bizName.toUpperCase(), 610, 110);
    }
    ctx.font = `700 ${fs}px 'DM Sans',sans-serif`;
    ctx.fillStyle = tc;
    const lines = wrapText(ctx, quote, 440);
    const shown = lines.slice(0, 6);
    const lh3 = fs + 12;
    const totalH3 = shown.length * lh3;
    let startY3;
    if (tp === 'top') startY3 = 120;
    else if (tp === 'bottom') startY3 = 1080 - totalH3 - 60;
    else startY3 = (1080 - totalH3) / 2;
    shown.forEach((l, i) => ctx.fillText(l, 610, startY3 + i * lh3));
    // Accent line bottom
    const lg = ctx.createLinearGradient(610, 0, 900, 0);
    lg.addColorStop(0, netColor); lg.addColorStop(1, "#7c3aed");
    ctx.fillStyle = lg; ctx.fillRect(610, 1048, 300, 3);
  }
}

function makePostImages(postText, netColor, bizName, imgPreview, imagePhrase, customQuote, customColor, customSize, customPos) {
  // Use AI-generated short phrase, or custom override, or fallback
  const quote = customQuote || imagePhrase || (() => {
    const clean = postText.replace(/\*\*/g,"").replace(/#\S+/g,"").replace(/#+\s*/g,"").replace(/---/g,"").trim();
    const first = clean.split("\n").filter(l=>l.trim().length>3)[0] || "";
    return first.length > 60 ? first.slice(0,57)+"..." : first;
  })();
  const textColor = customColor || "#ffffff";
  const fontSize = customSize || 42;
  const textPos = customPos || "bottom";

  const makeOne = (style) => new Promise(resolve => {
    const cv = document.createElement("canvas");
    cv.width = 1080; cv.height = 1080;
    const ctx = cv.getContext("2d");

    const finish = () => {
      renderDesign(ctx, style, quote, bizName, netColor);
      resolve(cv.toDataURL("image/png"));
    };

    if (imgPreview) {
      const img = new Image();
      img.onload = () => {
        const sc = Math.max(1080 / img.width, 1080 / img.height);
        ctx.drawImage(img, (1080 - img.width * sc) / 2, (1080 - img.height * sc) / 2, img.width * sc, img.height * sc);
        finish();
      };
      img.src = imgPreview;
    } else {
      drawBackground(ctx, netColor, style);
      finish();
    }
  });

  return Promise.all([makeOne(1), makeOne(2), makeOne(3)])
    .then(([d1, d2, d3]) => ({ d1, d2, d3 }));
}

// ─── INDUSTRY PICKER ───────────────────────────────────────────
function IndustryPicker({ value, onChange }) {
  const isCustom = value && !INDUSTRIES.includes(value);
  const [showInput, setShowInput] = useState(isCustom);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <select
        value={showInput ? "__custom__" : (value || "")}
        onChange={e => {
          if (e.target.value === "__custom__") { setShowInput(true); onChange(""); }
          else { setShowInput(false); onChange(e.target.value); }
        }}>
        <option value="">¿Cuál es tu rubro?</option>
        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        <option value="__custom__">✏️ Mi rubro no está en la lista</option>
      </select>
      {showInput && (
        <input value={value || ""} onChange={e => onChange(e.target.value)}
          placeholder="Escribí tu rubro (ej: Veterinaria, DJ, Arquitectura...)"
          style={{ border: "1px solid #7c3aed60" }} autoFocus />
      )}
      {value && <div style={{ fontSize: 11, color: "#a78bfa" }}>✓ Posts para: <strong>{value}</strong></div>}
    </div>
  );
}

// ─── EDITOR MODAL ───────────────────────────────────────────────
function EditorModal({ postText, netColor, bizName, selImgs, imagePhrase, onClose }) {
  const [style, setStyle] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(42);
  const [textPos, setTextPos] = useState("bottom");
  const defaultText = imagePhrase || (() => {
    const clean = postText.replace(/\*\*/g,"").replace(/#\S+/g,"").replace(/---/g,"").trim();
    const first = clean.split("\n").filter(l=>l.trim().length>3)[0] || "";
    return first.length > 60 ? first.slice(0,57)+"..." : first;
  })();
  const [customText, setCustomText] = useState(defaultText);

  const imgPreview = selImgs.filter(s => !s.isVideo)[imgIdx]?.preview || null;

  const regenerate = async () => {
    setGenerating(true);
    const imgs = await makePostImages(postText, netColor, bizName, imgPreview, imagePhrase, customText, textColor, fontSize, textPos);
    setPreview(imgs[`d${style}`]);
    setGenerating(false);
  };

  React.useEffect(() => { regenerate(); }, [style, imgIdx, customText, textColor, fontSize, textPos]);

  const download = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `MCM_post_${["","minimalista","bold","editorial"][style]}.png`;
    a.click();
  };

  const styleNames = ["", "Minimalista", "Bold", "Editorial"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(16px)" }}>
      <div style={{ background: "#0d0d1f", border: "1px solid #1e1e30", borderRadius: 18, padding: 22, width: "100%", maxWidth: 860, maxHeight: "92vh", overflowY: "auto", display: "flex", gap: 20, flexWrap: "wrap" }}>

        {/* Preview */}
        <div style={{ flex: "0 0 320px" }}>
          <span className="lbl">Preview — {styleNames[style]}</span>
          <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "1", background: "#05050a", position: "relative" }}>
            {generating ? (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexDirection: "column" }}>
                <div style={{ width: 28, height: 28, border: "3px solid #1e1e30", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <div style={{ fontSize: 11, color: "#555" }}>Generando...</div>
              </div>
            ) : preview ? (
              <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" />
            ) : null}
          </div>
          <div style={{ fontSize: 9, color: "#444", textAlign: "center", marginTop: 6 }}>1080×1080px</div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Editor de diseño</div>
            <button onClick={onClose} style={{ background: "#1e1e30", border: "none", color: "#aaa", width: 28, height: 28, borderRadius: 7, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>

          {/* Style */}
          <div>
            <span className="lbl">Plantilla</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => setStyle(s)}
                  style={{ flex: 1, background: style === s ? "#7c3aed20" : "#0a0a14", border: `1px solid ${style === s ? "#7c3aed" : "#1e1e30"}`, borderRadius: 8, padding: "8px", color: style === s ? "#c4b5fd" : "#888", cursor: "pointer", fontSize: 12, fontWeight: style === s ? 700 : 400 }}>
                  {styleNames[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Custom text */}
          <div>
            <span className="lbl">Texto de la imagen</span>
            <textarea value={customText}
              onChange={e => setCustomText(e.target.value)}
              rows={4}
              style={{ width: "100%", background: "#05050a", border: "1px solid #1e1e30", borderRadius: 8, padding: "9px 11px", color: "#fff", fontSize: 12, outline: "none", resize: "none" }}
              placeholder="Escribí el texto que querés que aparezca en la imagen..."
            />
            <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>Editá el texto para que se vea en la imagen</div>
          </div>

          {/* Text position */}
          <div>
            <span className="lbl">Posición del texto</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[["top", "⬆ Arriba"], ["center", "↔ Centro"], ["bottom", "⬇ Abajo"]].map(([pos, label]) => (
                <button key={pos} onClick={() => setTextPos(pos)}
                  style={{ flex: 1, background: textPos === pos ? "#7c3aed20" : "#0a0a14", border: `1px solid ${textPos === pos ? "#7c3aed" : "#1e1e30"}`, borderRadius: 8, padding: "8px 4px", color: textPos === pos ? "#c4b5fd" : "#888", cursor: "pointer", fontSize: 11, fontWeight: textPos === pos ? 700 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Text color */}
          <div>
            <span className="lbl">Color del texto</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {["#ffffff", "#000000", "#f59e0b", "#34d399", "#7c3aed", "#ec4899", "#06b6d4"].map(col => (
                <div key={col} onClick={() => setTextColor(col)}
                  style={{ width: 26, height: 26, borderRadius: "50%", background: col, cursor: "pointer", border: `3px solid ${textColor === col ? "#fff" : "transparent"}`, transition: "border 0.15s" }} />
              ))}
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #1e1e30", background: "transparent", cursor: "pointer", padding: 2 }} />
            </div>
          </div>

          {/* Font size */}
          <div>
            <span className="lbl">Tamaño de letra: {fontSize}px</span>
            <input type="range" min="24" max="72" value={fontSize}
              onChange={e => setFontSize(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#7c3aed" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", marginTop: 2 }}><span>Pequeño</span><span>Grande</span></div>
          </div>

          {/* Background image */}
          {selImgs.filter(s => !s.isVideo).length > 0 && (
            <div>
              <span className="lbl">Imagen de fondo</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <div onClick={() => setImgIdx(-1)}
                  style={{ width: 44, height: 44, borderRadius: 7, border: `2px solid ${imgIdx === -1 ? "#7c3aed" : "#1e1e30"}`, background: "#05050a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>
                  🎨
                </div>
                {selImgs.filter(s => !s.isVideo).map((item, i) => (
                  <div key={item.id} onClick={() => setImgIdx(i)}
                    style={{ width: 44, height: 44, borderRadius: 7, border: `2px solid ${imgIdx === i ? "#7c3aed" : "transparent"}`, overflow: "hidden", cursor: "pointer" }}>
                    <img src={item.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={download} style={{ background: G, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontWeight: 800, cursor: "pointer", fontSize: 13, marginTop: "auto" }}>
            ⬇ Descargar imagen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState("landing");
  const [tab, setTab] = useState("generator");

  const [brand, setBrand] = useState(() => { try { return JSON.parse(localStorage.getItem("mcm_brand") || "{}"); } catch { return {}; } });
  const saveBrand = b => { setBrand(b); try { localStorage.setItem("mcm_brand", JSON.stringify(b)); } catch {} };
  const upd = (f, v) => saveBrand({ ...brand, [f]: v });

  const [gallery, setGallery] = useState([]);
  const [selected, setSelected] = useState([]);
  const addFiles = files => {
    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith("image/"), isVid = file.type.startsWith("video/");
      if (!isImg && !isVid) return;
      const reader = new FileReader();
      reader.onload = e => setGallery(prev => [{ id: Date.now() + Math.random(), name: file.name, preview: isImg ? e.target.result : null, base64: isImg ? e.target.result.split(",")[1] : null, mediaType: file.type, isVideo: isVid, date: new Date().toLocaleDateString("es-AR") }, ...prev]);
      if (isImg) reader.readAsDataURL(file); else reader.readAsArrayBuffer(file);
    });
  };
  const removeItem = id => { setGallery(p => p.filter(g => g.id !== id)); setSelected(p => p.filter(s => s !== id)); };
  const toggleSel = id => setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const selItems = gallery.filter(g => selected.includes(g.id));

  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState({});
  const [activeNet, setActiveNet] = useState("instagram");
  const [copied, setCopied] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [genImg, setGenImg] = useState(false);
  const [postImgs, setPostImgs] = useState({});
  const [selDesign, setSelDesign] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const fileRef = useRef();
  const galRef = useRef();
  const [showScheduler, setShowScheduler] = useState(false);
  const [bufferToken, setBufferToken] = useState(() => { try { return localStorage.getItem("mcm_buffer_token") || ""; } catch { return ""; } });
  const [bufferProfiles, setBufferProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState([]);

  const saveBufferToken = (token) => {
    setBufferToken(token);
    try { localStorage.setItem("mcm_buffer_token", token); } catch {}
  };

  const loadProfiles = async (token) => {
    if (!token) return;
    setLoadingProfiles(true);
    try {
      const r = await fetch("/api/buffer?action=channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json();
      if (data.channels) setBufferProfiles(data.channels);
      else alert("Error: " + (data.error || "No se pudieron cargar los canales"));
    } catch (e) { alert("Error de conexión: " + e.message); }
    setLoadingProfiles(false);
  };

  const publishToBuffer = async () => {
    if (!bufferToken) return;
    setPublishing(true);
    setPublishResults([]);
    const pubResults = [];

    for (const net of NETWORKS) {
      const netSchedule = schedule[net.id];
      if (!netSchedule?.profileId) continue;
      const postText = results[net.id];
      if (!postText) continue;

      // Note: Buffer API requires image as public URL, not base64
      // We send text only for now — image can be added manually in Buffer
      const scheduledAt = netSchedule.datetime
        ? new Date(netSchedule.datetime).toISOString()
        : null;

      try {
        const r = await fetch("/api/buffer?action=schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: bufferToken,
            channelId: netSchedule.profileId,
            text: postText,
            scheduledAt,
          }),
        });
        const data = await r.json();
        pubResults.push({ net: net.label, success: data.success, error: data.error });
      } catch (e) {
        pubResults.push({ net: net.label, success: false, error: e.message });
      }
    }

    setPublishResults(pubResults);
    setPublishing(false);
  };

  const generate = async () => {
    if (!topic.trim() && selItems.length === 0) return;
    setGenerating(true); setResults({}); setPostImgs({});

    const bCtx = [
      brand.name && `EMPRESA: "${brand.name}"`,
      brand.industry && `RUBRO: "${brand.industry}" — usá el lenguaje, tendencias y necesidades de este sector en Argentina`,
      brand.target && `CLIENTE IDEAL: "${brand.target}"`,
      brand.description && `PROPUESTA DE VALOR: "${brand.description}"`,
      brand.tone && `TONO: "${brand.tone}"`,
    ].filter(Boolean).join("\n");

    const mediaList = selItems.map((s, i) => s.isVideo ? `Video ${i + 1}: ${s.name}` : `Imagen ${i + 1}: ${s.name}`).join(", ");

    const prompt = `Sos un copywriter senior con 10 años en agencias top de Argentina. Sabés exactamente qué genera engagement y cómo escribir copy que convierte.

BRIEF:
${bCtx || "Cliente sin perfil definido"}
${topic ? `OBJETIVO: "${topic}"` : ""}
${selItems.length > 0 ? `MATERIAL VISUAL: ${mediaList}\n${selItems.some(s => !s.isVideo) ? "Analizá cada imagen en detalle: producto, ambiente, emoción, diferencial. Usá esos detalles específicos." : ""}` : ""}

INSTRUCCIONES:
- GANCHO irresistible en la primera línea de cada post
- Lenguaje argentino natural (vos, che, etc.)
- Específico para esta marca, nunca genérico
- Adaptado al algoritmo de cada red

FORMATO EXACTO (sin texto antes ni después):

===INSTAGRAM===
[Gancho. Cuerpo con párrafos cortos. CTA. Hashtags al final.]

===LINKEDIN===
[Dato impactante al inicio. Historia. Reflexión. CTA con pregunta. Máx 5 hashtags.]

===TWITTER===
[Máximo 280 caracteres. Directo y con gancho fuerte.]

===FACEBOOK===
[Situación identificable. Historia. Propuesta. CTA para comentar.]

===TIKTOK===
[Hook viral. Script con acciones. CTA. Caption con hashtags.]

===FRASES===
INSTAGRAM: [frase corta e impactante para la imagen, máx 8 palabras, sin hashtags]
LINKEDIN: [frase corta e impactante para la imagen, máx 8 palabras, sin hashtags]
TWITTER: [frase corta e impactante para la imagen, máx 8 palabras, sin hashtags]
FACEBOOK: [frase corta e impactante para la imagen, máx 8 palabras, sin hashtags]
TIKTOK: [frase corta e impactante para la imagen, máx 8 palabras, sin hashtags]`;

    try {
      const firstImg = selItems.find(s => !s.isVideo && s.base64);
      const body = { prompt };
      if (firstImg) { body.imageBase64 = firstImg.base64; body.imageMediaType = firstImg.mediaType; }

      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();

      if (data.error) { setResults({ _err: data.error }); }
      else {
        const text = data.text || "";
        const parsed = {};
        const keys = ["INSTAGRAM", "LINKEDIN", "TWITTER", "FACEBOOK", "TIKTOK"];
        const ids = ["instagram", "linkedin", "twitter", "facebook", "tiktok"];
        keys.forEach((k, i) => {
          const s = text.indexOf(`===${k}===`); if (s === -1) return;
          const nextKey = keys[i + 1] ? text.indexOf(`===${keys[i + 1]}===`) : text.indexOf("===FRASES===");
          const n = nextKey > -1 ? nextKey : text.length;
          parsed[ids[i]] = text.slice(s + k.length + 6, n).trim();
        });

        // Parse image phrases
        const phrases = {};
        const frasesStart = text.indexOf("===FRASES===");
        if (frasesStart > -1) {
          const frasesBlock = text.slice(frasesStart + 12);
          ids.forEach((id, i) => {
            const key = keys[i] + ":";
            const lineStart = frasesBlock.indexOf(key);
            if (lineStart > -1) {
              const lineEnd = frasesBlock.indexOf("\n", lineStart);
              phrases[id] = frasesBlock.slice(lineStart + key.length, lineEnd > -1 ? lineEnd : undefined).trim();
            }
          });
        }

        setResults(parsed); setPostCount(p => p + 5);

        // Generate images using short phrases
        setGenImg(true);
        const imgs = {};
        const fp = selItems.find(s => !s.isVideo)?.preview || null;
        for (const net of NETWORKS) {
          if (parsed[net.id]) {
            const imgPhrase = phrases[net.id] || "";
            imgs[net.id] = await makePostImages(parsed[net.id], net.color, brand.name || "", fp, imgPhrase);
          }
        }
        setPostImgs(imgs); setGenImg(false);
      }
    } catch (e) { setResults({ _err: "Error: " + e.message }); }
    finally { setGenerating(false); }
  };

  const dlText = id => {
    const n = NETWORKS.find(x => x.id === id);
    const b = new Blob([results[id]], { type: "text/plain" });
    const u = URL.createObjectURL(b); const a = document.createElement("a");
    a.href = u; a.download = `MCM_${n.label}.txt`; a.click(); URL.revokeObjectURL(u);
  };

  const dlImg = id => {
    const d = selDesign[id] || "d1";
    const n = NETWORKS.find(x => x.id === id);
    const a = document.createElement("a");
    a.href = postImgs[id][d]; a.download = `MCM_${n.label}.png`; a.click();
  };

  const canGen = !generating && (!!topic.trim() || selItems.length > 0);
  const activeNetwork = NETWORKS.find(n => n.id === activeNet);

  // ── LANDING ──────────────────────────────────────────────────
  if (view === "landing") return (
    <div style={{ minHeight: "100vh", background: "#05050a" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 36px", borderBottom: "1px solid #0d0d1f", position: "sticky", top: 0, background: "rgba(5,5,10,0.92)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: G, borderRadius: 8, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>M</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>MCM</div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>MY COMMUNITY MANAGER</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ color: "#888", fontSize: 14, cursor: "pointer" }} onClick={() => setView("pricing")} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#888"}>Precios</span>
          <span style={{ color: "#888", fontSize: 14, cursor: "pointer" }} onClick={() => setView("app")} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#888"}>Demo</span>
        </div>
        <button onClick={() => setView("app")} style={{ background: G, color: "#fff", border: "none", borderRadius: 10, padding: "9px 22px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Empezar gratis →</button>
      </nav>

      <div style={{ textAlign: "center", padding: "80px 20px 60px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 18 }}>
          {["🧑🏻", "👩🏽", "👨🏾", "👩🏻", "🧑🏽"].map((e, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${260 + i * 18},55%,38%)`, border: "2px solid #05050a", display: "grid", placeItems: "center", fontSize: 15, marginLeft: i === 0 ? 0 : -9 }}>{e}</div>
          ))}
          <span style={{ fontSize: 13, color: "#777", marginLeft: 10 }}>+2.400 marcas ya lo usan</span>
        </div>
        <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", color: "#fff" }}>
          Tu community manager.<br />
          <span style={{ background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Con IA. Sin costo de agencia.</span>
        </h1>
        <p style={{ color: "#888", fontSize: 16, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Subís tus fotos y videos, MCM genera posts listos para publicar en todas las redes sociales.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <button onClick={() => setView("app")} style={{ background: G, color: "#fff", border: "none", borderRadius: 11, padding: "12px 30px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Empezar gratis →</button>
          <button onClick={() => setView("pricing")} style={{ background: "transparent", color: "#fff", border: "1px solid #2a2a3a", borderRadius: 11, padding: "12px 26px", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Ver planes</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {NETWORKS.map(n => (
            <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid #0d0d1f", borderRadius: 50, padding: "6px 14px", fontSize: 13, color: "#ccc" }}>
              <span>{n.icon}</span>{n.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "50px 36px 80px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, textAlign: "center", marginBottom: 10, color: "#fff" }}>Cómo funciona</h2>
        <p style={{ textAlign: "center", color: "#777", marginBottom: 40, fontSize: 15 }}>De tus archivos a posts publicables en 30 segundos.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 2 }}>
          {[["📁", "Subís tu contenido", "Fotos y videos de tu negocio"], ["🤖", "MCM lo analiza", "Entiende tu marca y tu rubro"], ["✍️", "Genera 5 posts", "Uno optimizado por cada red"], ["🖼️", "3 diseños de imagen", "Elegís el que más te gusta"], ["⬇️", "Descargás", "Texto e imagen listos para publicar"]].map(([ic, ti, de], i) => (
            <div key={i} style={{ padding: "24px 18px", borderTop: `2px solid ${i === 0 ? "#7c3aed" : "#1e1e30"}` }}>
              <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>0{i + 1}</div>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{ic}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5, color: "#fff" }}>{ti}</div>
              <div style={{ color: "#777", fontSize: 13, lineHeight: 1.6 }}>{de}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "50px 20px 70px", borderTop: "1px solid #0d0d1f" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, marginBottom: 10, color: "#fff" }}>Tu CM trabaja 24/7.</h2>
        <p style={{ color: "#777", fontSize: 15, marginBottom: 28 }}>7 días gratis · Sin tarjeta · Cancelás cuando quieras</p>
        <button onClick={() => setView("app")} style={{ background: G, color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Empezar gratis →</button>
      </div>
    </div>
  );

  // ── PRICING ──────────────────────────────────────────────────
  if (view === "pricing") return (
    <div style={{ minHeight: "100vh", background: "#05050a" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 36px", borderBottom: "1px solid #0d0d1f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }} onClick={() => setView("landing")}>
          <div style={{ width: 28, height: 28, background: G, borderRadius: 7, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>MCM</span>
        </div>
        <button onClick={() => setView("app")} style={{ background: "transparent", color: "#a78bfa", border: "1px solid #7c3aed40", borderRadius: 9, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Ver demo →</button>
      </nav>
      <div style={{ textAlign: "center", padding: "56px 20px 40px" }}>
        <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, marginBottom: 10, color: "#fff" }}>Planes simples.</h1>
        <p style={{ color: "#888", fontSize: 15 }}>Sin contratos. Cancelás cuando quieras.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, maxWidth: 900, margin: "0 auto", padding: "0 20px 70px" }}>
        {[
          { name: "Starter", price: 29, color: "#34d399", features: ["30 posts/mes", "Análisis de imágenes", "5 redes", "3 diseños de imagen", "Descarga texto + imagen"] },
          { name: "Pro", price: 59, color: "#7c3aed", pop: true, features: ["100 posts/mes", "Imágenes + videos", "Editor de diseño", "Perfil de marca", "Soporte prioritario"] },
          { name: "Agency", price: 149, color: "#ec4899", features: ["Posts ilimitados", "10 clientes", "White label", "API access", "Soporte 24/7"] },
        ].map(p => (
          <div key={p.name} className="card" style={{ border: `1.5px solid ${p.pop ? p.color + "50" : "#1e1e30"}`, position: "relative", padding: "28px 22px" }}>
            {p.pop && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: G, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 14px", borderRadius: 50, whiteSpace: "nowrap" }}>⭐ MÁS POPULAR</div>}
            <div style={{ color: p.color, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 7 }}>{p.name.toUpperCase()}</div>
            <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, marginBottom: 4, color: "#fff" }}>${p.price}</div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 18 }}>/mes USD</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, paddingTop: 14, borderTop: "1px solid #1e1e30" }}>
              {p.features.map((f, i) => <div key={i} style={{ display: "flex", gap: 8, color: "#ddd", fontSize: 13 }}><span style={{ color: p.color }}>✓</span>{f}</div>)}
            </div>
            <button onClick={() => setView("app")} style={{ width: "100%", background: p.pop ? G : "transparent", border: `1.5px solid ${p.color}`, color: p.pop ? "#fff" : p.color, borderRadius: 10, padding: "11px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>Empezar →</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── APP ──────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#05050a", overflow: "hidden" }}>

      {/* EDITOR MODAL */}
      {showEditor && results[activeNet] && (
        <EditorModal
          postText={results[activeNet]}
          netColor={activeNetwork.color}
          bizName={brand.name || ""}
          selImgs={selItems}
          imagePhrase={postImgs[activeNet] ? (postImgs[activeNet]._phrase || "") : ""}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* NAV */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", borderBottom: "1px solid #0d0d1f", background: "#07070e", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }} onClick={() => setView("landing")}>
          <div style={{ width: 24, height: 24, background: G, borderRadius: 6, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 11 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>MCM</span>
          <span style={{ fontSize: 9, color: "#444", letterSpacing: 1 }}>MY COMMUNITY MANAGER</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[["generator", "✦", "Generador"], ["gallery", "📁", "Mi contenido"], ["brand", "🎨", "Mi marca"], ["scheduler", "📅", "Programar"]].map(([id, ic, lb]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: tab === id ? "#0d0d1f" : "transparent", border: `1px solid ${tab === id ? "#1e1e30" : "transparent"}`, borderRadius: 7, padding: "5px 12px", color: tab === id ? "#fff" : "#555", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{ic}</span><span>{lb}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {postCount > 0 && <span style={{ fontSize: 10, color: "#444" }}>{postCount} posts</span>}
          <button onClick={() => setView("pricing")} style={{ background: G, color: "#fff", border: "none", borderRadius: 7, padding: "5px 14px", cursor: "pointer", fontWeight: 700, fontSize: 11 }}>Suscribirme →</button>
        </div>
      </div>

      {/* GENERATOR */}
      {tab === "generator" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* LEFT */}
          <div style={{ width: 275, borderRight: "1px solid #0d0d1f", padding: "12px", display: "flex", flexDirection: "column", gap: 11, overflowY: "auto", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Generador</div>
              <div style={{ fontSize: 11, color: "#888" }}>Seleccioná archivos y generá posts para 5 redes.</div>
            </div>

            {/* Rubro */}
            <div className="card">
              <span className="lbl">Rubro del negocio</span>
              <IndustryPicker value={brand.industry || ""} onChange={v => upd("industry", v)} />
            </div>

            {/* Files */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span className="lbl" style={{ margin: 0 }}>Archivos ({selItems.length})</span>
                {selItems.length > 0 && <button onClick={() => setSelected([])} style={{ fontSize: 10, color: "#f43f5e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Limpiar</button>}
              </div>
              {selItems.length > 0 ? (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                  {selItems.map(item => (
                    <div key={item.id} style={{ position: "relative", width: 50, height: 50 }}>
                      {item.isVideo
                        ? <div style={{ width: 50, height: 50, borderRadius: 7, background: "#0d0d1f", border: "2px solid #7c3aed", display: "grid", placeItems: "center", fontSize: 18 }}>🎬</div>
                        : <img src={item.preview} style={{ width: 50, height: 50, borderRadius: 7, objectFit: "cover", border: "2px solid #7c3aed" }} alt="" />
                      }
                      <button onClick={() => toggleSel(item.id)} style={{ position: "absolute", top: -4, right: -4, background: "#f43f5e", border: "none", color: "#fff", width: 14, height: 14, borderRadius: "50%", cursor: "pointer", fontSize: 8, lineHeight: "14px", padding: 0 }}>✕</button>
                    </div>
                  ))}
                  <div onClick={() => setTab("gallery")} style={{ width: 50, height: 50, borderRadius: 7, border: "2px dashed #2a2a3a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555", fontSize: 18 }}>+</div>
                </div>
              ) : (
                <div onClick={() => setTab("gallery")} style={{ border: "2px dashed #1e1e30", borderRadius: 9, padding: "12px", textAlign: "center", cursor: "pointer", marginBottom: 6 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed50"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e30"}>
                  <div style={{ fontSize: 22, marginBottom: 3 }}>📁</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>Seleccioná fotos o videos</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Si no subís fotos, MCM usa fondos de marketing</div>
                </div>
              )}
              <div onClick={() => fileRef.current.click()} style={{ border: "1px dashed #1e1e30", borderRadius: 7, padding: "6px", textAlign: "center", cursor: "pointer", fontSize: 11, color: "#888" }}>
                <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
                + Subir archivos nuevos
              </div>
            </div>

            {/* Brief */}
            <div>
              <span className="lbl">Brief del post</span>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
                placeholder="Ej: Lanzamiento nueva colección, promo fin de semana, apertura de local..." />
            </div>

            {/* Brand info */}
            {brand.name && (
              <div className="card">
                <span className="lbl" style={{ margin: "0 0 4px" }}>Perfil activo</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#a78bfa" }}>{brand.name}</div>
                {brand.target && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>→ {brand.target}</div>}
                <span onClick={() => setTab("brand")} style={{ color: "#555", fontSize: 10, cursor: "pointer", marginTop: 5, display: "block" }}>Editar →</span>
              </div>
            )}

            <button onClick={generate} disabled={!canGen} style={{ background: canGen ? G : "#0d0d1f", color: canGen ? "#fff" : "#444", border: "none", borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 800, cursor: canGen ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {generating
                ? <><div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Generando...</>
                : `✦ Generar${selItems.length > 0 ? ` (${selItems.length} arch.)` : ""}`}
            </button>

            {(generating || genImg) && (
              <div className="card">
                <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 4, animation: "pulse 1.2s ease infinite" }}>✦ Trabajando...</div>
                {[generating && "Analizando contenido", generating && "Investigando tu rubro", generating && "Escribiendo copy profesional", genImg && "Generando 3 diseños de imagen"].filter(Boolean).map((s, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#666", padding: "1px 0" }}>· {s}</div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 14px", gap: 8, overflow: "hidden" }}>

            {/* Network tabs */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
              {NETWORKS.map(n => (
                <button key={n.id} onClick={() => setActiveNet(n.id)} style={{ background: activeNet === n.id ? "#7c3aed18" : "#0d0d1f", border: `1px solid ${activeNet === n.id ? "#7c3aed" : "#1e1e30"}`, borderRadius: 7, padding: "6px 12px", color: activeNet === n.id ? "#c4b5fd" : "#888", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                  <span>{n.icon}</span><span style={{ color: activeNet === n.id ? "#c4b5fd" : "#ccc" }}>{n.label}</span>
                  {results[n.id] && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, display: "flex", gap: 10, overflow: "hidden" }}>

              {/* Text result */}
              <div style={{ flex: 1, background: "#07070e", border: `1px solid ${results[activeNet] ? "#7c3aed25" : "#0d0d1f"}`, borderRadius: 11, padding: "13px 15px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {results._err && <div style={{ color: "#f43f5e", fontSize: 13 }}>❌ {results._err}</div>}
                {!generating && !results[activeNet] && !results._err && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.1, fontWeight: 800 }}>MCM</div>
                    <div style={{ fontSize: 13, color: "#333" }}>Seleccioná archivos y generá posts para las 5 redes</div>
                  </div>
                )}
                {generating && !results[activeNet] && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <div style={{ width: 26, height: 26, border: "3px solid #1e1e30", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    <div style={{ color: "#555", fontSize: 12 }}>Generando para {activeNetwork?.label}...</div>
                  </div>
                )}
                {results[activeNet] && (
                  <div style={{ animation: "fadeIn 0.4s ease", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #0d0d1f", flexShrink: 0 }}>
                      <span style={{ fontSize: 14 }}>{activeNetwork?.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>{activeNetwork?.label}</span>
                      <span style={{ marginLeft: "auto", fontSize: 9, color: "#34d399", background: "#34d39910", padding: "2px 8px", borderRadius: 20, border: "1px solid #34d39920" }}>✓ Listo</span>
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.9, color: "#e5e5e5", flex: 1, overflowY: "auto" }}>{results[activeNet]}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 9, paddingTop: 8, borderTop: "1px solid #0d0d1f", flexShrink: 0 }}>
                      <button onClick={() => { navigator.clipboard.writeText(results[activeNet]); setCopied(activeNet); setTimeout(() => setCopied(false), 2000); }}
                        style={{ flex: 1, background: copied === activeNet ? "#0a1f0a" : G, color: "#fff", border: copied === activeNet ? "1px solid #34d399" : "none", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}>
                        {copied === activeNet ? "✓ Copiado" : "📋 Copiar texto"}
                      </button>
                      <button onClick={() => dlText(activeNet)} style={{ background: "#0d0d1f", color: "#aaa", border: "1px solid #1e1e30", borderRadius: 7, padding: "8px 10px", cursor: "pointer", fontSize: 11 }}>⬇ .txt</button>
                      <button onClick={generate} style={{ background: "#0d0d1f", color: "#666", border: "1px solid #0d0d1f", borderRadius: 7, padding: "8px 10px", cursor: "pointer", fontSize: 12 }}>🔁</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image panel — always visible when results exist */}
              {results[activeNet] && (
                <div style={{ width: 220, background: "#07070e", border: "1px solid #0d0d1f", borderRadius: 11, padding: "11px", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, overflowY: "auto" }}>
                  <span className="lbl" style={{ margin: 0 }}>Diseños de imagen</span>

                  {genImg && !postImgs[activeNet] ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 120 }}>
                      <div style={{ width: 22, height: 22, border: "2px solid #1e1e30", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      <div style={{ fontSize: 10, color: "#888", textAlign: "center" }}>Generando 3 diseños...</div>
                    </div>
                  ) : postImgs[activeNet] ? (
                    <>
                      {[{ key: "d1", label: "Minimalista" }, { key: "d2", label: "Bold" }, { key: "d3", label: "Editorial" }].map(({ key, label }) => {
                        const isSel = (selDesign[activeNet] || "d1") === key;
                        return (
                          <div key={key} onClick={() => setSelDesign(p => ({ ...p, [activeNet]: key }))}
                            style={{ cursor: "pointer", borderRadius: 8, border: `2px solid ${isSel ? "#7c3aed" : "#1e1e30"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                            <img src={postImgs[activeNet][key]} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} alt={label} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", background: isSel ? "#7c3aed18" : "#0a0a14" }}>
                              <span style={{ fontSize: 10, color: isSel ? "#c4b5fd" : "#888", fontWeight: isSel ? 700 : 400 }}>{label}</span>
                              {isSel && <span style={{ fontSize: 9, color: "#7c3aed" }}>✓</span>}
                            </div>
                          </div>
                        );
                      })}
                      <button onClick={() => setShowEditor(true)}
                        style={{ background: "#0d0d1f", color: "#c4b5fd", border: "1px solid #7c3aed50", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>
                        ✏️ Editar diseño
                      </button>
                      <button onClick={() => dlImg(activeNet)}
                        style={{ background: G, color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>
                        ⬇ Descargar imagen
                      </button>
                      <div style={{ fontSize: 9, color: "#444", textAlign: "center" }}>1080×1080px</div>
                    </>
                  ) : (
                    // Results exist but images not generated yet
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 11, color: "#888", textAlign: "center", padding: "8px 0" }}>Las imágenes se generan al terminar todos los posts...</div>
                      <button onClick={() => setShowEditor(true)}
                        style={{ background: "#0d0d1f", color: "#c4b5fd", border: "1px solid #7c3aed50", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>
                        ✏️ Editar diseño
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status bar */}
            {Object.keys(results).filter(k => k !== "_err").length > 0 && (
              <div style={{ background: "#07070e", border: "1px solid #0d0d1f", borderRadius: 7, padding: "6px 11px", display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#444", letterSpacing: 1 }}>REDES:</span>
                {NETWORKS.map(n => (
                  <span key={n.id} onClick={() => setActiveNet(n.id)} style={{ fontSize: 10, color: results[n.id] ? "#34d399" : "#2a2a3a", cursor: "pointer" }}>
                    {results[n.id] && postImgs[n.id] ? "🖼 " : results[n.id] ? "✓ " : ""}<span style={{ color: results[n.id] ? "#34d399" : "#444" }}>{n.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GALLERY */}
      {tab === "gallery" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Mi contenido</div>
              <div style={{ fontSize: 11, color: "#888" }}>{gallery.length} archivo{gallery.length !== 1 ? "s" : ""} · {selected.length} seleccionado{selected.length !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {selected.length > 0 && <button onClick={() => setTab("generator")} style={{ background: G, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Generar con {selected.length} →</button>}
              <button onClick={() => galRef.current.click()} style={{ background: "transparent", color: "#a78bfa", border: "1px solid #7c3aed40", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>+ Subir</button>
              <input ref={galRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
            </div>
          </div>
          <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} onClick={() => galRef.current.click()}
            style={{ border: "2px dashed #1e1e30", borderRadius: 11, padding: "20px", textAlign: "center", marginBottom: 14, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed40"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e30"}>
            <div style={{ fontSize: 26, marginBottom: 5 }}>📁</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 2 }}>Arrastrá tus fotos y videos acá</div>
            <div style={{ fontSize: 11, color: "#666" }}>JPG, PNG, WEBP, MP4, MOV</div>
          </div>
          {selected.length > 0 && (
            <div style={{ background: "#7c3aed10", border: "1px solid #7c3aed25", borderRadius: 8, padding: "7px 11px", marginBottom: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 700 }}>✓ {selected.length} seleccionado{selected.length > 1 ? "s" : ""}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setSelected(gallery.map(g => g.id))} style={{ background: "transparent", color: "#a78bfa", border: "1px solid #7c3aed30", borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>Todos</button>
                <button onClick={() => setSelected([])} style={{ background: "transparent", color: "#666", border: "1px solid #1e1e30", borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>Ninguno</button>
              </div>
            </div>
          )}
          {gallery.length === 0 ? (
            <div style={{ textAlign: "center", padding: "44px 20px" }}>
              <div style={{ fontSize: 38, marginBottom: 8, opacity: 0.15 }}>📁</div>
              <div style={{ fontSize: 14, color: "#444", marginBottom: 4 }}>Tu carpeta está vacía</div>
              <div style={{ fontSize: 12, color: "#2a2a3a" }}>Subí las fotos y videos de tu empresa.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
              {gallery.map(item => {
                const isSel = selected.includes(item.id);
                return (
                  <div key={item.id} className="mwrap" style={{ position: "relative", borderRadius: 9, overflow: "hidden", border: `2px solid ${isSel ? "#7c3aed" : "transparent"}`, cursor: "pointer", aspectRatio: "1", background: "#0d0d1f", transition: "border-color 0.2s" }} onClick={() => toggleSel(item.id)}>
                    {item.isVideo
                      ? <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}><div style={{ fontSize: 26 }}>🎬</div><div style={{ fontSize: 8, color: "#666", textAlign: "center", padding: "0 5px" }}>{item.name.slice(0, 14)}</div></div>
                      : <img src={item.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                    }
                    {isSel && <div style={{ position: "absolute", inset: 0, background: "#7c3aed18", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 5 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800 }}>✓</div>
                    </div>}
                    <button className="del-btn" onClick={e => { e.stopPropagation(); removeItem(item.id); }} style={{ position: "absolute", top: 5, left: 5, background: "rgba(0,0,0,0.8)", border: "none", color: "#fff", width: 16, height: 16, borderRadius: "50%", cursor: "pointer", fontSize: 8, lineHeight: "16px", opacity: 0 }}>✕</button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.6))", padding: "4px", fontSize: 8, color: "#aaa" }}>{item.date}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULER */}
      {tab === "scheduler" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Programar publicaciones</div>
              <div style={{ fontSize: 12, color: "#888" }}>Conectá tu cuenta de Buffer y programá tus posts en todas las redes.</div>
            </div>

            {/* Buffer connection */}
            <div className="card" style={{ marginBottom: 16 }}>
              <span className="lbl">Conectar Buffer</span>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.6 }}>
                1. Creá cuenta gratis en <span style={{ color: "#a78bfa" }}>buffer.com</span><br/>
                2. Andá a buffer.com/developers → "Create App" → copiá el Access Token<br/>
                3. Pegalo acá abajo
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={bufferToken}
                  onChange={e => saveBufferToken(e.target.value)}
                  placeholder="Pegá tu Buffer Access Token acá..."
                  type="password"
                  style={{ flex: 1 }}
                />
                <button onClick={() => loadProfiles(bufferToken)}
                  disabled={!bufferToken || loadingProfiles}
                  style={{ background: bufferToken ? G : "#0d0d1f", color: bufferToken ? "#fff" : "#444", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: bufferToken ? "pointer" : "not-allowed", fontSize: 12, whiteSpace: "nowrap" }}>
                  {loadingProfiles ? "Cargando..." : "Conectar"}
                </button>
              </div>
              {bufferProfiles.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10, color: "#34d399", marginBottom: 6 }}>✓ {bufferProfiles.length} canal{bufferProfiles.length !== 1 ? "es" : ""} conectado{bufferProfiles.length !== 1 ? "s" : ""}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {bufferProfiles.map(p => (
                      <div key={p.id} style={{ background: "#0a0a14", border: "1px solid #1e1e30", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#ccc", display: "flex", alignItems: "center", gap: 5 }}>
                        <span>{p.icon}</span>{p.service} — {p.name}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 8, lineHeight: 1.5 }}>
                    ⚠️ La API de Buffer en beta solo soporta texto. Las imágenes las podés agregar manualmente en Buffer después de programar.
                  </div>
                </div>
              )}
            </div>

            {/* Schedule per network */}
            {Object.keys(results).filter(k => k !== "_err").length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="lbl">Programar por red</span>
                {NETWORKS.filter(n => results[n.id]).map(net => (
                  <div key={net.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{net.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{net.label}</span>
                      <span style={{ fontSize: 11, color: "#34d399", marginLeft: "auto" }}>✓ Post listo</span>
                    </div>

                    {/* Channel selector */}
                    {bufferProfiles.length > 0 ? (
                      <div>
                        <span className="lbl" style={{ margin: "0 0 4px" }}>Canal de destino</span>
                        <select
                          value={schedule[net.id]?.profileId || ""}
                          onChange={e => setSchedule(p => ({ ...p, [net.id]: { ...p[net.id], profileId: e.target.value } }))}>
                          <option value="">Seleccioná un canal...</option>
                          {bufferProfiles.map(p => (
                            <option key={p.id} value={p.id}>{p.icon} {p.service} — {p.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: "#555" }}>Conectá Buffer arriba para ver tus canales</div>
                    )}

                    {/* Date/time picker */}
                    <div>
                      <span className="lbl" style={{ margin: "0 0 4px" }}>Fecha y hora de publicación</span>
                      <input
                        type="datetime-local"
                        value={schedule[net.id]?.datetime || ""}
                        onChange={e => setSchedule(p => ({ ...p, [net.id]: { ...p[net.id], datetime: e.target.value } }))}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>Si no elegís fecha, se agrega a la cola de Buffer</div>
                    </div>

                    {/* Preview text */}
                    <div style={{ background: "#0a0a14", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#888", maxHeight: 60, overflow: "hidden", position: "relative" }}>
                      {(results[net.id] || "").slice(0, 150)}...
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 20, background: "linear-gradient(transparent, #0a0a14)" }} />
                    </div>
                  </div>
                ))}

                {/* Publish button */}
                <button onClick={publishToBuffer}
                  disabled={publishing || !bufferToken || !Object.values(schedule).some(s => s?.profileId)}
                  style={{ background: publishing || !bufferToken ? "#0d0d1f" : G, color: publishing || !bufferToken ? "#444" : "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
                  {publishing
                    ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Publicando...</>
                    : "📅 Programar publicaciones"}
                </button>

                {/* Results */}
                {publishResults.length > 0 && (
                  <div className="card">
                    <span className="lbl">Resultado</span>
                    {publishResults.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
                        <span>{r.success ? "✅" : "❌"}</span>
                        <span style={{ color: r.success ? "#34d399" : "#f43f5e" }}>{r.net}</span>
                        {r.error && <span style={{ color: "#666", fontSize: 11 }}>— {r.error}</span>}
                        {r.success && <span style={{ color: "#666", fontSize: 11 }}>— Programado en Buffer</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 38, marginBottom: 10, opacity: 0.15 }}>📅</div>
                <div style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>Primero generá los posts</div>
                <div style={{ fontSize: 12, color: "#2a2a3a" }}>Andá al Generador, creá tus posts y volvé acá para programarlos.</div>
                <button onClick={() => setTab("generator")} style={{ background: G, color: "#fff", border: "none", borderRadius: 9, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 13, marginTop: 16 }}>
                  Ir al generador →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BRAND */}
      {tab === "brand" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Perfil de mi marca</div>
              <div style={{ fontSize: 12, color: "#888" }}>La IA usa este perfil para personalizar todos los posts.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span className="lbl">Nombre de la empresa</span>
                <input value={brand.name || ""} onChange={e => upd("name", e.target.value)} placeholder="Ej: La Josefa Granja Orgánica" />
              </div>
              <div>
                <span className="lbl">Rubro / Industria</span>
                <IndustryPicker value={brand.industry || ""} onChange={v => upd("industry", v)} />
              </div>
              <div>
                <span className="lbl">Propuesta de valor</span>
                <textarea value={brand.description || ""} onChange={e => upd("description", e.target.value)} rows={3} placeholder="Qué hacés, qué te diferencia de la competencia..." />
              </div>
              <div>
                <span className="lbl">Cliente ideal</span>
                <input value={brand.target || ""} onChange={e => upd("target", e.target.value)} placeholder="Ej: Familias de 30-50 años que valoran la alimentación saludable" />
              </div>
              <div>
                <span className="lbl">Tono de comunicación</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["auténtico", "premium", "divertido", "inspirador", "urgente", "educativo"].map(t => (
                    <button key={t} onClick={() => upd("tone", t)} style={{ background: (brand.tone || "auténtico") === t ? "#7c3aed20" : "#0d0d1f", border: `1px solid ${(brand.tone || "auténtico") === t ? "#7c3aed" : "#1e1e30"}`, borderRadius: 7, padding: "6px 12px", color: (brand.tone || "auténtico") === t ? "#c4b5fd" : "#aaa", cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card" style={{ borderColor: "#7c3aed20" }}>
                <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, marginBottom: 3 }}>✦ Guardado automáticamente</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>MCM usa este perfil en cada generación para que los posts suenen como tu marca.</div>
              </div>
              {brand.name && <button onClick={() => setTab("generator")} style={{ background: G, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>Ir al generador →</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
</body>
</html>
