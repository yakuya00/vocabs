import { useState } from "react";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

interface AuthCardProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onRegister: (email: string, pass: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export function AuthCard({
  onLogin,
  onRegister,
  error,
  loading,
}: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      await onRegister(email, password);
    } else {
      await onLogin(email, password);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-sm text-slate-400">
          {isSignUp
            ? "Start memorizing vocabulary with active recall"
            : "Log in to continue your practice"}
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3.5 top-3 text-slate-500"
              size={18}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-3 text-slate-500"
              size={18}
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>{isSignUp ? "Sign up" : "Log in"}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span className="text-indigo-400 underline ml-1">Log in</span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span className="text-indigo-400 underline ml-1">
                Sign up now
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
