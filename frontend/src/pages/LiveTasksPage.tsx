import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Coins, Filter, LayoutGrid } from "lucide-react";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Task } from "@/types";

const statuses = [
  "ALL",
  "OPEN",
  "FUNDED",
  "CLAIMED",
  "SUBMITTED",
  "VERIFIED",
  "PAID",
];

export default function LiveTasksPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    taskService
      .list()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTaskClick = (taskId: number) => {
    if (!isAuthenticated) navigate("/login");
    else navigate(`/dashboard/tasks/${taskId}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Live Tasks</h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse available bounties and start earning Algorand.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-surface-900/40 p-4 rounded-2xl border border-border-subtle">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
            id="search-tasks"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Filter size={16} className="text-text-muted shrink-0 mx-1" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={[
                "px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0",
                filterStatus === s
                  ? "bg-sakura-400 text-white shadow-md shadow-sakura-400/20"
                  : "bg-surface-800 text-text-secondary hover:text-text-primary hover:bg-surface-700",
              ].join(" ")}
            >
              {s === "ALL" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-surface-900/60 border border-border-subtle p-6 flex flex-col gap-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="w-20 h-6 bg-surface-800 rounded-full" />
                <div className="w-12 h-4 bg-surface-800 rounded" />
              </div>
              <div className="w-3/4 h-6 bg-surface-800 rounded mt-2" />
              <div className="w-full h-16 bg-surface-800 rounded mt-1" />
              <div className="mt-auto flex justify-between pt-4 border-t border-border-subtle">
                <div className="w-16 h-5 bg-surface-800 rounded" />
                <div className="w-20 h-4 bg-surface-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-4">
            <LayoutGrid size={24} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            No tasks found
          </h3>
          <p className="text-sm text-text-secondary">
            Adjust your search or filter settings.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.map((task, i) => (
              <motion.button
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => handleTaskClick(task.id)}
                className="group text-left flex flex-col h-full bg-surface-900/60 border border-border-subtle hover:border-sakura-400/30 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-sakura-400/5 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4 w-full">
                  <StatusBadge status={task.status} />
                  <span className="text-[10px] font-mono text-text-muted">
                    #{task.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-sakura-300 transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                  {task.description}
                </p>
                <div className="mt-auto w-full pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Coins size={14} />
                    <span className="text-sm font-bold">{task.reward} ALGO</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}