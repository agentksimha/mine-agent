import React, { useState } from 'react';
import { BarChart3, Download, FileText, Calendar, MapPin, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export const AuditScreen: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedState, setSelectedState] = useState('Western Australia');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedHazard, setSelectedHazard] = useState('All Major Hazards');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/audit_report_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: selectedState,
          year: selectedYear,
          hazard_type: selectedHazard
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Audit_Report_${selectedState.replace(/\s+/g, '_')}_${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error generating audit report:', error);
      alert('Failed to generate audit report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center relative overflow-hidden py-20">
      {/* Subterranean Texture Background */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high mb-6 border border-outline-variant/10">
            <BarChart3 className="text-tertiary w-8 h-8" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">Audit Intelligence</h1>
          <p className="text-slate-400 font-body text-lg max-w-xl mx-auto">
            Generate high-fidelity safety compliance reports powered by real-time sensor data and historical incident logs.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* State Selection */}
            <div className="space-y-3">
              <label className="block font-label text-[10px] uppercase tracking-widest text-slate-500 font-semibold">State / Region</label>
              <div className="relative">
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-0 appearance-none font-headline font-medium transition-all group-hover:bg-surface-container shadow-inner"
                >
                  <option value="Western Australia">Western Australia</option>
                  <option value="Queensland">Queensland</option>
                  <option value="Nevada, USA">Nevada, USA</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline w-4 h-4" />
              </div>
            </div>
            {/* Year Selection */}
            <div className="space-y-3">
              <label className="block font-label text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Audit Fiscal Year</label>
              <div className="relative">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-0 appearance-none font-headline font-medium transition-all group-hover:bg-surface-container shadow-inner"
                >
                  <option value="2024">2024 (Current)</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline w-4 h-4" />
              </div>
            </div>
            {/* Hazard Type Selection */}
            <div className="space-y-3">
              <label className="block font-label text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Hazard Focus Area</label>
              <div className="relative">
                <select 
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-0 appearance-none font-headline font-medium transition-all group-hover:bg-surface-container shadow-inner"
                >
                  <option value="All Major Hazards">All Major Hazards</option>
                  <option value="Structural Integrity">Structural Integrity</option>
                  <option value="Atmospheric Conditions">Atmospheric Conditions</option>
                </select>
                <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline w-4 h-4" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary to-primary-container py-5 rounded-xl text-on-primary font-headline font-bold text-lg tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Generate & Download Audit Report
          </button>

          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-500">
              <div className="w-20 h-20 relative mb-8">
                <div className="absolute inset-0 border-4 border-tertiary/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-tertiary rounded-full animate-spin" />
              </div>
              <div className="text-center space-y-3">
                <p className="font-headline text-xl font-bold text-on-surface">Analyzing safety records...</p>
                <p className="font-body text-slate-400 text-sm">Cross-referencing 50,000+ incident logs.</p>
              </div>
              <div className="w-64 h-1.5 bg-surface-container-highest rounded-full mt-8 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3 }}
                  className="h-full bg-tertiary shadow-[0_0_15px_rgba(64,220,209,0.5)]" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Recent Audits */}
        <div className="mt-16">
          <h2 className="font-headline text-sm uppercase tracking-widest text-outline mb-6">Recent System Audits</h2>
          <div className="space-y-4">
            {[
              { title: 'Annual Compliance Review Q1', meta: 'March 14, 2024 • Western Australia' },
              { title: 'Methane Levels Anomaly Report', meta: 'Feb 28, 2024 • Nevada, USA' }
            ].map((audit, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-xl hover:bg-surface-container-low transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                    <FileText className="text-tertiary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-on-surface">{audit.title}</h4>
                    <p className="text-[10px] font-label text-slate-500 uppercase">{audit.meta}</p>
                  </div>
                </div>
                <button className="text-slate-500 group-hover:text-primary transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
