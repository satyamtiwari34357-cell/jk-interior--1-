import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (
    token: string,
    user: { email: string; name: string; role: string },
  ) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setErrorMsg(
          data.error ||
            "Invalid credentials. Please verify your email and password.",
        );
      }
    } catch (err) {
      setErrorMsg("Network error. Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center p-4 selection:bg-[#c5a880] selection:text-black">
      <div className="w-full max-w-md bg-[#121319] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-7 relative">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center mx-auto border border-[#c5a880]/20">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif text-[#fbf9f5] tracking-wide">
            JK Interior CMS
          </h2>
          <p className="text-xs text-[#9f9b90]">
            Secure Internal Studio Management System
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1.5 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="studio@yourdomain.com"
                className="w-full bg-[#181a22] border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#c5a880] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181a22] border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#c5a880] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#c5a880]/15"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Studio CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Studio notice */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#78746c]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Encrypted Session</span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#9f9b90] hover:text-white transition-colors"
          >
            ← Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};
