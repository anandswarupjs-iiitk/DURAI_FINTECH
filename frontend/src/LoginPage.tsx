import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // Animate the live threat ticker
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const THREATS = [
    "₹82,000 flagged · New device · 02:14 AM",
    "High-velocity burst · Foreign IP detected",
    "₹3,40,000 · Risk score 88 · Manual review",
    "Repeated tx pattern · Unknown merchant",
    "First-time recipient · ₹12,500 flagged",
  ];
  
  const handleSubmit = async () => {

  if (!email || !password) {
    setError("All fields required.");
    return;
  }

  setError("");
  setLoading(true);

  try {

    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    // SAVE ACCESS TOKEN
    localStorage.setItem(
      "token",
      data.data.accessToken
    );

    // SAVE USER DATA
    localStorage.setItem(
      "user",
      JSON.stringify(data.data.user)
    );

    navigate("/dashboard");

  } catch (error) {

    setError(
      error.message ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }

};
const handleForgotPassword = async () => {

  if (!forgotEmail) {
    setError("Enter your email");
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Request failed"
      );
    }

    setMessage(
      "Password reset link sent to your email."
    );

    setShowForgot(false);

  } catch (err) {

    setError(err.message);

  }

};
  

  return (
    <div className="min-h-screen bg-[#050810] flex antialiased overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes scanLine { 0%{top:0}100%{top:100%} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes fadeTick { 0%{opacity:0;transform:translateY(6px)}20%{opacity:1;transform:translateY(0)}80%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-6px)} }
        .tick-anim { animation: fadeTick 2.2s ease forwards; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0f172a inset !important; -webkit-text-fill-color: #e2e8f0 !important; }
      `}</style>

      {/* ── LEFT PANEL (decorative) ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/6 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <a href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-black font-black text-sm" style={{ fontFamily: "Syne, sans-serif" }}>FG</span>
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight leading-none block" style={{ fontFamily: "Syne, sans-serif" }}>FraudGuard</span>
              <span className="text-orange-500/70 text-[9px] tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>AI FRAUD DETECTION</span>
            </div>
          </a>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-16">
          <div className="mb-3">
            <span className="text-[10px] tracking-widest text-orange-500" style={{ fontFamily: "DM Mono, monospace" }}>LIVE THREAT FEED</span>
          </div>

          {/* Animated threat card */}
          <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-5 mb-8 relative overflow-hidden w-full max-w-sm">
            <div className="absolute inset-x-0 h-px bg-red-500/40" style={{ animation: "scanLine 3s linear infinite", top: 0 }} />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[9px] tracking-widest text-red-400/80" style={{ fontFamily: "DM Mono, monospace" }}>FLAGGED TX</span>
              </div>
              <span className="text-[9px] text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>just now</span>
            </div>
            <div key={tick} className="tick-anim text-xs text-slate-300 min-h-[1.25rem]" style={{ fontFamily: "DM Mono, monospace" }}>
              {THREATS[tick % THREATS.length]}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-500 transition-all duration-700" style={{ width: "88%" }} />
              </div>
              <span className="text-xs font-bold text-red-400" style={{ fontFamily: "DM Mono, monospace" }}>88%</span>
            </div>
            <div className="text-[9px] text-slate-600 mt-1" style={{ fontFamily: "DM Mono, monospace" }}>RISK SCORE</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 min-w-sm">
            {[
              { v: "99.98%", l: "DETECTION RATE" },
              { v: "<50ms", l: "ALERT LATENCY" },
              { v: "7", l: "RISK SIGNALS" },
            ].map(({ v, l }) => (
              <div key={l} className="border-l-2 border-orange-500/30 pl-4">
                <div className="font-black text-2xl text-white" style={{ fontFamily: "Syne, sans-serif" }}>{v}</div>
                <div className="text-[9px] tracking-widest text-slate-500 mt-0.5" style={{ fontFamily: "DM Mono, monospace" }}>{l}</div>
              </div>
            ))}
          </div>

          
        </div>

        {/* Bottom status bar */}
        <div className="relative z-10 px-10 pb-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] tracking-widest text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>FRAUD ENGINE OPERATIONAL</span>
        </div>
      </div>

      {/* ── RIGHT PANEL (login form) ── */}
      <div className="flex-1 lg:max-w-[520px] flex flex-col justify-center px-8 md:px-16 relative bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-black/40 border-l border-white/5">
        {/* Mobile logo */}
        <div className="lg:hidden mb-12 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-black font-black text-sm" style={{ fontFamily: "Syne, sans-serif" }}>FG</span>
          </div>
          <div>
            <span className="font-black text-white text-lg tracking-tight leading-none block" style={{ fontFamily: "Syne, sans-serif" }}>FraudGuard</span>
            <span className="text-orange-500/70 text-[9px] tracking-widest" style={{ fontFamily: "DM Mono, monospace" }}>AI FRAUD DETECTION</span>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] tracking-widest text-orange-400" style={{ fontFamily: "DM Mono, monospace" }}>SECURE SESSION</span>
            </div>
            <h1 className="font-black text-4xl text-white leading-tight mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
              Welcome<br /><span className="text-orange-500">back.</span>
            </h1>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "DM Mono, monospace" }}>Log in to your fraud intelligence dashboard.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-widest text-slate-500 mb-2" style={{ fontFamily: "DM Mono, monospace" }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500/60 focus:bg-slate-900 focus:shadow-lg focus:shadow-orange-500/10"
                style={{ fontFamily: "DM Mono, monospace" }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-widest text-slate-500" style={{ fontFamily: "DM Mono, monospace" }}>PASSWORD</label>
                 <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[10px] text-orange-500/70 hover:text-orange-400 transition-colors tracking-widest"
                 style={{ fontFamily: "DM Mono, monospace" }}
                 >
                FORGOT?
               </button>
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500/60 focus:bg-slate-900 focus:shadow-lg focus:shadow-orange-500/10 pr-12"
                  style={{ fontFamily: "DM Mono, monospace" }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors text-[10px] tracking-widest"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {show ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3" style={{ fontFamily: "DM Mono, monospace" }}>
                <span>▸</span> {error}
              </div>
            )}

            {message && (
  <div
    className="text-xs text-green-400
    bg-green-500/10
    border border-green-500/20
    rounded-lg px-4 py-3"
  >
    {message}
  </div>
)}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 mt-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : "LOG IN →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] tracking-widest text-slate-600" style={{ fontFamily: "DM Mono, monospace" }}>OR</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            

            {/* Sign up link */}
            <p className="text-center text-[11px] text-slate-600 pt-2" style={{ fontFamily: "DM Mono, monospace" }}>
              No account?{" "}
              <Link to="/signup" className="text-orange-500/80 hover:text-orange-400 transition-colors">
                CREATE ONE FREE
              </Link>
            </p>
          </div>

          {/* Security note */}
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/6 bg-slate-900/30 px-4 py-3.5">
            <span className="text-green-400 text-sm mt-0.5 shrink-0">🔒</span>
            <p className="text-[10px] text-slate-600 leading-relaxed" style={{ fontFamily: "DM Mono, monospace" }}>
              Protected by JWT auth, bcrypt hashing, and rate limiting. All sessions are encrypted end-to-end.
            </p>
          </div>
        </div>
      </div>
    {showForgot && (

<div className="
fixed inset-0
bg-black/70
flex items-center
justify-center
z-50
">

  <div className="
  bg-slate-900
  p-6
  rounded-xl
  w-[400px]
  border border-orange-500/20
  ">

    <h2 className="
    text-white
    text-xl
    font-bold
    mb-4
    ">
      Forgot Password
    </h2>

    <input
      type="email"
      placeholder="Enter your email"
      value={forgotEmail}
      onChange={(e) =>
        setForgotEmail(e.target.value)
      }
      className="
      w-full
      bg-slate-800
      border border-slate-700
      rounded-lg
      px-4 py-3
      text-white
      mb-4
      "
    />

    <div className="flex gap-3">

      <button
        onClick={handleForgotPassword}
        className="
        flex-1
        bg-orange-500
        text-black
        py-3
        rounded-lg
        font-bold
        "
      >
        SEND LINK
      </button>

      <button
        onClick={() =>
          setShowForgot(false)
        }
        className="
        flex-1
        bg-slate-700
        text-white
        py-3
        rounded-lg
        "
      >
        CANCEL
      </button>

    </div>

  </div>

</div>

)}  
    </div>
  );
}