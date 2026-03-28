import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Brain, Bell, MessageSquare, FileCheck, Network, Activity, AlertOctagon, Droplets } from 'lucide-react';

export const HomeScreen: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/mine-industrial/1920/1080?grayscale&blur=2" 
            alt="Mine" 
            className="w-full h-full object-cover opacity-30 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
        </div>

        <div className="max-w-7xl w-full px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
          
            
            <h1 className="font-headline font-extrabold text-6xl md:text-[5.5rem] leading-[0.95] tracking-tight text-on-surface">
              Welcome to <br/>
              <span className="bg-gradient-to-r from-primary via-primary-container to-primary text-transparent bg-clip-text">Mine Agent</span>
            </h1>
            
            <p className="font-body text-xl text-slate-400 max-w-xl leading-relaxed font-light">
              The definitive AI-powered industrial cockpit for high-stakes mining oversight. Mine Agent leverages deep-learning neural networks to anticipate geological hazards before they materialize, ensuring unmatched safety for your workforce.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={onLaunch}
                className="safety-glow text-on-primary px-10 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase flex items-center gap-4 hover:translate-x-1 transition-all"
              >
                    Check  Alerts
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:block h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[420px] glass-panel rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
              <div className="p-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="px-3 py-1 bg-primary/20 rounded border border-primary/30 text-[10px] font-bold text-primary tracking-widest">REAL-TIME TELEMETRY</div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[32px] font-headline font-extrabold text-on-surface tracking-tighter">0.024<span className="text-lg opacity-50">μS</span></div>
                    <div className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase">Seismic Variance</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-12 relative overflow-hidden bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-4 mb-2">
              <div className="w-10 h-[1px] bg-primary-container" />
              <span className="text-primary-container font-bold tracking-[0.5em] text-[10px] uppercase">Core Capabilities</span>
              <div className="w-10 h-[1px] bg-primary-container" />
            </div>
            <h2 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight">Engineered for Extremes</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">Precision safety protocols integrated into every facet of the subterranean ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-surface-container-low p-10 rounded-[2.5rem] border border-white/5 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Brain className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="font-headline font-extrabold text-3xl">Neural Risk Assessment</h4>
                <p className="text-slate-400 text-lg font-light leading-relaxed">Continuous processing of high-fidelity structural and environmental data streams via deep-learning clusters.</p>
              </div>
              <div className="flex gap-8 pt-6 border-t border-white/5">
                <div>
                  <div className="text-[10px] font-bold text-primary tracking-widest uppercase">LATENCY</div>
                  <div className="text-xl font-bold">0.4ms</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-primary tracking-widest uppercase">NODES</div>
                  <div className="text-xl font-bold">14.2k</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-6">
              <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-white/5 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                    <Bell className="text-tertiary w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Live Edge Status</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-2xl mb-2">Global Edge Alerts</h4>
                  <p className="text-slate-500 text-sm">Millisecond-grade critical notifications dispatched to hardware nodes globally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Omnipresent Oversight */}
      <section className="py-48 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 text-center mb-32">
          <div className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black tracking-[0.4em] uppercase inline-block mb-8">The Crown Jewel</div>
          <h2 className="font-headline font-extrabold text-6xl md:text-7xl tracking-tighter">Omnipresent Oversight</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light mt-8">Experience the synergy of high-fidelity monitoring and predictive intelligence.</p>
        </div>

        <div className="relative h-[600px] flex justify-center items-center">
          <div className="absolute z-30 flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 rounded-full glass-panel bg-primary/20 flex items-center justify-center border-primary/40 relative">
              <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping" />
              <Network className="text-primary w-10 h-10" />
            </div>
          </div>
          
          <div className="absolute w-[850px] h-[550px] bg-primary/5 rounded-[4rem] blur-[100px] -z-10" />
          
          {/* Floating UI Cards */}
          <div className="absolute left-1/4 top-1/4 glass-panel p-6 rounded-2xl w-56 border border-white/10 animate-float">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-tertiary w-4 h-4" />
              <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">System Integrity</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-tertiary w-[94%]" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-tertiary">
              <span>OPERATIONAL</span>
              <span>94%</span>
            </div>
          </div>

          <div className="absolute right-1/4 bottom-1/4 glass-panel p-6 rounded-2xl w-64 border border-error/30 animate-float" style={{ animationDelay: '2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertOctagon className="text-error w-4 h-4" />
              <span className="text-[11px] font-bold tracking-widest text-error uppercase">Critical Anomalies</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center">
                  <Droplets className="text-error w-4 h-4" />
                </div>
                <div className="text-xs font-bold">Abnormal seepage in Sector 12</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-12 bg-surface-container-low">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-surface-container-lowest p-24 border border-white/10 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="relative z-10 space-y-10">
            <h2 className="font-headline font-extrabold text-6xl md:text-7xl mb-8 tracking-tighter">
              Secure Your <br/>Subterranean Legacy
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mb-12 font-light leading-relaxed">
              Join the vanguard of the world's most elite industrial operations. Deploy Sentinel Oversight and gain absolute visibility over your workforce.
            </p>
            <button 
              onClick={onLaunch}
              className="safety-glow text-on-primary px-14 py-6 rounded-3xl font-black text-sm tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl"
            >
              Acquire System Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
