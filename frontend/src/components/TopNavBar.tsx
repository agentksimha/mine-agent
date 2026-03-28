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
    <header className="fixed top-0 w-full z-50 glass-panel shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <Shield className="text-on-primary w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-primary font-headline">
              Sentinel Oversight
            </span>
          </div>
          
          <nav className="hidden md:flex gap-6 items-center">
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
        </div>

       
      </div>
      <div className="bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent h-[1px] absolute bottom-0 w-full" />
    </header>
  );
};
