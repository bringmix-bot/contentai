import { useState } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────
// Reemplazá estos con tus Price IDs reales de Stripe Dashboard
const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/test_STARTER_PRICE_ID",
  pro:     "https://buy.stripe.com/test_PRO_PRICE_ID",
  agency:  "https://buy.stripe.com/test_AGENCY_PRICE_ID",
};

const PLANS = [
  {
    id: "starter", name: "Starter", price: 19, posts: 30, color: "#a3e635",
    features: ["30 posts/mes", "5 redes sociales", "Tono personalizado", "Soporte por email"],
  },
  {
    id: "pro", name: "Pro", price: 49, posts: 100, color: "#f59e0b", popular: true,
    features: ["100 posts/mes", "Todas las redes", "IA avanzada", "Calendario editorial", "Soporte prioritario"],
  },
  {
    id: "agency", name: "Agency", price: 129, posts: 999, color: "#818cf8",
    features: ["Posts ilimitados", "10 marcas/clientes", "API access", "White label", "Soporte 24/7"],
  },
];

const NETWORKS = [
  { id: "instagram", label: "Instagram", icon: "📸", tone: "visual, emocional y con hashtags relevantes" },
  { id: "linkedin",  label: "LinkedIn",  icon: "💼", tone: "profesional, con datos y orientado a negocios" },
  { id: "twitter",   label: "X / Twitter", icon: "🐦", tone: "conciso, directo y con gancho fuerte" },
  { id: "facebook",  label: "Facebook",  icon: "👥", tone: "conversacional y que invite a la interacción" },
  { id: "tiktok",    label: "TikTok",    icon: "🎵", tone: "entretenido, informal y con llamada a la acción" },
];

const INDUSTRIES = [
  "Restaurante / Gastronomía","Moda / Indumentaria","Salud y bienestar",
  "Tecnología","Inmobiliaria","Educación","Turismo","Retail / Tienda",
  "Servicios profesionales","Otro",
];

const LAUNCH_STEPS = [
  {
    week: "Semana 1", color: "#a3e635", icon: "🛠️", title: "Setup técnico",
    tasks: [
      { done: false, text: "Creá cuenta en Vercel (gratis) → vercel.com" },
      { done: false, text: "Registrá dominio en NIC.ar o Namecheap (~$10/año)" },
      { done: false, text: "Creá cuenta en Stripe → stripe.com" },
      { done: false, text: "En Stripe: creá 3 productos con precios recurrentes ($19, $49, $129)" },
      { done: false, text: "Copiá los Price IDs de Stripe en el código (STRIPE_LINKS)" },
      { done: false, text: "Deployá la app en Vercel y conectá tu dominio" },
    ],
  },
  {
    week: "Semana 2", color: "#f59e0b", icon: "👥", title: "Primeros 10 clientes",
    tasks: [
      { done: false, text: "Listá 20 negocios locales que conozcas (restaurantes, tiendas, etc.)" },
      { done: false, text: "Ofreceles 30 días gratis a cambio de feedback honesto" },
      { done: false, text: "Mostrales la app en persona o por WhatsApp Video" },
      { done: false, text: "Pediles que generen su primer post en vivo con vos" },
      { done: false, text: "Armá un grupo de WhatsApp con tus primeros usuarios" },
    ],
  },
  {
    week: "Semana 3-4", color: "#818cf8", icon: "📣", title: "Tracción orgánica",
    tasks: [
      { done: false, text: "Publicá casos de éxito en LinkedIn (con permiso del cliente)" },
      { done: false, text: "Creá TikTok/Reels mostrando cómo funciona la app en 60 seg" },
      { done: false, text: "Posteá en grupos de Facebook de emprendedores AR" },
      { done: false, text: "Lanzá en Product Hunt Latam y foros de startups" },
      { done: false, text: "Ofrecé programa de referidos: 1 mes gratis por cada cliente traído" },
    ],
  },
  {
    week: "Mes 2-3", color: "#f43f5e", icon: "📈", title: "Escala con ads",
    tasks: [
      { done: false, text: "Convertí los primeros 10 clientes gratis en pagos ($19/mes mínimo)" },
      { done: false, text: "Invertí $100 en Meta Ads apuntando a dueños de pymes en AR" },
      { done: false, text: "Creá audiencia lookalike de tus mejores clientes" },
      { done: false, text: "Activá email marketing con Brevo (gratis hasta 300/día)" },
      { done: false, text: "Objetivo: 50 clientes pagos = $1.000-2.500/mes" },
    ],
  },
  {
    week: "Mes 4-6", color: "#06b6d4", icon: "🚀", title: "Camino a $10K",
    tasks: [
      { done: false, text: "Contratá un VA part-time para soporte ($300-500/mes)" },
      { done: false, text: "Lanzá plan Agency para agencias de marketing" },
      { done: false, text: "Agregá integraciones: Buffer, Hootsuite, Google Drive" },
      { done: false, text: "Escalá ads a $500-1000/mes con ROAS positivo comprobado" },
      { done: false, text: "Meta: 200+ clientes = $10.000/mes USD ✦" },
    ],
  },
];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  input::placeholder, textarea::placeholder { color: #2e2e2e; }
  textarea { resize: none; }
  select { appearance: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080808; }
  ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 4px; }
