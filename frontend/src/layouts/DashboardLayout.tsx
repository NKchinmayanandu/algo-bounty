import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Eye,
  PlusCircle,
  User,
  Sparkles,
  Wallet,
  LogOut,
  X,
  Menu,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: Home, end: true },
  { label: "Live Tasks", path: "/dashboard/tasks", icon: Eye },
  { label: "Create Task", path: "/dashboard/create", icon: PlusCircle },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

export default function DashboardLayout() {
  const { walletAddress, connectWallet, disconnectWallet, user, logout } =
    useAuthStore();
  const navigate = useNavigate();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (!walletInput.trim()) {
      setWalletError("Please enter your wallet address.");
      return;
    }
    setWalletError("");
    setWalletLoading(true);
    try {
      await connectWallet(walletInput.trim());
      setShowWalletModal(false);
      setWalletInput("");
    } catch (err: any) {
      setWalletError("Failed to connect. Check your address and try again.");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sakura-400 to-violet-500 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary leading-none">Bounty Escrow</p>
          <p className="text-[10px] text-text-muted mt-0.5 font-mono">Agent v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-sakura-400/10 text-sakura-300 border border-sakura-400/15"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-800",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={16}
                  className={isActive ? "text-sakura-400" : "text-text-muted group-hover:text-text-secondary"}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={12} className="text-sakura-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-800 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sakura-400 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white uppercase">
              {user?.username?.[0] ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{user?.username ?? "User"}</p>
            <p className="text-[10px] text-text-muted truncate">Bounty Hunter</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-950 font-sans overflow-hidden">
      {/* ─── Desktop Sidebar ─── */}
      <motion.aside
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col w-64 shrink-0 bg-surface-900/80 border-r border-border-subtle"
      >
        <SidebarContent />
      </motion.aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-surface-900 border-r border-border-subtle z-50 md:hidden flex flex-col"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Column ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Header */}
        <header className="shrink-0 h-16 flex items-center justify-between px-4 md:px-6 border-b border-border-subtle bg-surface-950/90 backdrop-blur-md z-30">
          {/* Mobile: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-sakura-400" />
              <span className="text-sm font-semibold text-text-primary hidden sm:block">
                {user?.username ? `Hi, ${user.username}` : "Dashboard"}
              </span>
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="hidden sm:inline">
                    {walletAddress.slice(0, 8)}…{walletAddress.slice(-6)}
                  </span>
                  <span className="sm:hidden">Connected</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-text-muted hover:text-red-400 transition-colors hidden sm:block cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowWalletModal(true)}
                icon={<Wallet size={13} />}
              >
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Wallet</span>
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ─── Wallet Modal ─── */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => {
          setShowWalletModal(false);
          setWalletError("");
          setWalletInput("");
        }}
        title="Connect Algorand Wallet"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Enter your Algorand wallet address to enable on-chain bounty
            interactions.
          </p>
          <Input
            placeholder="ALGO…"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            error={walletError}
            icon={<Wallet size={15} />}
            id="wallet-address-input"
            onKeyDown={(e) => e.key === "Enter" && handleConnectWallet()}
          />
          <Button
            onClick={handleConnectWallet}
            isLoading={walletLoading}
            className="w-full"
          >
            Connect
          </Button>
        </div>
      </Modal>
    </div>
  );
}
