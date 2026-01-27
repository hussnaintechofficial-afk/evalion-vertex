/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Shield, Cpu, Binary, ArrowRight, Zap, Globe, Lock, Code, BarChart, Activity, Layers, Server } from 'lucide-react';
import { AppState } from '../types';
import { KernelTerminal } from './KernelTerminal';

const motion = framerMotion as any;

interface LandingPageProps {
  onNavigate: (state: AppState) => void;
}

const NeuralTicker = () => {
    const lines = [
        "KERNEL_INIT: BIOMETRIC_SENTINEL_V4.2_ONLINE",
        "SYNCING_NODES: TOKYO_SHARD_ACTIVE",
        "THREAT_DETECTED: NONE_LOCALIZED",
        "ANALYZING_FLIGHT_RISK: REGION_NA_CALIBRATED",
        "ENCRYPTING_STREAMS: RSA_4096_NOMINAL",
        "OS_STATUS: 99.99%_STABILITY_INDEX"
    ];
    return (
        <div className="fixed top-20 left-0 w-full overflow-hidden h-7 bg-evalion-teal/5 border-y border-white/5 z-40 flex items-center">
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap flex gap-12 font-mono text-[9px] text-evalion-teal/40 uppercase tracking-[0.3em]"
            >
                {Array(5).fill(lines).flat().map((line, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <Binary size={10} /> {line}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const ArchitectureNavCard = ({ icon: Icon, title, desc, colorClass, state, onNavigate }: any) => (
    <motion.div 
        whileHover={{ y: -12, scale: 1.02 }}
        onClick={() => onNavigate(state)}
        className="glass-panel p-10 rounded-[2.5rem] border-2 border-white/5 hover:border-evalion-teal/40 transition-all cursor-pointer group flex flex-col items-center text-center shadow-2xl bg-gradient-to-b from-transparent to-evalion-teal/5"
    >
        <div className={`mb-10 p-8 rounded-3xl bg-white/5 ${colorClass} border border-white/10 group-hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] transition-all relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon size={56} className="relative z-10" />
        </div>
        <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-sm font-mono text-evalion-textDim leading-relaxed mb-10 opacity-80 h-16 line-clamp-3">
            {desc}
        </p>
        <div className="mt-auto py-4 px-8 border border-white/10 rounded-full group-hover:bg-evalion-teal group-hover:text-evalion-bg transition-all duration-300">
            <div className="flex items-center gap-3 text-[10px] font-black font-mono uppercase tracking-[0.2em]">
                Initialize_Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {

  return (
    <div className="w-full flex flex-col bg-evalion-bg relative">
      <NeuralTicker />
      
      {/* Background Cyber-FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-evalion-teal/5 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-evalion-purple/5 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 bg-cyber-grid bg-[length:60px_60px] opacity-20"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 px-6 overflow-hidden">
         <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             {/* Left Column: Core Value */}
             <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
             >
                 <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-evalion-teal/30 bg-evalion-teal/5 mb-12 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                     <div className="w-2.5 h-2.5 rounded-full bg-evalion-teal animate-pulse shadow-[0_0_15px_#00F0FF]"></div>
                     <span className="text-[10px] font-mono text-evalion-teal tracking-[0.3em] uppercase font-black">Neural_OS_Kernel: v1.0.24_Stable</span>
                 </div>
                 
                 <h1 className="text-6xl md:text-[92px] font-black text-white leading-[0.85] mb-10 tracking-tighter">
                     Hire with <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-evalion-teal via-[#00BFFF] to-white drop-shadow-xl neon-text">Evalion Logic.</span>
                 </h1>
                 
                 <p className="text-xl text-evalion-textDim font-mono mb-16 leading-relaxed max-w-xl border-l-4 border-evalion-teal/30 pl-10 opacity-90 italic">
                     Scale technical recruitment with Zero-Trust autonomy. Our AI agents verify depth, logic, and architectural reasoning in real-time.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-8">
                    <button 
                        onClick={() => onNavigate('DEPLOY_PAGE')}
                        className="group relative px-14 py-7 bg-evalion-teal text-evalion-bg font-black font-mono rounded-2xl overflow-hidden transition-all shadow-[0_0_50px_rgba(0,240,255,0.3)] hover:shadow-[0_0_70px_rgba(0,240,255,0.5)] hover:-translate-y-1 active:translate-y-0"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-4 text-xs tracking-[0.2em] font-black">
                            DEPLOY_OS_INSTANCE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('DEMO_SESSION')}
                        className="group px-14 py-7 border-2 border-white/10 text-white font-black font-mono rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-4 backdrop-blur-xl hover:border-evalion-teal/50 hover:-translate-y-1 text-xs tracking-[0.2em]"
                    >
                        RUN_SIMULATION <Cpu size={20} className="group-hover:text-evalion-teal transition-colors group-hover:rotate-90 duration-500" />
                    </button>
                 </div>
             </motion.div>

             {/* Right Column: High-Tech Mockup */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="relative hidden lg:block perspective-1000"
             >
                 <div className="relative w-full aspect-video glass-panel rounded-[2.5rem] p-10 border-2 border-evalion-teal/20 shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-float overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-evalion-teal/15 to-transparent rounded-[2.5rem] pointer-events-none"></div>
                    <KernelTerminal />
                 </div>
                 
                 {/* Floating Cyber Accents */}
                 <motion.div 
                    animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-16 -right-16 p-6 glass-panel border-2 border-evalion-success/50 rounded-3xl shadow-[0_0_50px_rgba(5,255,0,0.2)] backdrop-blur-2xl"
                 >
                    <div className="text-[12px] font-mono text-evalion-success flex items-center gap-4 font-black tracking-widest uppercase">
                        <Zap size={20} fill="currentColor" className="animate-pulse" /> Encrypted_Uplink_Secure
                    </div>
                 </motion.div>
             </motion.div>
         </div>
      </section>

      {/* --- ARCHITECTURE OF THE FUTURE (Navigation Module) --- */}
      <section className="py-48 px-6 relative z-10 border-t border-white/10 bg-black/60">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-40">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-mono text-evalion-teal mb-8 uppercase tracking-[0.8em] font-black"
                  >
                      System_Infrastructure_Layers
                  </motion.div>
                  <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-none">Architecture <br/>of the Future</h2>
                  <p className="text-evalion-textDim font-mono max-w-3xl leading-relaxed text-sm md:text-lg opacity-80 uppercase tracking-widest">
                      Every interaction is parsed for depth, logic, and biometric integrity. Transitions are verifiable, data is encrypted, and intelligence is autonomous.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <ArchitectureNavCard 
                    icon={Shield} 
                    title="Biometric Sentinel" 
                    desc="Continuous neural proctoring via iris-tracking and audio forensics. RSA-4096 end-to-end encryption for every packet." 
                    colorClass="text-evalion-teal"
                    state="VERIFICATION"
                    onNavigate={onNavigate}
                />
                <ArchitectureNavCard 
                    icon={Code} 
                    title="Neuro-Code Sandbox" 
                    desc="Virtualized assessment. Real-time O(n) algorithmic complexity mapping and heap analysis. Supports 40+ languages." 
                    colorClass="text-evalion-purple"
                    state="DEMO_SESSION"
                    onNavigate={onNavigate}
                />
                <ArchitectureNavCard 
                    icon={BarChart} 
                    title="Synthesized Analytics" 
                    desc="Neural scoring engine calibrated across 5,000+ data vectors to generate a bias-free 'Fit Index' and 'Logic Entropy' score." 
                    colorClass="text-white"
                    state="REPORT"
                    onNavigate={onNavigate}
                />
              </div>
          </div>
      </section>
    </div>
  );
};
