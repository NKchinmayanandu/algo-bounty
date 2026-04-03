import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  FileText,
  Type,
  ArrowRight,
  CheckCircle,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { taskService } from "@/services/tasks.service";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { isAuthenticated, walletAddress, connectWallet } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!walletAddress) { setShowWalletModal(true); return; }

    setError("");
    setLoading(true);
    try {
      const task = await taskService.create({
        title,
        description,
        reward: parseFloat(reward),
      });
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/tasks/${task.id}`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    if (!walletInput.trim()) { setWalletError("Please enter your wallet address."); return; }
    setWalletError("");
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
    } catch {
      setWalletError("Failed to connect. Check your address.");
    } finally {
      setWalletLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center"
          >
            <CheckCircle size={36} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary">Task Created!</h2>
          <p className="text-text-secondary">Redirecting to your task…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create a Bounty</h1>
        <p className="text-text-secondary text-sm mt-1">
          Define your task and set a reward. Funds will be held in on-chain escrow.
        </p>
      </div>

      {/* Main form area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form — takes 2/3 */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="lg:col-span-2 flex flex-col gap-6 bg-surface-900/60 border border-border-subtle rounded-2xl p-6 md:p-8"
          id="create-task-form"
        >
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Input
            label="Task Title"
            placeholder="e.g., Build a landing page for DeFi app"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<Type size={15} />}
            required
            id="task-title"
          />

          <Textarea
            label="Description"
            placeholder="Describe the requirements, deliverables, and acceptance criteria in detail…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            id="task-description"
          />

          <Input
            label="Reward (ALGO)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="10.00"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            icon={<Coins size={15} />}
            required
            id="task-reward"
            hint="This amount will be locked in escrow until the task is verified."
          />

          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full mt-2"
          >
            <FileText size={16} />
            Create Bounty
            <ArrowRight size={16} />
          </Button>
        </motion.form>

        {/* Sidebar info panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-4 lg:max-w-xs w-full"
        >
          {/* Wallet status card */}
          <div className="bg-surface-900/60 border border-border-subtle rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-text-primary">Algorand Wallet</p>
            {walletAddress ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-mono text-emerald-400 truncate">
                  {walletAddress.slice(0, 10)}…{walletAddress.slice(-8)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-800 border border-border-subtle">
                  <Wallet size={14} className="text-text-muted shrink-0" />
                  <span className="text-xs text-text-muted">Not connected</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWalletModal(true)}
                  className="w-full"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="bg-surface-900/60 border border-border-subtle rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-primary">Tips</p>
            {[
              "Be specific about deliverables so contributors know what to build.",
              "Set a fair reward — higher rewards attract better contributors.",
              "Funds are escrowed and only released after your verification.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 text-sakura-400 shrink-0">✦</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wallet Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => { setShowWalletModal(false); setWalletError(""); }}
        title="Connect Algorand Wallet"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Enter your Algorand wallet address to create and fund bounties.
          </p>
          <Input
            placeholder="ALGO wallet address"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            error={walletError}
            icon={<Wallet size={15} />}
            id="wallet-address-input"
            onKeyDown={(e) => e.key === "Enter" && handleConnectWallet()}
          />
          <Button onClick={handleConnectWallet} isLoading={walletLoading} className="w-full">
            Connect Wallet
          </Button>
        </div>
      </Modal>
    </div>
  );
}