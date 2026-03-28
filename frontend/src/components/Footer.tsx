import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 border-t border-outline-variant/10 bg-surface mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full gap-6">
        <span className="text-lg font-semibold text-slate-300 font-headline">Sentinel Oversight</span>
        <div className="flex flex-wrap justify-center gap-8">
          {['Privacy Policy', 'Safety Protocols', 'System Status', 'Contact Support'].map((link) => (
            <a 
              key={link}
              href="#" 
              className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-tertiary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="font-body text-xs uppercase tracking-widest text-slate-500">
          © 2024 Sentinel Oversight. Industrial Guardian Grade.
        </p>
      </div>
    </footer>
  );
};
