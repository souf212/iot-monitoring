// Modern Login Page with Dark Theme
import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Eye, EyeOff, Activity } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ username, password });
      setSuccess(true);
      // Wait for success animation before navigating
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Erreur login :", err);
      setError("Username ou mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-900 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative glass-card p-1 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
      >
        <div className="bg-background-800/80 p-8 rounded-xl backdrop-blur-xl border border-white/5 relative">

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10 relative"
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 text-white"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <motion.path
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-500 rounded-full"
                  />
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Welcome Back!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-muted"
                >
                  Redirecting to dashboard...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl shadow-lg shadow-primary-500/20"
                  >
                    <Activity size={32} className="text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent mb-2">
                    IoT Climate Monitor
                  </h1>
                  <p className="text-muted text-sm">
                    Connectez-vous pour accéder au dashboard
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider ml-1">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background-900/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-background-900/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pr-12 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary-400 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-muted">
                    Secure Access • IoT Monitoring System v2.0
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;

