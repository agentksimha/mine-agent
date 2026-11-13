import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Menu,
  X,
  LogOut,
  Newspaper
} from 'lucide-react';
import ClickSpark from '../designs/click';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'alerts', label: 'Updates', icon: Newspaper },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent">
      <div className="flex items-center justify-between w-full px-6 md:px-8 py-4 max-w-full mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
          <span className="text-xl font-bold tracking-tighter text-orange-400 font-headline">
            MineRakshak
          </span>
        </div>

        {/* Center: Desktop Nav Menu */}
        <ClickSpark>
          <nav className="hidden md:flex gap-6 items-center justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-headline text-sm font-medium tracking-wide transition-colors relative pb-1 ${
                  activeTab === item.id 
                    ? 'text-orange-400' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-container" />
                )}
              </button>
            ))}
          </nav>
        </ClickSpark>
        
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="max-w-32 truncate text-xs font-semibold text-slate-200">{user?.name}</p>
            <p className="max-w-32 truncate text-[10px] text-slate-500">{user?.email}</p>
          </div>
          <button onClick={() => logout()} aria-label="Sign out" title="Sign out" className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full right-4 w-56 bg-[#111114]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <button onClick={() => logout()} className="w-full flex items-center gap-3 border-t border-white/10 px-5 py-3.5 text-sm font-medium text-red-300 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
