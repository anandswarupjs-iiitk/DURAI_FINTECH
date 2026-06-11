import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SignupPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tick, setTick] =
    useState(0);

  // ───────── Threat ticker animation ─────────

  useEffect(() => {

    const t = setInterval(() => {
      setTick((p) => p + 1);
    }, 2200);

    return () => clearInterval(t);

  }, []);

  const THREATS = [

    "₹82,000 flagged · New device · 02:14 AM",

    "High-velocity burst · Foreign IP detected",

    "₹3,40,000 · Risk score 88 · Manual review",

    "Repeated tx pattern · Unknown merchant",

    "First-time recipient · ₹12,500 flagged",
  ];

  // ───────── Handle input ─────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ───────── Handle submit ─────────

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // BASIC CHECKS

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError("All fields are required.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError("Passwords do not match.");
      return;
    }

    // PASSWORD VALIDATIONS

    if (
      formData.password.length < 8
    ) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (
      !/[A-Z]/.test(formData.password)
    ) {

      setError(
        "Password must contain uppercase letter."
      );

      return;
    }

    if (
      !/[0-9]/.test(formData.password)
    ) {

      setError(
        "Password must contain a number."
      );

      return;
    }

    if (
      !/[!@#$%^&*]/.test(formData.password)
    ) {

      setError(
        "Password must contain special character."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
            "application/json",
          },

          body: JSON.stringify({

            name:
            formData.name,

            email:
            formData.email,

            password:
            formData.password,
          }),
        }
      );

      const data =
      await response.json();

      console.log(
        "REGISTER RESPONSE:",
        data
      );

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Signup failed"
        );
      }

      alert(
        "Account created successfully!"
      );

      // RESET FORM

      setFormData({

        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error: any) {

      console.log(
        "SIGNUP ERROR:",
        error
      );

      setError(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  // ───────── UI ─────────

  return (

    <div className="min-h-screen bg-[#050810] flex antialiased overflow-hidden">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
            "radial-gradient(#f97316 1px, transparent 1px)",
            backgroundSize:
            "32px 32px"
          }}
        />

        <div className="relative z-10 p-10">

          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >

            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">

              <span className="text-black font-black text-sm">
                FG
              </span>

            </div>

            <div>

              <span className="font-black text-white text-lg block">
                FraudGuard
              </span>

              <span className="text-orange-500/70 text-[9px] tracking-widest">
                AI FRAUD DETECTION
              </span>

            </div>

          </Link>

        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-16">

          <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-5 mb-8 w-full max-w-sm">

            <div className="text-xs text-slate-300">

              {
                THREATS[
                  tick %
                  THREATS.length
                ]
              }

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 lg:max-w-[520px] flex flex-col justify-center px-8 md:px-16 bg-slate-900/40">

        <div className="w-full max-w-sm mx-auto">

          <div className="mb-8">

            <h1 className="font-black text-4xl text-white mb-2">

              Join FraudGuard

            </h1>

            <p className="text-slate-500 text-sm">

              Create your free account

            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
            />

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
            />

            {/* PASSWORD */}

            <div className="relative">

              <input
                type={
                  showPassword
                  ? "text"
                  : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
              >

                {
                  showPassword
                  ? "HIDE"
                  : "SHOW"
                }

              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                  ? "text"
                  : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
              >

                {
                  showConfirmPassword
                  ? "HIDE"
                  : "SHOW"
                }

              </button>

            </div>

            {/* ERROR */}

            {
              error && (

                <div className="text-red-400 text-sm">

                  {error}

                </div>
              )
            }

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 rounded-xl"
            >

              {
                loading
                ? "CREATING ACCOUNT..."
                : "CREATE ACCOUNT"
              }

            </button>

          </form>

          <p className="text-center text-sm text-slate-500 pt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-orange-500"
            >

              Login

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}