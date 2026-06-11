import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type AlertItem = { id: number; msg: string; risk: number; time: string };

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LIVE_ALERTS: AlertItem[] = [
  { id: 1, msg: "₹82,000 • New device • 02:14 AM", risk: 91, time: "just now" },
  { id: 2, msg: "₹1,200 • Unknown merchant • Repeat tx", risk: 63, time: "12s ago" },
  { id: 3, msg: "₹3,40,000 • Foreign IP • High velocity", risk: 88, time: "41s ago" },
  { id: 4, msg: "₹750 • Normal pattern", risk: 8, time: "1m ago" },
  { id: 5, msg: "₹12,500 • First-time recipient", risk: 44, time: "2m ago" },
];

const FEATURES = [
  { icon: "⬡", title: "AI Risk Scoring", desc: "Every transaction gets a 0–100 composite risk score across 7 weighted signals — amount anomaly, timing, device, location, velocity, recipient history, and pattern deviation.", tag: "Core Engine" },
  { icon: "◈", title: "Real-Time Monitor", desc: "Continuous transaction monitoring with sub-second alert dispatch. Webhook triggers and live fraud log updated as events occur.", tag: "Live" },
  { icon: "⬠", title: "Behavioral Analytics", desc: "Spending pattern baselines per user. Monthly trend analysis, category breakdowns, and income-vs-expense intelligence — all in visual dashboards.", tag: "Analytics" },
  { icon: "◇", title: "Zero-Trust Auth", desc: "JWT stateless sessions, bcrypt password hashing, 2FA support, and rate limiting on every API route. Security middleware on all endpoints.", tag: "Security" },
  { icon: "⬡", title: "Fraud Confidence %", desc: "AI returns a confidence percentage alongside each risk score — with human-readable reason breakdowns and actionable security suggestions.", tag: "AI Layer" },
  { icon: "◈", title: "Audit Trail", desc: "Immutable suspicious activity log with timestamps, device fingerprints, and flagged reasons. Every event is traceable end-to-end.", tag: "Compliance" },
];

const SIGNALS = [
  { label: "Unusual Amount", weight: 30, color: "#f97316" },
  { label: "New Device", weight: 25, color: "#ef4444" },
  { label: "Unusual Timing", weight: 20, color: "#eab308" },
  { label: "New Recipient", weight: 15, color: "#a78bfa" },
  { label: "Repeated Tx", weight: 10, color: "#38bdf8" },
];




// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#050810]/95 backdrop-blur-xl border-b border-orange-500/15 shadow-xl shadow-orange-500/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-black font-black text-sm" style={{ fontFamily: "Syne, sans-serif" }}>FG</span>
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#050810]" />
          </div>
          <div>
            <span className="font-black text-white text-lg tracking-tight leading-none block" style={{ fontFamily: "Syne, sans-serif" }}>FraudGuard</span>
            <span className="text-orange-500/70 text-[9px] tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>AI FRAUD DETECTION</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Engine", "Security"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-[11px] text-slate-400 hover:text-orange-400 tracking-widest uppercase transition-colors" style={{ fontFamily: "DM Mono, monospace" }}>{l}</a>
          ))}
        </div>

        
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <button className="text-xs text-slate-400 hover:text-white px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/25 transition-all">
              LOG IN
            </button>
          </Link>
          <Link to="/signup">
            <button className="text-xs text-black font-bold bg-orange-500 hover:bg-orange-400 px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5">
              SIGN UP
            </button>
          </Link>
        </div>

        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open && i === 0 ? "rotate-45 translate-y-2" : open && i === 1 ? "opacity-0" : open && i === 2 ? "-rotate-45 -translate-y-2" : ""}`} />
            ))}
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#050810]/98 border-t border-white/8 px-6 py-6 space-y-4">
          {["Features", "Engine", "Pages", "Security"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block text-xs tracking-widest uppercase text-slate-300 hover:text-orange-400" style={{ fontFamily: "DM Mono, monospace" }}>{l}</a>
          ))}
          <Link to="/login">
            <button className="w-full border border-white/15 text-white text-xs tracking-widest py-3 rounded-lg" style={{ fontFamily: "DM Mono, monospace" }}>LOG IN</button>
          </Link>
          <Link to="/signup">
            <button className="w-full bg-orange-500 text-black text-xs tracking-widest font-bold py-3 rounded-lg" style={{ fontFamily: "DM Mono, monospace" }}>SIGN UP FREE</button>
          </Link>
        </div>
      )}
    </nav>
  );
}



// ─── LIVE ALERT WIDGET ────────────────────────────────────────────────────────
function LiveAlertWidget() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % LIVE_ALERTS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const a = LIVE_ALERTS[active];
  const isHigh = a.risk >= 70;

  return (
    <div className={`relative rounded-xl border p-4 transition-all duration-500 overflow-hidden ${isHigh ? "border-red-500/40 bg-red-500/5" : a.risk >= 40 ? "border-yellow-500/30 bg-yellow-500/5" : "border-green-500/30 bg-green-500/5"}`}>
      <div className="absolute inset-x-0 h-px opacity-25" style={{ background: isHigh ? "#ef4444" : "#22c55e", animation: "scanLine 3s linear infinite", top: 0 }} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-widest text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>LIVE FRAUD MONITOR</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-green-400" style={{ fontFamily: "DM Mono, monospace" }}>ACTIVE</span>
        </div>
      </div>
      <div className="text-xs text-slate-300 mb-3 min-h-[1.25rem]" style={{ fontFamily: "DM Mono, monospace" }}>{a.msg}</div>
      <div className="flex items-center justify-between">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full mr-3 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${isHigh ? "bg-red-500" : a.risk >= 40 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${a.risk}%` }} />
        </div>
        <span className={`text-sm font-bold ${isHigh ? "text-red-400" : a.risk >= 40 ? "text-yellow-400" : "text-green-400"}`} style={{ fontFamily: "DM Mono, monospace" }}>{a.risk}%</span>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[9px] text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>RISK SCORE</span>
        <span className="text-[9px] text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>{a.time}</span>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050810]">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-20 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-orange-400 text-[11px] tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>AI ENGINE ONLINE — 99.98% DETECTION RATE</span>
          </div>

          <h1 className="font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[1.0] tracking-tight mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
            Catch fraud<br />
            <span className="text-orange-500">before it</span><br />
            <span className="relative">strikes.<span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent" /></span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-md mb-10 font-light">
            FraudGuard is an AI-powered fintech intelligence platform. Every transaction is scored in real time — risk percentages, confidence levels, behavioral baselines, and instant alerts.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="group font-black text-sm text-black bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30" style={{ fontFamily: "Syne, sans-serif" }}>
              START MONITORING <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button className="text-xs tracking-widest text-slate-300 border border-white/15 hover:border-orange-500/40 px-7 py-4 rounded-xl transition-all hover:bg-orange-500/5" style={{ fontFamily: "DM Mono, monospace" }}>VIEW LIVE DEMO</button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[].map(({ v, l }) => (
              <div key={l} className="border-l-2 border-orange-500/30 pl-4">
                <div className="font-black text-3xl text-white" style={{ fontFamily: "Syne, sans-serif" }}>{v}</div>
                <div className="text-[10px] tracking-widest text-slate-500 mt-0.5" style={{ fontFamily: "DM Mono, monospace" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <LiveAlertWidget />
          <div className="rounded-xl border border-white/8 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-slate-500 tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>FRAUD_ENGINE.log</span>
              <span className="text-[9px] text-orange-400" style={{ fontFamily: "DM Mono, monospace" }}>LIVE</span>
            </div>
            <div className="p-4 space-y-2.5">
              {LIVE_ALERTS.slice(0, 4).map((a) => (
                <div key={a.id} className={`flex items-center justify-between py-2 px-3 rounded-lg ${a.risk >= 70 ? "bg-red-500/8 border border-red-500/20" : a.risk >= 40 ? "bg-yellow-500/8 border border-yellow-500/15" : "bg-green-500/8 border border-green-500/15"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.risk >= 70 ? "bg-red-400" : a.risk >= 40 ? "bg-yellow-400" : "bg-green-400"}`} />
                    <span className="text-[10px] text-slate-300" style={{ fontFamily: "DM Mono, monospace" }}>{a.msg}</span>
                  </div>
                  <span className={`text-xs font-bold ${a.risk >= 70 ? "text-red-400" : a.risk >= 40 ? "text-yellow-400" : "text-green-400"}`} style={{ fontFamily: "DM Mono, monospace" }}>{a.risk}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="bg-[#050810] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] tracking-widest text-orange-500" style={{ fontFamily: "DM Mono, monospace" }}>PLATFORM CAPABILITIES</span>
            <h2 className="font-black text-4xl md:text-5xl text-white mt-2 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>What FraudGuard<br /><span className="text-slate-500">actually does.</span></h2>
          </div>
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div key={title} className="group relative border border-white/8 rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/70 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/0 group-hover:via-orange-500/40 to-transparent transition-all duration-500" />
              <div className="flex items-start justify-between mb-5">
                <span className="text-2xl text-orange-500 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</span>
                <span className="text-[9px] tracking-widest text-orange-400/60 bg-orange-500/8 border border-orange-500/15 px-2.5 py-1 rounded-full" style={{ fontFamily: "DM Mono, monospace" }}>{tag}</span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RISK ENGINE DEMO ─────────────────────────────────────────────────────────
function RiskEngineSection() {
  const [demo, setDemo] = useState({ amount: 50000, hour: 2, newDevice: true, newRecipient: true, repeated: false });
  const score = Math.min(100, Math.round(
    (demo.amount > 10000 ? 28 : demo.amount > 2000 ? 15 : 5) +
    (demo.newDevice ? 25 : 0) +
    (demo.hour < 5 ? 18 : 0) +
    (demo.newRecipient ? 14 : 0) +
    (demo.repeated ? 10 : 0)
  ));
  const label = score >= 75 ? "HIGH RISK" : score >= 45 ? "MEDIUM RISK" : "LOW RISK";
  const color = score >= 75 ? "#ef4444" : score >= 45 ? "#eab308" : "#22c55e";

  return (
    <section id="engine" className="bg-slate-950 py-24 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-widest text-orange-500" style={{ fontFamily: "DM Mono, monospace" }}>FRAUD DETECTION ENGINE</span>
          <h2 className="font-black text-4xl md:text-5xl text-white mt-2" style={{ fontFamily: "Syne, sans-serif" }}>Risk score — live demo.</h2>
          <p className="text-slate-500 mt-3 text-sm">Toggle signals and watch the AI risk score update in real time.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-5">
            <div>
              <label className="text-[10px] tracking-widest text-slate-500 block mb-2" style={{ fontFamily: "DM Mono, monospace" }}>TRANSACTION AMOUNT: ₹{demo.amount.toLocaleString("en-IN")}</label>
              <input type="range" min={100} max={100000} step={500} value={demo.amount} onChange={(e) => setDemo((d) => ({ ...d, amount: +e.target.value }))} className="w-full accent-orange-500" />
              <div className="flex justify-between text-[9px] text-slate-600 mt-1" style={{ fontFamily: "DM Mono, monospace" }}><span>₹100</span><span>₹1L</span></div>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-slate-500 block mb-2" style={{ fontFamily: "DM Mono, monospace" }}>HOUR OF TRANSACTION: {demo.hour}:00</label>
              <input type="range" min={0} max={23} value={demo.hour} onChange={(e) => setDemo((d) => ({ ...d, hour: +e.target.value }))} className="w-full accent-orange-500" />
              <div className="flex justify-between text-[9px] text-slate-600 mt-1" style={{ fontFamily: "DM Mono, monospace" }}><span>Midnight</span><span>11 PM</span></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ key: "newDevice", label: "NEW DEVICE" }, { key: "newRecipient", label: "NEW RECIPIENT" }, { key: "repeated", label: "REPEATED TX" }].map(({ key, label: lbl }) => (
                <button key={key} onClick={() => setDemo((d) => ({ ...d, [key]: !d[key as keyof typeof d] }))}
                  className={`rounded-lg border py-3 text-center text-[9px] tracking-widest transition-all duration-200 ${(demo[key as keyof typeof demo] as boolean) ? "bg-orange-500/20 border-orange-500/50 text-orange-300" : "bg-slate-900/50 border-white/10 text-slate-600 hover:border-white/20"}`}
                  style={{ fontFamily: "DM Mono, monospace" }}>
                  {lbl}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-white/8 p-4 space-y-3">
              <span className="text-[10px] tracking-widest text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>SIGNAL WEIGHTS</span>
              {SIGNALS.map(({ label: sl, weight, color: c }) => (
                <div key={sl} className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-500 w-32 shrink-0" style={{ fontFamily: "DM Mono, monospace", color: c + "aa" }}>{sl}</span>
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${weight * 3}%`, backgroundColor: c }} />
                  </div>
                  <span className="text-[9px] text-slate-600 w-6 text-right" style={{ fontFamily: "DM Mono, monospace" }}>{weight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 502} 502`}
                  style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }} />
              </svg>
              <div className="text-center z-10">
                <div className="font-black text-5xl transition-all duration-500" style={{ color, fontFamily: "Syne, sans-serif" }}>{score}</div>
                <div className="text-[10px] tracking-widest text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>RISK SCORE</div>
              </div>
            </div>
            <div className="font-black text-xl tracking-wider mt-2 transition-colors duration-500" style={{ color, fontFamily: "Syne, sans-serif" }}>{label}</div>

            <div className="mt-8 w-full rounded-xl border border-white/8 bg-slate-900/60 p-5 space-y-2.5">
              <span className="text-[10px] tracking-widest text-slate-500 block" style={{ fontFamily: "DM Mono, monospace" }}>FLAGGED REASONS</span>
              {[
                { cond: demo.amount > 10000, msg: `Amount ₹${demo.amount.toLocaleString("en-IN")} — above threshold` },
                { cond: demo.newDevice, msg: "New device detected" },
                { cond: demo.hour < 5, msg: `Midnight transaction (${demo.hour}:00)` },
                { cond: demo.newRecipient, msg: "First transfer to this recipient" },
                { cond: demo.repeated, msg: "Repeated transaction pattern" },
              ].filter((r) => r.cond).map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400" style={{ fontFamily: "DM Mono, monospace" }}>
                  <span className="text-orange-500 mt-0.5 shrink-0">▸</span>{r.msg}
                </div>
              ))}
              {score < 10 && <div className="text-xs text-green-400" style={{ fontFamily: "DM Mono, monospace" }}>✓ No flags — transaction looks safe</div>}
            </div>

            <div className="mt-4 w-full rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-4">
              <span className="text-[9px] tracking-widest text-orange-500/70 block mb-1" style={{ fontFamily: "DM Mono, monospace" }}>AI SUGGESTION</span>
              <p className="text-xs text-orange-300" style={{ fontFamily: "DM Mono, monospace" }}>
                {score >= 75 ? "Flag for manual review. Trigger 2FA verification before processing." : score >= 45 ? "Send OTP to registered device. Monitor for 30 minutes." : "Transaction within normal parameters. Auto-approve."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ─── SECURITY ────────────────────────────────────────────────────────────────
function SecuritySection() {
  const items = [
    { icon: "🔑", title: "JWT Auth", desc: "Stateless sessions. Every route protected by verifyToken() middleware." },
    { icon: "🔒", title: "bcrypt Hashing", desc: "Passwords never stored in plaintext. hashPassword() on all signup and change flows." },
    { icon: "🚦", title: "Rate Limiting", desc: "express-rate-limit blocks flood attacks. Per-IP and per-user controls." },
    { icon: "💉", title: "Injection Prevention", desc: "preventInjection() sanitizes all inputs. SQL + NoSQL patterns blocked." },
    { icon: "🛡️", title: "Helmet.js", desc: "HTTP security headers on every response. XSS, clickjacking, MIME sniffing — all mitigated." },
    { icon: "✅", title: "Input Validation", desc: "validateInput() type-checks and format-checks every field before any DB operation." },
  ];
  return (
    <section id="security" className="bg-slate-950 border-t border-white/5 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-[10px] tracking-widest text-orange-500" style={{ fontFamily: "DM Mono, monospace" }}>SECURITY LAYER</span>
            <h2 className="font-black text-4xl md:text-5xl text-white mt-2 mb-6" style={{ fontFamily: "Syne, sans-serif" }}>Every route.<br /><span className="text-orange-500">Every request.</span><br />Protected.</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">Module 6 applies 5 security functions as middleware across all API endpoints. No route is exposed without validation, sanitization, and auth verification.</p>
            <div className="text-xs bg-slate-900 border border-white/8 rounded-xl p-5 space-y-1.5 text-slate-400" style={{ fontFamily: "DM Mono, monospace" }}>
              <div className="text-slate-600 mb-3">// Applied to every API route</div>
              {["validateInput()", "sanitizeRequest()", "verifyJWT()", "rateLimiter()", "preventInjection()"].map((fn) => (
                <div key={fn}><span className="text-orange-400">app</span><span className="text-slate-600">.use(</span><span className="text-green-400">{fn}</span><span className="text-slate-600">)</span></div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/8 bg-slate-900/40 p-5 hover:border-orange-500/25 transition-colors group">
                <div className="text-xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">{icon}</div>
                <h4 className="font-bold text-sm text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="bg-[#050810] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 rounded-3xl opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-6">
              <span className="font-black text-black text-2xl" style={{ fontFamily: "Syne, sans-serif" }}>FG</span>
            </div>
            <h2 className="font-black text-4xl md:text-5xl text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Detect suspicious transactions<br /><span className="text-orange-500">instantly with intelligent risk scoring.</span></h2>
            <p className="text-slate-400 text-sm mb-10 max-w-md mx-auto leading-relaxed">AI fraud detection that actually works. This isn't a transaction app — it's a security intelligence platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button className="font-black text-sm text-black bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30" style={{ fontFamily: "Syne, sans-serif" }}>CREATE FREE ACCOUNT</button>
              </Link>
              <Link to="/login">
                <button className="text-xs tracking-widest text-slate-300 border border-white/15 hover:border-orange-500/40 px-8 py-4 rounded-xl hover:bg-orange-500/5 transition-all" style={{ fontFamily: "DM Mono, monospace" }}>LOGIN TO DASHBOARD</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols: Record<string, string[]> = {
    Platform: ["Dashboard", "Fraud Monitor", "Transactions", "Analytics", "Settings"],
    Developers: ["API Docs", "Function Reference", "Module Guide", "GitHub", "Changelog"],
    Security: ["Auth Flow", "Rate Limits", "JWT Spec", "Vulnerability Policy", "Pen Tests"],
  };
  return (
    <footer className="bg-slate-950 border-t border-white/8 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="font-black text-black text-sm" style={{ fontFamily: "Syne, sans-serif" }}>FG</span>
              </div>
              <div>
                <div className="font-black text-white text-base leading-none" style={{ fontFamily: "Syne, sans-serif" }}>FraudGuard</div>
                <div className="text-orange-500/60 text-[9px] tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>AI FRAUD DETECTION</div>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-[180px]">AI-powered fintech fraud detection and transaction monitoring platform.</p>
          </div>
          {Object.entries(cols).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-[10px] tracking-widest text-slate-500 mb-4" style={{ fontFamily: "DM Mono, monospace" }}>{cat.toUpperCase()}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}><a href="#" className="text-slate-600 hover:text-orange-400 text-xs transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest text-slate-700" style={{ fontFamily: "DM Mono, monospace" }}>© 2026 FRAUDGUARD — AI FRAUD DETECTION PLATFORM</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-widest text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>FRAUD ENGINE OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scanLine { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <RiskEngineSection />
      {/* <PagesSection /> */}
      <SecuritySection />
      <CTA />

      <Footer />
    </div>
  );
}