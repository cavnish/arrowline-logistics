import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";

import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await adminApi.post("/login", {
        email: email.trim(),
        password,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Login failed."
        );
      }

      // Verify that the backend actually created the session.
      await adminApi.get("/me");

      navigate(
        "/arrowline-admin/dashboard",
        { replace: true }
      );

    } catch (err) {
      console.error("Admin login error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid admin email or password.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2B4FA3] p-8 text-center">

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
              <span className="text-3xl font-black text-white">
                AL
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white">
              Admin Portal
            </h1>

            <p className="text-blue-100 text-sm mt-1">
              Arrowline Logistics
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-5"
          >

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>

              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Admin Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition"
                  placeholder="admin@arrowlinelogistics.in"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Admin Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition"
                  placeholder="Enter admin password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A8A] hover:bg-[#152d6b] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />

                  <span>
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Login
                  </span>

                  <ArrowRight size={18} />
                </>
              )}

            </button>

            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <Lock size={12} />
              Secure administrator access
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}