import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Star, Coins, Clock, Wallet, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/hooks/useAuthStore";
import { userService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, walletAddress, connectWallet, disconnectWallet, logout } = useAuthStore();
  
  const [history, setHistory] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    userService.getHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    if (!walletInput.trim()) return;
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
    } catch {
      /* ignore */
    } finally {
      setWalletLoading(false);
    }
  };

  const created = history.filter((t) => t.creator_user_id === user?.id);
  const assigned = history.filter((t) => t.assignee_user_id === user?.id);
  const totalEarned = assigned
    .filter((t) => t.status === "PAID")
    .reduce((sum, t) => sum + t.reward, 0);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary">Profile Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your identity, wallet, and track your bounty history.</p>
      </motion.div>

      {/* Top Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Identity Card (Takes up 2/3 of space on desktop) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card padding="lg" className="h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400 to-violet-500 shadow-xl shadow-sakura-400/20 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-white uppercase">{user?.username?.[0] ?? "U"}</span>
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-text-primary mb-2 truncate">{user?.username}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-800">
                    <Star size={14} className="text-amber-400" />
                    <span className="font-medium text-text-primary">{user?.rating_avg?.toFixed(1) || "5.0"}</span>
                    <span className="text-xs text-text-muted">({user?.rating_count || 12} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-800">
                    <Clock size={14} className="text-text-muted" />
                    Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                  </span>
                </div>

                {/* Stats row inside identity card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-surface-800/50 border border-border-subtle">
                    <span className="text-xs text-text-muted font-medium">Bounties Created</span>
                    <span className="text-xl font-bold text-text-primary">{created.length}</span>
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-surface-800/50 border border-border-subtle">
                    <span className="text-xs text-text-muted font-medium">Tasks Completed</span>
                    <span className="text-xl font-bold text-text-primary">{assigned.length}</span>
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-sakura-400/5 border border-sakura-400/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none"><Coins size={32} /></div>
                    <span className="text-xs text-sakura-400 font-medium">Total Earned</span>
                    <span className="text-xl font-bold text-sakura-300">{totalEarned.toFixed(2)} ALGO</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-5 border-t border-border-subtle flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <LogOut size={16} /> Sign Out
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Wallet Settings Card (Takes up 1/3 of space on desktop) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-1">
          <Card padding="md" className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-violet-400" />
                <CardTitle>Vault Settings</CardTitle>
              </div>
            </CardHeader>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
              {walletAddress ? (
                <>
                  <div className="flex items-center justify-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
                    <CheckCircle size={28} className="text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-text-primary mb-1">Wallet Connected</p>
                    <p className="text-xs text-emerald-400 font-mono bg-surface-900 border border-border-subtle p-2 rounded-lg break-all max-w-full overflow-hidden">
                      {walletAddress}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={disconnectWallet} className="mt-auto w-full">
                    Disconnect Wallet
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center p-4 rounded-xl bg-surface-800 border border-border-subtle mb-2">
                    <Wallet size={28} className="text-text-muted" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-text-primary mb-1">No Wallet Attached</p>
                    <p className="text-xs text-text-secondary">Connect an Algorand wallet to receive bounty payments.</p>
                  </div>
                  <Button onClick={() => setShowWalletModal(true)} className="mt-auto w-full">
                    Connect Wallet
                  </Button>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Task History Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-xl font-bold text-text-primary mb-4">Activity History</h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-surface-900/60 border border-border-subtle animate-pulse" />)}
          </div>
        ) : history.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
            <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
              <Coins size={24} className="text-text-muted" />
            </div>
            <h4 className="text-lg font-semibold text-text-primary mb-1">No Activity Yet</h4>
            <p className="text-sm text-text-secondary max-w-sm">When you create or complete bounties, they will appear here.</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate("/dashboard/tasks")}>Browse Bounties</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {history.map((task, i) => (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                  className="group text-left p-5 rounded-2xl bg-surface-900/60 border border-border-subtle hover:border-sakura-400/30 transition-all duration-200 hover:shadow-lg hover:shadow-sakura-400/5 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-3 w-full">
                    <StatusBadge status={task.status} />
                    <span className="text-[10px] font-mono text-text-muted px-2 py-1 bg-surface-800 rounded-md">#{task.id}</span>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-text-primary line-clamp-2 mb-4 group-hover:text-sakura-300 transition-colors">
                    {task.title}
                  </h4>
                  
                  <div className="mt-auto w-full pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
                      {task.creator_user_id === user?.id ? "Created" : "Assigned"}
                    </span>
                    <span className="text-sm font-bold text-sakura-400">{task.reward} ALGO</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Wallet Modal */}
      <Modal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} title="Connect Wallet" size="sm">
        <div className="flex flex-col gap-5">
          <p className="text-sm text-text-secondary">Enter your Algorand wallet address to link it to your account.</p>
          <Input
            placeholder="ALGO wallet address"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            id="profile-wallet"
            icon={<Wallet size={15}/>}
            autoFocus
          />
          <Button onClick={handleConnect} isLoading={walletLoading} className="w-full">
            Link Wallet Address
          </Button>
        </div>
      </Modal>
    </div>
  );
}