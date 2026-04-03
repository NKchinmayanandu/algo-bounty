import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  PlusCircle,
  TrendingUp,
  Shield,
  ArrowRight,
  Zap,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/hooks/useAuthStore";

const quickActions = [
  {
    icon: Eye,
    title: "Browse Tasks",
    desc: "Explore active bounties, claim work, and earn ALGO.",
    actionLabel: "View Tasks",
    path: "/dashboard/tasks",
    accent: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20 group-hover:bg-violet-500/15",
  },
  {
    icon: PlusCircle,
    title: "Create Bounty",
    desc: "Post a new task with trustless escrow funding.",
    actionLabel: "Create Now",
    path: "/dashboard/create",
    accent: "text-sakura-400",
    bg: "bg-sakura-400/10 border-sakura-400/20 group-hover:bg-sakura-400/15",
  },
];

const platformStats = [
  {
    icon: Shield,
    label: "Contract Type",
    value: "Smart Escrow",
    accent: "text-emerald-400",
  },
  {
    icon: TrendingUp,
    label: "Blockchain",
    value: "Algorand",
    accent: "text-violet-400",
  },
  {
    icon: Activity,
    label: "Settlement",
    value: "< 2 seconds",
    accent: "text-sakura-400",
  },
  {
    icon: Zap,
    label: "Verification",
    value: "Automated AI",
    accent: "text-amber-400",
  },
];

export default function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-sakura-400 to-violet-400 bg-clip-text text-transparent">
              {user?.username ?? "Hunter"}
            </span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            What would you like to do today?
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/dashboard/profile")}
        >
          View Profile
          <ArrowRight size={14} />
        </Button>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            onClick={() => navigate(action.path)}
            className="group text-left flex flex-col gap-5 p-6 rounded-2xl bg-surface-900/60 border border-border-subtle hover:border-sakura-400/20 transition-all duration-200 cursor-pointer"
          >
            <div
              className={[
                "w-12 h-12 rounded-xl border flex items-center justify-center transition-colors shrink-0",
                action.bg,
              ].join(" ")}
            >
              <action.icon size={22} className={action.accent} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {action.desc}
              </p>
            </div>
            <div className={["flex items-center gap-1.5 text-sm font-medium", action.accent].join(" ")}>
              {action.actionLabel}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Platform stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">
          Platform Info
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-surface-900/40 border border-border-subtle"
            >
              <stat.icon size={16} className={`${stat.accent} shrink-0`} />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted">{stat.label}</p>
                <p className="text-xs font-semibold text-text-primary break-words">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Getting started hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-sakura-400/5 border border-sakura-400/15"
      >
        <Zap size={16} className="text-sakura-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-text-primary">Quick start</p>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
            Connect your Algorand wallet using the button in the header, then
            create your first bounty or browse live tasks to earn ALGO.
          </p>
        </div>
      </motion.div>
    </div>
  );
}