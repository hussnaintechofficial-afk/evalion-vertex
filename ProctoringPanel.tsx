
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { ProctoringMetrics } from '../types';
import { ShieldCheck, Eye, Activity, AlertTriangle, Lock, AlertOctagon, Zap } from 'lucide-react';

const motion = framerMotion as any;

interface ProctoringPanelProps {
  metrics: ProctoringMetrics;
}

const StatusIndicator = ({ 
  label, 
  status, 
  icon: Icon, 
  isDanger 
}: { 
  label: string; 
  status: string; 
  icon: any; 
  isDanger?: boolean 
}) => (
  <div className={`flex items-center justify-between p-4 glass-panel-item border rounded-xl transition-all duration-500 relative overflow-hidden ${isDanger ? 'border-evalion-danger/30 shadow-[0_0_20px_rgba(255,42,109,0.1)]' : 'border-white/5 hover:border-evalion-teal/20'}`}>
    <div className="flex items-center gap-3 text-evalion-textDim text-[10px] font-mono font-black uppercase tracking-widest relative z-10">
      <div className={`p-2 rounded-lg ${isDanger ? 'bg-evalion-danger/10 text-evalion-danger' : 'bg-evalion-teal/10 text-evalion-teal'}`}>
        <Icon size={16} />
      </div>
      {label}
    </div>
    <div className={`text-[10px] font-black font-mono px-3 py-1 rounded-full relative z-10 transition-colors shadow-sm ${
      isDanger 
        ? 'bg-evalion-danger/20 text-evalion-danger animate-pulse border border-evalion-danger/30' 
        : 'bg-evalion-teal/10 text-evalion-teal border border-evalion-teal/30'
    }`}>
      {status}
    </div>
    
    {!isDanger && (
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-evalion-teal/5 to-transparent pointer-events-none"></div>
    )}

    {isDanger && (
       <div className="absolute inset-0 bg-evalion-danger/10 animate-pulse pointer-events-none"></div>
    )}
  </div>
);

export const ProctoringPanel: React.FC<ProctoringPanelProps> = ({ metrics }) => {
  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
      <AnimatePresence>
        {metrics.systemIntegrity === 'COMPROMISED' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-center p-8 backdrop-blur-xl"
          >
             <motion.div 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-evalion-danger mb-6"
             >
                <AlertOctagon size={64} className="drop-shadow-[0_0_20px_#FF2A6D]" />
             </motion.div>
             <h3 className="text-evalion-danger font-black text-2xl font-mono tracking-tighter uppercase leading-none">Security_Protocol_Void</h3>
             <p className="text-xs text-white/60 font-mono mt-4 leading-relaxed uppercase tracking-[0.2em]">
               Liveness check failure. Packet loss threshold exceeded. Incident ticket #AX-2024-001 initialized.
             </p>
             <div className="mt-8 px-10 py-4 border-2 border-evalion-danger text-evalion-danger text-[11px] font-black font-mono rounded-2xl bg-evalion-danger/10 animate-bounce tracking-[0.2em] shadow-[0_0_30px_rgba(255,42,109,0.3)]">
               RE-INITIALIZE_UPLINK
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-evalion-teal shadow-[0_0_12px_#00F0FF] animate-pulse"></div>
            <h3 className="text-[11px] font-black font-mono text-white flex items-center gap-2 uppercase tracking-[0.3em]">
                AI_Sentinel_v4.2.0
            </h3>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black font-mono text-evalion-teal bg-evalion-teal/10 px-3 py-1.5 rounded-full border border-evalion-teal/20 tracking-widest uppercase">
             <ShieldCheck size={12} className="text-evalion-success" /> Protocol_Safe
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatusIndicator 
            label="Gaze_Tracker" 
            icon={Eye} 
            status={metrics.gaze} 
            isDanger={metrics.gaze !== 'FOCUSED'} 
        />
        <StatusIndicator 
            label="Affective_State" 
            icon={Activity} 
            status={metrics.expression} 
            isDanger={metrics.expression === 'STRESSED'} 
        />
        <StatusIndicator 
            label="OS_Integrity" 
            icon={Lock} 
            status={metrics.systemIntegrity} 
            isDanger={metrics.systemIntegrity === 'COMPROMISED'} 
        />
        
        {metrics.audioAnomaly && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-5 bg-evalion-danger/10 border-2 border-evalion-danger/30 rounded-2xl flex items-center gap-5 text-xs text-evalion-danger font-mono font-black shadow-[0_0_30px_rgba(255,42,109,0.1)]"
            >
                <div className="p-3 rounded-xl bg-evalion-danger/20 border border-evalion-danger/30">
                    <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="uppercase tracking-[0.2em] text-[10px]">Acoustic_Anomaly</span>
                    <span className="text-[9px] opacity-60 font-bold mt-1 tracking-tighter">NON-HUMAN PATTERN DETECTED</span>
                </div>
            </motion.div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="w-full h-36 bg-black/40 rounded-[2rem] overflow-hidden relative border border-white/5 group shadow-inner">
            <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-[0.05]"></div>
            
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <motion.path 
                    d="M0 72 Q 40 32, 80 72 T 160 72 T 240 72 T 320 72"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="2"
                    animate={{ 
                        d: [
                            "M0 72 Q 40 10, 80 72 T 160 130 T 240 10 T 320 72",
                            "M0 72 Q 40 130, 80 72 T 160 10 T 240 130 T 320 72",
                            "M0 72 Q 40 72, 80 72 T 160 72 T 240 72 T 320 72"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="opacity-40"
                 />
                 <motion.path 
                    d="M0 72 Q 40 110, 80 72 T 160 10 T 240 110 T 320 72"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    animate={{ 
                        d: [
                            "M0 72 Q 40 140, 80 72 T 160 -10 T 240 140 T 320 72",
                            "M0 72 Q 40 -10, 80 72 T 160 140 T 240 -10 T 320 72",
                            "M0 72 Q 40 72, 80 72 T 160 72 T 240 72 T 320 72"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.1 }}
                    className="opacity-20"
                 />
            </svg>
            <div className="absolute top-4 left-6 text-[10px] text-evalion-teal font-black font-mono uppercase tracking-[0.4em] flex items-center gap-3">
                <Zap size={12} className="fill-current animate-pulse" /> Logic_Activity_Scan
            </div>
            <div className="absolute bottom-4 right-6 text-[9px] text-white/20 font-black font-mono uppercase tracking-widest group-hover:text-evalion-teal/40 transition-colors">
                Vector_Sampling: 2048_HZ
            </div>
        </div>
      </div>
    </div>
  );
};