`;

// ─── PRICING CARD ──────────────────────────────────────────────────────────
function PricingCard({ plan, onCheckout, isActive }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: isActive ? `${plan.color}10` : "#0f0f0f",
        border: `1.5px solid ${isActive || hover ? plan.color : "#1e1e1e"}`,
        borderRadius: 20, padding: "32px 26px", position: "relative",
        transform: isActive ? "translateY(-6px)" : hover ? "translateY(-3px)" : "none",
        boxShadow: isActive ? `0 20px 60px ${plan.color}20` : "none",
        transition: "all 0.3s ease",
      }}
    >
      {plan.popular && (
        <div style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          background: plan.color, color: "#000", fontSize: 11, fontWeight: 800,
          padding: "4px 16px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap",
        }}>⭐ MÁS POPULAR</div>
      )}
      <div style={{ color: plan.color, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>{plan.name.toUpperCase()}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "'Playfair Display',serif" }}>${plan.price}</span>
        <span style={{ color: "#555", fontSize: 14, marginBottom: 7 }}>/mes USD</span>
      </div>
      <div style={{ color: "#333", fontSize: 12, marginBottom: 20 }}>≈ ${(plan.price * 1000).toLocaleString()} ARS/mes*</div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 18, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, color: "#bbb", fontSize: 14 }}>
            <span style={{ color: plan.color, flexShrink: 0 }}>✦</span> {f}
          </div>
        ))}
      </div>
      <button onClick={() => onCheckout(plan)} style={{
        width: "100%", background: isActive ? plan.color : "transparent",
        border: `1.5px solid ${plan.color}`, color: isActive ? "#000" : plan.color,
        borderRadius: 12, padding: "13px", fontWeight: 800, cursor: "pointer",
        fontSize: 14, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif",
      }}>
        {isActive ? "✓ Tu plan actual" : "Suscribirme ahora →"}
      </button>
    </div>
  );
}

// ─── CHECKOUT MODAL ────────────────────────────────────────────────────────
function CheckoutModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState("method");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const simulatePay = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2400);
  };

  const inputStyle = {
    width: "100%", background: "#0a0a0a", border: "1px solid #1e1e1e",
    borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14,
    outline: "none", fontFamily: "'DM Sans',sans-serif",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000d0", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{
        background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 24,
        padding: 36, width: "100%", maxWidth: 430, position: "relative",
        animation: "fadeUp 0.3s ease forwards",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#1a1a1a", border: "none", color: "#555", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 14 }}>✕</button>

        {step === "method" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#444", letterSpacing: 2, marginBottom: 6 }}>SUSCRIPCIÓN</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>Plan {plan.name}</div>
              <div style={{ color: plan.color, fontSize: 18, fontWeight: 700 }}>${plan.price}/mes USD</div>
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Elegí tu método de pago:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "💳", title: "Stripe (Internacional)", sub: "Visa, Mastercard, Amex · Recomendado", action: simulatePay },
                { icon: "🌎", title: "Tarjeta local (Argentina)", sub: "Débito / crédito · Hasta 12 cuotas", action: () => setStep("card") },
                { icon: "🏦", title: "Transferencia / USDT", sub: "CVU o cripto · Contactar por WhatsApp", action: simulatePay },
              ].map(opt => (
                <button key={opt.title} onClick={opt.action} style={{
                  background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 13, padding: "15px 18px",
                  color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 13,
                  textAlign: "left", transition: "border-color 0.2s", fontFamily: "'DM Sans',sans-serif",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = plan.color + "60"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.title}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{opt.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 18, textAlign: "center", color: "#2a2a2a", fontSize: 12 }}>🔒 Pago seguro · Sin cargos ocultos · Cancelá cuando quieras</div>
          </>
        )}

        {step === "card" && (
          <>
            <button onClick={() => setStep("method")} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, padding: "0 0 16px", display: "block", fontFamily: "inherit" }}>← Volver</button>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Datos de pago</div>
              <div style={{ color: plan.color, fontSize: 15 }}>Plan {plan.name} · ${plan.price}/mes</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={inputStyle} />
              <input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="Nombre en la tarjeta" style={inputStyle} />
              <input value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ") })} placeholder="1234 5678 9012 3456" style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                <input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/AA" style={inputStyle} />
                <input value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.slice(0,4) })} placeholder="CVC" style={inputStyle} />
              </div>
              <button onClick={simulatePay} style={{ background: plan.color, color: "#000", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 15, marginTop: 4, fontFamily: "inherit" }}>
                Pagar ${plan.price}/mes →
              </button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 48, height: 48, border: "3px solid #141414", borderTopColor: plan.color, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Procesando pago...</div>
            <div style={{ color: "#444", fontSize: 13 }}>No cerrés esta ventana</div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 58, marginBottom: 14 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Suscripción activada!</div>
            <div style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Bienvenido al plan <span style={{ color: plan.color, fontWeight: 700 }}>{plan.name}</span>.<br />Te llega un mail de confirmación.
            </div>
            <button onClick={() => { onSuccess(plan); onClose(); }} style={{
              background: plan.color, color: "#000", border: "none", borderRadius: 12,
              padding: "14px 32px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "inherit",
            }}>Empezar a generar posts →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
export default function ContentAI() {
  const [view, setView]               = useState("landing");
  const [activePlan, setActivePlan]   = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [tab, setTab]                 = useState("generator");
  const [network, setNetwork]         = useState(NETWORKS[0]);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry]       = useState("");
  const [topic, setTopic]             = useState("");
  const [tone, setTone]               = useState("profesional");
  const [generating, setGenerating]   = useState(false);
  const [result, setResult]           = useState("");
  const [postsUsed, setPostsUsed]     = useState(0);
  const [copied, setCopied]           = useState(false);
  const [launchTasks, setLaunchTasks] = useState(
    LAUNCH_STEPS.map(s => ({ ...s, tasks: s.tasks.map(t => ({ ...t })) }))
  );

  const plan = activePlan || PLANS[1];
  const postsLeft = plan.posts === 999 ? "∞" : Math.max(0, plan.posts - postsUsed);
  const totalTasks = launchTasks.reduce((a, s) => a + s.tasks.length, 0);
  const doneTasks  = launchTasks.reduce((a, s) => a + s.tasks.filter(t => t.done).length, 0);
  const progress   = Math.round((doneTasks / totalTasks) * 100);

  const generateContent = async () => {
    if (!topic.trim()) return;
    setGenerating(true); setResult("");
    const prompt = `Sos un experto en marketing digital y redes sociales latinoamericanas.
