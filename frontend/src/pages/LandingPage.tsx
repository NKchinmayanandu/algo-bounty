import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useRef } from "react";
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

/* ─────────────────────────────────────────────
   Landing Page — rebuilt from scratch
   Rules:
   - No absolute layout positioning
   - text-center max-w-3xl mx-auto on all headings
   - flex gap-4 justify-center on CTA rows
   - Subtle framer-motion animations
───────────────────────────────────────────── */

const features = [
  {
    icon: Shield,
    title: "Smart Escrow",
    desc: "Funds locked in Algorand smart contracts and released only after verified completion.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    desc: "Verified submissions trigger automated payment — no intermediary, no delays.",
  },
  {
    icon: Lock,
    title: "Trustless by Design",
    desc: "Neither party can run away. The protocol enforces fair outcomes mathematically.",
  },
];

const stats = [
  { value: "100%", label: "On-chain Escrow" },
  { value: "0", label: "Trust Required" },
  { value: "<2s", label: "Settlement Time" },
];

const steps = [
  { num: "01", title: "Create Task", desc: "Post your bounty with a description and reward amount in ALGO." },
  { num: "02", title: "Fund Escrow", desc: "Connect wallet and lock funds into a tamper-proof smart contract." },
  { num: "03", title: "Claim & Submit", desc: "Contributors claim the task and submit work for review." },
  { num: "04", title: "Verify & Release", desc: "Creator verifies delivery and funds are automatically released." },
];

function GradientOrb({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={["absolute rounded-full blur-[120px] pointer-events-none", className].join(" ")}
    />
  );
}

function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, -40]);

  return (
    <div className="min-h-screen bg-surface-950 font-sans overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-surface-950/80 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sakura-400 to-violet-500 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-text-primary">Bounty Escrow</span>
            <span className="text-[10px] font-mono text-text-muted hidden sm:block">Agent</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Button size="sm" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen pt-16 overflow-hidden"
      >
        {/* Ambient orbs */}
        <GradientOrb className="w-[600px] h-[600px] bg-sakura-400/8 top-1/4 right-0 translate-x-1/4" />
        <GradientOrb className="w-[500px] h-[500px] bg-violet-500/8 bottom-1/4 left-0 -translate-x-1/4" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-8 py-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sakura-400/8 border border-sakura-400/20 text-sakura-300 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-sakura-400 animate-pulse" />
              Powered by Algorand Smart Contracts
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-text-primary">
              Trustless Bounty
              <br />
              <span className="bg-gradient-to-r from-sakura-400 to-violet-400 bg-clip-text text-transparent">
                Escrow
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-center max-w-3xl mx-auto text-lg text-text-secondary leading-relaxed"
          >
            Eliminate trust issues in open bounty platforms with automated
            escrow agents. Secure, transparent, and fully on-chain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/dashboard/create")}
              className="min-w-[180px]"
            >
              Create Task
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/dashboard/tasks")}
              className="min-w-[180px]"
            >
              View Active Tasks
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-text-primary">{s.value}</span>
                <span className="text-xs text-text-muted">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="text-text-muted/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 px-6 relative">
        <div className="w-full max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-mono text-sakura-400/60 uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="text-4xl font-bold text-text-primary">
                Built for fairness
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1} className="h-full">
                <div className="h-full flex flex-col gap-4 p-7 rounded-2xl bg-surface-900/60 border border-border-subtle hover:border-sakura-400/20 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-sakura-400/10 border border-sakura-400/20 flex items-center justify-center text-sakura-400 group-hover:bg-sakura-400/15 transition-colors shrink-0">
                    <f.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-6 relative">
        <GradientOrb className="w-[500px] h-[500px] bg-violet-500/5 top-0 right-0" />
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          <ScrollReveal className="self-center">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-mono text-sakura-400/60 uppercase tracking-widest mb-3">
                The process
              </p>
              <h2 className="text-4xl font-bold text-text-primary">
                Four steps to trustless payment
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1} className="h-full">
                <div className="h-full flex flex-col gap-3 p-6 rounded-2xl bg-surface-900/40 border border-border-subtle">
                  <span className="text-3xl font-bold text-sakura-400/30">
                    {step.num}
                  </span>
                  <h3 className="text-base font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-24 px-6">
        <div className="w-full max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden border border-sakura-400/15 bg-gradient-to-br from-sakura-400/5 to-violet-500/10 p-12 flex flex-col items-center text-center gap-6">
              <GradientOrb className="w-[400px] h-[400px] bg-sakura-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-text-primary">
                  Ready to build without trust issues?
                </h2>
                <p className="text-text-secondary text-lg">
                  Start posting bounties or contribute to existing tasks today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => navigate("/register")} className="min-w-[180px]">
                    Get Started Free
                    <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/dashboard/tasks")}
                    className="min-w-[180px]"
                  >
                    Browse Tasks
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
                  {["No credit card", "Open source", "Fully on-chain"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check size={14} className="text-sakura-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border-subtle py-10 px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sakura-400 to-violet-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-text-primary">Bounty Escrow Agent</span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Bounty Escrow Agent. Built on Algorand.
          </p>
        </div>
      </footer>
    </div>
  );
}