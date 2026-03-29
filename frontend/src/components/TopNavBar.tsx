import React from 'react';
import { 
  Home, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Settings, 
  User,
  Shield
} from 'lucide-react';
import ClickSpark from '../designs/click';


interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'alerts', label: 'Risk Alerts', icon: AlertTriangle },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent">
      <div className="grid grid-cols-3 items-center w-full px-8 py-4 max-w-full mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-xl font-bold tracking-tighter text-primary font-headline">
            MineRakshak
          </span>
        </div>

        {/* Center: Nav Menu */}
        <ClickSpark>
        <nav className="hidden md:flex gap-6 items-center justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`font-headline text-sm font-medium tracking-wide transition-colors relative pb-1 ${
                activeTab === item.id 
                  ? 'text-primary' 
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
        {/* Right: Empty spacer for symmetry */}
        <div />
      </div>
    </header>
  );
};
