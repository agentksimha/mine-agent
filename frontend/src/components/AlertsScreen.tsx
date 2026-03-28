import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  time: string;
  hazardType: string;
  analysis: string;
  recommendedActions: string;
  link: string;
}

const sampleAlerts: AlertData[] = [
  {
    id: 'sample-1',
    type: 'critical',
    title: 'High Methane Concentration Detected in Shaft 4',
    time: new Date().toISOString(),
    hazardType: 'Gas Leak / Explosion Risk',
    analysis: 'Real-time sensors indicate a rapid spike in CH4 levels exceeding 1.5% in ventilation shaft 4. The rate of accumulation suggests a potential pocket breach in the adjacent unmined seam.',
    recommendedActions: '1. Immediately execute emergency evacuation of all personnel in Sector 4 and adjoining Shaft 5.\n2. Override ventilation fans to maximum exhaust capacity.\n3. De-energize all non-intrinsically safe equipment in the affected zones.',
    link: '#'
  },
  {
    id: 'sample-2',
    type: 'warning',
    title: 'Abnormal Seismic Activity - Pillar Stress',
    time: new Date(Date.now() - 3600000).toISOString(),
    hazardType: 'Structural Collapse',
    analysis: 'Micro-seismic monitoring network has recorded a cluster of high-frequency acoustic emissions near the main haulage drift pillars. Data indicates increasing load stress approaching yield limits.',
    recommendedActions: '1. Restrict heavy machinery movement in the haulage drift.\n2. Dispatch engineering team to install additional roof bolts and cable support.\n3. Increase monitoring frequency of displacement sensors.',
    link: '#'
  },
  {
    id: 'sample-3',
    type: 'info',
    title: 'Routine Maintenance Notice - Conveyor Belt B',
    time: new Date(Date.now() - 86400000).toISOString(),
    hazardType: 'Machinery Operation',
    analysis: 'Scheduled replacement of worn idlers on main Conveyor B will commence at 02:00 hours. The system will be offline for approximately 4 hours.',
    recommendedActions: '1. Re-route production flow to Auxiliary Conveyor C during the downtime.\n2. Ensure proper lockout/tagout procedures are strictly followed by the maintenance crew.',
    link: '#'
  }
];

export const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>(sampleAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:8000/updates');
        if (!response.ok) {
          throw new Error('Failed to fetch updates');
        }
        const data = await response.json();
        
        const parsedAlerts = data.updates.map((item: any, index: number) => {
          const rawAnalysis = item.danger_analysis || '';
          
          let type: 'critical' | 'warning' | 'info' = 'info';
          const lowerAnalysis = rawAnalysis.toLowerCase();
          if (lowerAnalysis.includes('risk level: high')) type = 'critical';
          else if (lowerAnalysis.includes('risk level: medium')) type = 'warning';

          // Extracting fields reliably with robust regex
          const extractField = (fieldName: string) => {
            const regex = new RegExp(`(?:- )?${fieldName}:\\s*(.*?)(?=(?:\\n(?:- )?(?:Risk Level|Hazard Type|Analysis|Recommended Actions):)|$)`, 'is');
            const match = rawAnalysis.match(regex);
            return match ? match[1].trim() : '';
          };

          const hazardType = extractField('Hazard Type') || 'General Warning';
          let analysis = extractField('Analysis');
          const recommendedActions = extractField('Recommended Actions');

          if (!analysis) {
            analysis = rawAnalysis.substring(0, 300) + '...';
          }

          return {
            id: index.toString(),
            type,
            title: item.title || 'Official Bulletin update',
            time: item.published || new Date().toISOString(),
            link: item.link,
            hazardType: hazardType.replace(/^- /, ''),
            analysis,
            recommendedActions
          };
        });
        
        // Append live alerts to the top of our sample data
        if (parsedAlerts.length > 0) {
          setAlerts([...parsedAlerts, ...sampleAlerts]);
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
        // On error, the sampleAlerts will remain displayed
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);

  return (
    <div className="pt-8 pb-32">
      <div className="mb-12 max-w-4xl mx-auto flex flex-col items-center text-center">
        <p className="font-label text-xs uppercase tracking-widest text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)] mb-3 border border-[#00E5FF]/20 px-3 py-1 rounded bg-[#00E5FF]/5 inline-block">Live DGMS Monitoring</p>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">AI Safety Alerts</h1>
        <p className="text-slate-400 mt-4 max-w-2xl text-[15px]">Automated analysis of the latest DGMS official bulletins, ranked by risk factor and localized impact probability.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <Loader2 className="w-12 h-12 text-[#00E5FF] animate-spin" />
          <p className="text-slate-400 font-medium tracking-wide">Fetching & Analyzing realtime DGMS bulletins...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#131316] rounded-2xl overflow-hidden group border border-white/5 hover:border-slate-700 transition-all duration-300 shadow-2xl"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-xl flex-shrink-0 ${
                        alert.type === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]' :
                        alert.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {alert.type === 'critical' ? <ShieldAlert className="w-7 h-7" /> :
                         alert.type === 'warning' ? <AlertTriangle className="w-7 h-7" /> :
                         <Info className="w-7 h-7" />}
                      </div>
                      <div>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] block mb-2 font-bold ${
                          alert.type === 'critical' ? 'text-red-400' :
                          alert.type === 'warning' ? 'text-amber-400' :
                          'text-blue-400'
                        }`}>
                          {alert.type === 'critical' ? 'CRITICAL RISK' :
                           alert.type === 'warning' ? 'MEDIUM RISK' :
                           'LOW RISK / INFO'}
                        </span>
                        <h3 className="font-headline text-2xl md:text-3xl font-bold text-slate-100 leading-tight leading-snug">{alert.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                    <p className="font-sans text-[15px] text-slate-300 leading-relaxed font-light">
                      {alert.analysis}
                    </p>
                    
                    {alert.recommendedActions && (
                      <div className="bg-[#1A1A1E] p-6 rounded-xl border border-white/5 space-y-3 shadow-inner">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-emerald-400 font-bold block flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Actionable Safety Recommendations
                        </span>
                        <p className="text-[14px] font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {alert.recommendedActions}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {alert.hazardType && alert.hazardType !== 'Unknown Hazard' && (
                      <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">{alert.hazardType}</span>
                      </div>
                    )}
                    {alert.time && (
                      <div className="px-4 py-2">
                        <span className="font-mono text-[11px] text-slate-500 tracking-wider">
                          PUBLISHED: {new Date(alert.time).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-8 py-5 bg-[#0A0A0B] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">Source: Directorate General of Mines Safety (DGMS)</span>
                  <a href={alert.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white font-mono text-[11px] font-bold py-2 px-4 rounded transition-all hover:bg-white/5 border border-transparent hover:border-white/10">
                    VIEW ORIGINAL BULLETIN <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