Generá UN post de alto impacto para ${network.label} para "${businessName || "mi negocio"}" del rubro "${industry || "servicios"}".
Tema: "${topic}" · Tono: ${tone} y ${network.tone}

Formato:
📝 POST:
[contenido listo para copiar, emojis si aplica]

🏷️ HASHTAGS:
[5-8 hashtags relevantes]

💡 TIP DE ALCANCE:
[consejo rápido y concreto]

Respondé directo.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setResult(data.content?.map(b => b.text || "").join("") || "Error al generar.");
      setPostsUsed(p => p + 1);
    } catch { setResult("❌ Error de conexión."); }
    setGenerating(false);
  };

  const toggleTask = (si, ti) => setLaunchTasks(prev =>
    prev.map((s, i) => i !== si ? s : { ...s, tasks: s.tasks.map((t, j) => j !== ti ? t : { ...t, done: !t.done }) })
  );

  // ────────────────────────── LANDING ──────────────────────────────────────
  if (view === "landing") return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "8%", left: "3%", width: 500, height: 500, background: "#a3e63506", borderRadius: "50%", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "3%", width: 350, height: 350, background: "#f59e0b05", borderRadius: "50%", filter: "blur(70px)" }} />
      </div>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderBottom: "1px solid #111", position: "sticky", top: 0, background: "#080808ee", backdropFilter: "blur(16px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "#a3e635", borderRadius: 8, display: "grid", placeItems: "center", fontSize: 13 }}>✦</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 800 }}>ContentAI</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[["Funciones",""],["Precios","pricing"],["Demo","app"]].map(([l,v]) => (
            <span key={l} onClick={() => v && setView(v)} style={{ color: "#555", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#a3e635"} onMouseLeave={e => e.target.style.color="#555"}>{l}</span>
          ))}
        </div>
        <button onClick={() => setView("pricing")} style={{ background: "#a3e635", color: "#000", border: "none", borderRadius: 11, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 14, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.target.style.opacity="0.85"} onMouseLeave={e => e.target.style.opacity="1"}>
          Empezar gratis →
        </button>
      </nav>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "110px 20px 90px", animation: "fadeUp 0.7s ease" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#a3e63510", border: "1px solid #a3e63330", color: "#a3e635", fontSize: 11, fontWeight: 700, padding: "6px 18px", borderRadius: 20, marginBottom: 36, letterSpacing: 1.5 }}>
          ✦ POWERED BY CLAUDE AI
        </div>
        <h1 style={{ fontSize: "clamp(44px,9vw,92px)", fontFamily: "'Playfair Display',serif", fontWeight: 800, lineHeight: 1.02, margin: "0 0 26px", background: "linear-gradient(135deg,#ffffff 0%,#a3e635 45%,#f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Nunca más te<br />quedés sin qué publicar.
        </h1>
        <p style={{ color: "#555", fontSize: 20, maxWidth: 510, margin: "0 auto 52px", lineHeight: 1.65 }}>
          ContentAI genera posts perfectos para cada red social en segundos. Sin experiencia. En español rioplatense.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setView("app")} style={{ background: "#a3e635", color: "#000", border: "none", borderRadius: 13, padding: "17px 40px", fontWeight: 800, cursor: "pointer", fontSize: 17 }}>
            Probar gratis 7 días
          </button>
          <button onClick={() => setView("pricing")} style={{ background: "transparent", color: "#fff", border: "1px solid #222", borderRadius: 13, padding: "17px 40px", fontWeight: 600, cursor: "pointer", fontSize: 17 }}>
            Ver planes y precios
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(28px,7vw,90px)", padding: "40px 20px", borderTop: "1px solid #111", borderBottom: "1px solid #111", flexWrap: "wrap" }}>
        {[["2.400+","negocios"],["98%","ahorro de tiempo"],["5 seg","por post"],["$19","precio de entrada"]].map(([n,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 800, color: "#a3e635" }}>{n}</div>
            <div style={{ color: "#444", fontSize: 13, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "80px 40px", maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, textAlign: "center", marginBottom: 56 }}>Todo lo que necesitás</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: 18 }}>
          {[["⚡","Posts en 5 segundos","Describí el tema y la IA genera el post optimizado para cada red."],["🎯","Tono de tu marca","Configurá la voz una vez. Todos los posts suenan auténticos."],["🇦🇷","Español rioplatense","Entendemos el vos, los modismos y el contexto de Latam."],["📊","5 redes en uno","Instagram, LinkedIn, TikTok, Facebook y X desde un solo lugar."],["🔁","Variaciones infinitas","No te gusta? Regenerá hasta que sea perfecto."],["📅","Calendario editorial","Planificá el mes entero en minutos con sugerencias de IA."]].map(([icon,title,desc]) => (
            <div key={title} style={{ background: "#0c0c0c", border: "1px solid #141414", borderRadius: 16, padding: "24px 22px", transition: "all 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#a3e63530"; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#141414"; e.currentTarget.style.transform="none"; }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 7 }}>{title}</div>
              <div style={{ color: "#555", fontSize: 13, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "80px 20px", borderTop: "1px solid #111" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, marginBottom: 12 }}>Empezá hoy.</h2>
        <p style={{ color: "#555", fontSize: 17, marginBottom: 36 }}>7 días gratis · Sin tarjeta · Cancelá cuando quieras</p>
        <button onClick={() => setView("pricing")} style={{ background: "#a3e635", color: "#000", border: "none", borderRadius: 13, padding: "17px 52px", fontWeight: 800, cursor: "pointer", fontSize: 17 }}>
          Elegir mi plan →
        </button>
      </div>
    </div>
  );

  // ────────────────────────── PRICING ──────────────────────────────────────
  if (view === "pricing") return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      {checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={p => { setActivePlan(p); setView("app"); }} />}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderBottom: "1px solid #111" }}>
        <span onClick={() => setView("landing")} style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, cursor: "pointer" }}>✦ ContentAI</span>
        <button onClick={() => setView("app")} style={{ background: "transparent", color: "#a3e635", border: "1px solid #a3e63540", borderRadius: 10, padding: "9px 20px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Ver demo →</button>
      </nav>
      <div style={{ textAlign: "center", padding: "70px 20px 50px" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 54, margin: "0 0 12px" }}>Planes simples.</h1>
        <p style={{ color: "#555", fontSize: 18 }}>Sin contratos. Cancelá cuando quieras.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, maxWidth: 980, margin: "0 auto", padding: "0 24px 60px" }}>
        {PLANS.map(p => <PricingCard key={p.id} plan={p} isActive={activePlan?.id === p.id} onCheckout={pl => setCheckoutPlan(pl)} />)}
      </div>
      <p style={{ textAlign: "center", color: "#2a2a2a", fontSize: 12, paddingBottom: 40 }}>* Tipo de cambio referencial. Cobro en USD vía Stripe.</p>
    </div>
  );

  // ────────────────────────── APP ───────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#080808", color: "#fff", fontFamily: "'DM Sans',sans-serif", overflow: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>
      {checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={p => setActivePlan(p)} />}

      {/* Topbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 24px", borderBottom: "1px solid #111", background: "#0a0a0a", flexShrink: 0 }}>
        <span onClick={() => setView("landing")} style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 800, cursor: "pointer" }}>✦ ContentAI</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {activePlan ? (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#333", letterSpacing: 1 }}>PLAN {plan.name.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: plan.color, fontWeight: 700 }}>{postsLeft} posts restantes</div>
              </div>
              <button onClick={() => setView("pricing")} style={{ background: `${plan.color}12`, color: plan.color, border: `1px solid ${plan.color}40`, borderRadius: 9, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                Mejorar plan ↑
              </button>
            </>
          ) : (
            <button onClick={() => setView("pricing")} style={{ background: "#a3e635", color: "#000", border: "none", borderRadius: 9, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
              Suscribirme →
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 185, borderRight: "1px solid #111", padding: "16px 10px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
          {[["generator","✦","Generador"],["launch","🚀","Plan lanzamiento"],["calendar","📅","Calendario"],["brand","🎨","Mi marca"]].map(([id,icon,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              background: tab === id ? "#141414" : "transparent",
              border: "none", borderRadius: 9, color: tab === id ? "#fff" : "#3a3a3a",
              cursor: "pointer", fontSize: 13, textAlign: "left", fontFamily: "inherit", transition: "all 0.15s",
            }}
              onMouseEnter={e => { if(tab!==id) e.currentTarget.style.color="#777"; }}
              onMouseLeave={e => { if(tab!==id) e.currentTarget.style.color="#3a3a3a"; }}>
              <span>{icon}</span>{label}
            </button>
          ))}
          <button onClick={() => setView("pricing")} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            background: "transparent", border: "none", borderRadius: 9, color: "#3a3a3a",
            cursor: "pointer", fontSize: 13, textAlign: "left", fontFamily: "inherit",
          }}
            onMouseEnter={e => e.currentTarget.style.color="#777"}
            onMouseLeave={e => e.currentTarget.style.color="#3a3a3a"}>
            <span>💳</span>Suscripción
          </button>

          {/* Revenue widget */}
          <div style={{ marginTop: "auto", background: "#0c0c0c", border: "1px solid #141414", borderRadius: 12, padding: "14px 12px" }}>
            <div style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: 1, marginBottom: 5 }}>META $10K/MES</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#a3e635", fontFamily: "'Playfair Display',serif" }}>
              ${activePlan ? plan.price : 0}
            </div>
            <div style={{ color: "#2a2a2a", fontSize: 11, marginBottom: 8 }}>ingreso actual/mes</div>
            <div style={{ height: 3, background: "#141414", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${Math.min((plan.price/10000)*100,100)}%`, background: "#a3e635", borderRadius: 3 }} />
            </div>
            <div style={{ color: "#2a2a2a", fontSize: 10, marginTop: 5 }}>
              {activePlan ? `${((plan.price/10000)*100).toFixed(1)}% del objetivo` : "Suscribite para empezar"}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 26px" }}>

          {/* ── GENERATOR ── */}
          {tab === "generator" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, maxWidth: 980 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, margin: "0 0 4px" }}>Generador IA</h2>
                  <p style={{ color: "#333", fontSize: 13, margin: 0 }}>Completá y la IA hace el resto.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["NEGOCIO", businessName, v => setBusinessName(v), "Ej: Café del Centro", "text"],
                    ["RUBRO", industry, v => setIndustry(v), "", "select"]].map(([lbl, val, set, ph, type]) => (
                    <div key={lbl}>
                      <div style={{ fontSize: 10, color: "#333", marginBottom: 5, letterSpacing: 1 }}>{lbl}</div>
                      {type === "select" ? (
                        <select value={val} onChange={e => set(e.target.value)} style={{ width: "100%", background: "#0c0c0c", border: "1px solid #161616", borderRadius: 9, padding: "10px 12px", color: val ? "#fff" : "#2a2a2a", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                          <option value="">Seleccioná...</option>
                          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                        </select>
                      ) : (
                        <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ width: "100%", background: "#0c0c0c", border: "1px solid #161616", borderRadius: 9, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: 10, color: "#333", marginBottom: 7, letterSpacing: 1 }}>RED SOCIAL</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {NETWORKS.map(n => (
                      <button key={n.id} onClick={() => setNetwork(n)} style={{
                        background: network.id===n.id ? "#a3e63510" : "#0c0c0c",
                        border: `1px solid ${network.id===n.id ? "#a3e635" : "#161616"}`,
                        borderRadius: 8, padding: "7px 12px", color: network.id===n.id ? "#a3e635" : "#444",
                        cursor: "pointer", fontSize: 12, fontFamily: "inherit", transition: "all 0.15s",
                      }}>{n.icon} {n.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: "#333", marginBottom: 7, letterSpacing: 1 }}>TONO</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["profesional","divertido","inspirador","urgente"].map(t => (
                      <button key={t} onClick={() => setTone(t)} style={{
                        background: tone===t ? "#f59e0b10" : "#0c0c0c",
                        border: `1px solid ${tone===t ? "#f59e0b" : "#161616"}`,
                        borderRadius: 8, padding: "7px 11px", color: tone===t ? "#f59e0b" : "#444",
                        cursor: "pointer", fontSize: 12, fontFamily: "inherit", textTransform: "capitalize",
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: "#333", marginBottom: 5, letterSpacing: 1 }}>SOBRE QUÉ PUBLICAR *</div>
                  <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4}
                    placeholder="Ej: Promoción 2x1 en hamburguesas este sábado..."
                    style={{ width: "100%", background: "#0c0c0c", border: "1px solid #161616", borderRadius: 9, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor="#a3e63540"}
                    onBlur={e => e.target.style.borderColor="#161616"} />
                </div>

                <button onClick={generateContent} disabled={generating || !topic.trim()} style={{
                  background: generating||!topic.trim() ? "#141414" : "#a3e635",
                  color: generating||!topic.trim() ? "#2a2a2a" : "#000",
                  border: "none", borderRadius: 11, padding: "13px", fontSize: 15, fontWeight: 800,
                  cursor: generating||!topic.trim() ? "not-allowed" : "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit",
                }}>
                  {generating
                    ? <><div style={{ width: 15, height: 15, border: "2px solid #2a2a2a", borderTopColor: "#a3e635", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Generando...</>
                    : "✦ Generar post ahora"}
                </button>
              </div>

              {/* Result */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 10, color: "#333", letterSpacing: 1 }}>RESULTADO</div>
                <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 13, padding: 20, flex: 1, minHeight: 340, display: "flex", flexDirection: "column" }}>
                  {!result && !generating && (
                    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#1e1e1e", textAlign:"center" }}>
                      <div style={{ fontSize: 42, marginBottom: 10 }}>{network.icon}</div>
                      <div style={{ fontSize: 13 }}>Tu post para {network.label} aparecerá acá</div>
                    </div>
                  )}
                  {generating && (
                    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
                      <div style={{ width:34, height:34, border:"3px solid #141414", borderTopColor:"#a3e635", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                      <div style={{ color:"#333", fontSize:13 }}>La IA está escribiendo...</div>
                    </div>
                  )}
                  {result && !generating && (
                    <div style={{ animation:"fadeIn 0.4s ease", flex:1, display:"flex", flexDirection:"column" }}>
                      <div style={{ whiteSpace:"pre-wrap", fontSize:13.5, lineHeight:1.85, color:"#ccc", flex:1 }}>{result}</div>
                      <div style={{ display:"flex", gap:9, marginTop:18, paddingTop:14, borderTop:"1px solid #141414" }}>
                        <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                          style={{ flex:1, background: copied?"#1a2a10":"#a3e635", color: copied?"#a3e635":"#000", border: copied?"1px solid #a3e635":"none", borderRadius:8, padding:"10px", fontWeight:700, cursor:"pointer", fontSize:13, transition:"all 0.2s", fontFamily:"inherit" }}>
                          {copied ? "✓ Copiado!" : "📋 Copiar"}
                        </button>
                        <button onClick={generateContent} style={{ background:"#141414", color:"#666", border:"none", borderRadius:8, padding:"10px 14px", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>🔁</button>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ background:"#0c0c0c", border:"1px solid #141414", borderRadius:11, padding:"12px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:11 }}>
                    <span style={{ color:"#2a2a2a", letterSpacing:1 }}>USO DEL MES</span>
                    <span style={{ color:plan.color, fontWeight:700 }}>{postsUsed} / {plan.posts===999?"∞":plan.posts}</span>
                  </div>
                  {plan.posts!==999 && (
                    <div style={{ height:3, background:"#141414", borderRadius:3 }}>
                      <div style={{ height:"100%", width:`${Math.min((postsUsed/plan.posts)*100,100)}%`, background:plan.color, borderRadius:3, transition:"width 0.5s" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── LAUNCH PLAN ── */}
          {tab === "launch" && (
            <div style={{ maxWidth: 760 }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 4px" }}>Plan de lanzamiento</h2>
                <p style={{ color:"#333", fontSize:13, margin:"0 0 18px" }}>Tu hoja de ruta hacia los $10.000/mes. Tacheá cada tarea a medida que avanzás.</p>
                <div style={{ background:"#0c0c0c", border:"1px solid #141414", borderRadius:13, padding:"14px 18px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:12 }}>
                      <span style={{ color:"#444" }}>Progreso total</span>
                      <span style={{ color:"#a3e635", fontWeight:700 }}>{doneTasks}/{totalTasks} tareas</span>
                    </div>
                    <div style={{ height:5, background:"#141414", borderRadius:5 }}>
                      <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#a3e635,#f59e0b)", borderRadius:5, transition:"width 0.4s" }} />
                    </div>
                  </div>
                  <div style={{ fontSize:26, fontWeight:800, color:"#a3e635", fontFamily:"'Playfair Display',serif", minWidth:50 }}>{progress}%</div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {launchTasks.map((step, sIdx) => {
                  const sd = step.tasks.filter(t=>t.done).length;
                  return (
                    <div key={step.week} style={{ background:"#0c0c0c", border:"1px solid #141414", borderRadius:14, overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 18px", borderBottom:"1px solid #141414" }}>
                        <div style={{ width:36,height:36, background:`${step.color}12`, borderRadius:9, display:"grid", placeItems:"center", fontSize:17 }}>{step.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14 }}>{step.title}</div>
                          <div style={{ color:"#333", fontSize:11 }}>{step.week}</div>
                        </div>
                        <div style={{ fontSize:12, color:step.color, fontWeight:700 }}>{sd}/{step.tasks.length}</div>
                      </div>
                      <div style={{ padding:"10px 18px", display:"flex", flexDirection:"column", gap:1 }}>
                        {step.tasks.map((task, tIdx) => (
                          <div key={tIdx} onClick={() => toggleTask(sIdx,tIdx)}
                            style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 6px", cursor:"pointer", borderRadius:7, transition:"background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background="#141414"}
                            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                            <div style={{
                              width:17,height:17, borderRadius:4, border:`2px solid ${task.done?step.color:"#1e1e1e"}`,
                              background:task.done?step.color:"transparent", display:"grid", placeItems:"center",
                              fontSize:10, color:"#000", flexShrink:0, marginTop:2, transition:"all 0.2s",
                            }}>{task.done?"✓":""}</div>
                            <span style={{ fontSize:13, color:task.done?"#333":"#aaa", textDecoration:task.done?"line-through":"none", lineHeight:1.5, transition:"all 0.2s" }}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop:20, background:"#0c0c0c", border:"1px solid #141414", borderRadius:14, padding:"20px 22px" }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>📈 Proyección de ingresos</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                  {[["Mes 1","$200","10 clientes","#1a1a1a"],["Mes 2","$1.000","50 clientes","#a3e63530"],["Mes 3","$3.000","100 clientes","#f59e0b40"],["Mes 6","$10.000","200+ clientes","#a3e635"]].map(([mes,ing,cl,col]) => (
                    <div key={mes} style={{ background:"#0a0a0a", border:`1px solid ${col}`, borderRadius:11, padding:"13px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:"#333", marginBottom:5 }}>{mes}</div>
                      <div style={{ fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Playfair Display',serif" }}>{ing}</div>
                      <div style={{ fontSize:10, color:"#444", marginTop:4 }}>{cl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Locked tabs */}
          {(tab === "calendar" || tab === "brand") && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"70%", gap:12, color:"#1e1e1e" }}>
              <div style={{ fontSize:50 }}>🔒</div>
              <div style={{ fontSize:17, color:"#333" }}>Disponible en plan Pro o superior</div>
              <button onClick={() => setView("pricing")} style={{ background:"#a3e635", color:"#000", border:"none", borderRadius:10, padding:"11px 26px", cursor:"pointer", fontWeight:700, marginTop:8, fontFamily:"inherit" }}>
                Ver planes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
