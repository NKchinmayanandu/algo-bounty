import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(username, password);
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sakura-400/5 rounded-full blur-[60px] sm:blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sakura-400 to-violet-500 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-text-primary text-sm">Bounty Escrow</span>
        </Link>
        <Link
          to="/login"
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Have an account? <span className="text-sakura-400 font-medium">Sign in →</span>
        </Link>
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create Account
            </h1>
            <p className="text-text-secondary text-sm">
              Join the trustless bounty ecosystem on Algorand
            </p>
          </div>

          {/* Form card */}
          <div className="w-full bg-surface-900/80 border border-border-subtle rounded-2xl p-8 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              id="register-form"
              noValidate
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm flex items-start gap-2"
                >
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </motion.div>
              )}

              <Input
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User size={15} />}
                required
                autoComplete="username"
                id="register-username"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password (min. 4 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={15} />}
                required
                autoComplete="new-password"
                id="register-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={15} />}
                required
                autoComplete="new-password"
                id="register-confirm-password"
              />

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full mt-2"
              >
                Create Account
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sakura-400 hover:text-sakura-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}