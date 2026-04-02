import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Eye, PlusCircle, User, Sparkles, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/dashboard', icon: Home, end: true },
  { label: 'Live Tasks', path: '/dashboard/tasks', icon: Eye },
  { label: 'Create Task', path: '/dashboard/create', icon: PlusCircle },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-64 border-r border-border-subtle bg-surface-900/50 backdrop-blur-sm"
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border-subtle">
          <a href="/" className="flex items-center gap-2">
            <Sparkles size={18} className="text-sakura-400" />
            <span className="text-lg font-bold text-gradient-sakura">Bounty Escrow</span>
          </a>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-sakura-400/10 text-sakura-300 border border-sakura-400/15'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-800'
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
              <ChevronRight size={14} className="ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-6 py-4 border-t border-border-subtle">
          <p className="text-xs text-text-muted">Built on Algorand</p>
        </div>
      </motion.aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900/90 backdrop-blur-xl border-t border-border-subtle">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors
                ${isActive ? 'text-sakura-400' : 'text-text-muted'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
