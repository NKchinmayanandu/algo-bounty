import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Coins,
  User,
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle,
  Send,
  GitBranch,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { TaskDetail } from "@/types";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState("");
  
  const [showFundModal, setShowFundModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [escrowAppId, setEscrowAppId] = useState("");

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    if (!id) return;
    try {
      setTask(await taskService.getDetail(parseInt(id)));
    } catch {
      setError("Task not found");
    } finally {
      setLoading(false);
    }
  };

  const doAction = async (fn: () => Promise<void>) => {
    setActionLoading(true);
    setError("");
    try {
      await fn();
      await loadTask();
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-32 bg-surface-800 rounded mb-4" />
        <div className="h-64 bg-surface-900/60 rounded-2xl border border-border-subtle" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-2">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Task not found</h2>
          <p className="text-sm text-text-secondary mt-1">The requested task ID does not exist.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/dashboard/tasks")} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    );
  }

  const isCreator = user?.id === task.creator_user_id;
  const isAssignee = user?.id === task.assignee_user_id;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/dashboard/tasks")}
        className="self-start flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-2 group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to tasks
      </motion.button>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Task View */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card padding="lg" className="flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} />
                <span className="text-[10px] font-mono text-text-muted px-2 py-1 bg-surface-800 rounded-md">
                  #{task.id}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                {task.title}
              </h1>
            </div>
            
            {/* Reward Badge */}
            <div className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-sakura-400/10 border border-sakura-400/20">
              <Coins size={20} className="text-sakura-400" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-sakura-300">{task.reward}</span>
                <span className="text-xs font-semibold text-sakura-400/60 uppercase tracking-widest">ALGO</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-px bg-border-subtle my-2" />

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap text-base">
              {task.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-6 border-t border-border-subtle">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Creator</span>
              <div className="flex items-center gap-2">
                <User size={14} className="text-violet-400" />
                <span className="text-sm font-medium text-text-primary truncate">
                  {task.creator.username}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Assignee</span>
              <div className="flex items-center gap-2">
                <User size={14} className="text-sakura-400" />
                <span className="text-sm font-medium text-text-primary truncate">
                  {task.assignee?.username || "—"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Created</span>
              <div className="flex items-center gap-2 tracking-tight">
                <Clock size={14} className="text-text-muted" />
                <span className="text-sm text-text-secondary">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Contract</span>
              <div className="flex items-center gap-2">
                <Wallet size={14} className="text-emerald-400" />
                <span className="text-sm text-text-secondary font-mono truncate">
                  {task.escrow_app_id ? `#${task.escrow_app_id}` : "—"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Submission Panel */}
      <AnimatePresence>
        {task.submission && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <Card padding="md" className="border-violet-500/20 bg-violet-500/5">
              <CardHeader className="flex flex-row items-center gap-2 mb-4">
                <GitBranch size={18} className="text-violet-400" />
                <CardTitle>Delivery Submission</CardTitle>
              </CardHeader>
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-surface-900 border border-border-subtle">
                    <span className="text-xs font-semibold text-text-muted">Repository</span>
                    <a
                      href={task.submission.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sakura-400 hover:text-sakura-300 flex items-center gap-1 transition-colors truncate"
                    >
                      {task.submission.repo_url}
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-border-subtle">
                    <span className="text-xs font-semibold text-text-muted">Verification Status</span>
                    {task.submission.verification_status === "VERIFIED" ? (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : task.submission.verification_status === "FAILED" ? (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-red-400">
                        <XCircle size={14} /> Failed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {task.submission.report && (
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-900 border border-border-subtle">
                    <span className="text-xs font-semibold text-text-muted">Developer Notes</span>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {task.submission.report}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {isCreator && task.status === "OPEN" && (
          <Button onClick={() => setShowFundModal(true)} isLoading={actionLoading} size="lg">
            <Coins size={16} />
            Fund Escrow
          </Button>
        )}
        
        {!isCreator && task.status === "FUNDED" && (
          <Button
            onClick={() => doAction(() => taskService.claim(task.id).then(() => {}))}
            isLoading={actionLoading}
            size="lg"
          >
            Claim Task
          </Button>
        )}
        
        {isAssignee && task.status === "CLAIMED" && (
          <Button onClick={() => setShowSubmitModal(true)} isLoading={actionLoading} size="lg">
            <Send size={16} />
            Submit Delivery
          </Button>
        )}
        
        {isCreator && task.status === "SUBMITTED" && (
          <Button
            onClick={() => doAction(() => taskService.verify(task.id).then(() => {}))}
            isLoading={actionLoading}
            size="lg"
          >
            <CheckCircle size={16} />
            Mark as Verified
          </Button>
        )}
        
        {isCreator && task.status === "VERIFIED" && (
          <Button
            onClick={() => doAction(() => taskService.release(task.id).then(() => {}))}
            isLoading={actionLoading}
            size="lg"
            className="min-w-fit"
          >
            <Coins size={16} />
            Release Payment
          </Button>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Delivery">
        <div className="flex flex-col gap-5">
          <Input
            label="Repository URL"
            placeholder="https://github.com/..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            id="submit-repo"
            required
          />
          <Textarea
            label="Delivery Notes (Optional)"
            placeholder="Detail the implementation or provide instructions..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            id="submit-report"
          />
          <Button
            onClick={() => doAction(async () => {
              await taskService.submit(task.id, { repo_url: repoUrl, report });
              setShowSubmitModal(false);
            })}
            isLoading={actionLoading}
            className="w-full mt-2"
          >
            Submit for Review
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showFundModal} onClose={() => setShowFundModal(false)} title="Fund Smart Escrow">
        <div className="flex flex-col gap-5">
          <Input
            label="Transaction Hash"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            id="fund-tx"
            required
          />
          <Input
            label="Contract App ID"
            type="number"
            placeholder="e.g. 123456"
            value={escrowAppId}
            onChange={(e) => setEscrowAppId(e.target.value)}
            id="fund-app"
            required
          />
          <Button
            onClick={() => doAction(async () => {
              await taskService.fund(task.id, { tx_hash: txHash, escrow_app_id: parseInt(escrowAppId) });
              setShowFundModal(false);
            })}
            isLoading={actionLoading}
            className="w-full mt-2"
          >
            Lock Funds
          </Button>
        </div>
      </Modal>
    </div>
  );
}