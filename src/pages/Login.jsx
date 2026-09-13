import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart3, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = (email || "").trim();
    const trimmedPassword = (password || "").trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const res = login(trimmedEmail, trimmedPassword);

    if (!res.success) {
      setError(res.error || "Authentication failed. Please verify credentials.");
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@demo.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/25">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ClientHub Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your administrative dashboard</p>
        </div>

        {/* Error Notice */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm p-3 rounded-xl mb-4"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="text-slate-300 text-xs sm:text-sm font-medium mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={Boolean(error)}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="admin@demo.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="text-slate-300 text-xs sm:text-sm font-medium mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={Boolean(error)}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Demo Helper Banner */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800 rounded-xl p-3">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-300 block">Demo Credentials</span>
              <span className="text-[11px] text-slate-500 font-mono">admin@demo.com / admin123</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}