import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart3, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle, Copy, Check } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyCredentials = () => {
    const credentials = "admin@demo.com / admin123";
    navigator.clipboard.writeText(credentials);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-950">
      {/* Left Brand Panel - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-950 via-neutral-950 to-neutral-900 relative overflow-hidden">
        {/* Animated dots pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-600/20">
            <BarChart3 className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight mb-4">
            ClientHub
          </h1>
          <p className="text-neutral-400 text-lg max-w-md">
            Enterprise-grade client management for modern teams
          </p>
          <div className="mt-12 flex items-center gap-6 text-neutral-500 text-sm">
            <span>Secure Authentication</span>
            <span>•</span>
            <span>Real-time Analytics</span>
            <span>•</span>
            <span>Team Collaboration</span>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/20">
              <BarChart3 className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              ClientHub
            </h1>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-elevated">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white tracking-tight mb-2">
                Sign in to your account
              </h2>
              <p className="text-neutral-500 text-sm">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Error Notice */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-center gap-2 bg-danger-950/30 border border-danger-500/30 text-danger-300 text-sm p-3 rounded-lg mb-6"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="text-neutral-300 text-xs font-medium mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 text-sm input-focus-ring transition-colors"
                    placeholder="admin@demo.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="text-neutral-300 text-xs font-medium mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-neutral-500 text-sm input-focus-ring transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-3 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-500/70 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Demo Helper Banner */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="flex items-center justify-between bg-neutral-950/50 border border-neutral-800 rounded-lg p-3">
                <div className="text-left flex-1">
                  <span className="text-xs font-medium text-neutral-300 block mb-0.5">Demo Credentials</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-mono">admin@demo.com / admin123</span>
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="text-neutral-400 hover:text-white transition-colors"
                      title="Copy credentials"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs font-medium text-primary-400 hover:text-primary-300 px-3 py-1.5 rounded-lg bg-primary-950/30 hover:bg-primary-950/50 border border-primary-500/30 flex items-center gap-1.5 transition-colors ml-3"
                >
                  <Sparkles className="w-3 h-3" /> Auto-fill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}