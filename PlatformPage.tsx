/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { AppState } from '../../types';
import { Layout, Server, Cpu, Shield, ArrowRight } from 'lucide-react';

const motion = framerMotion as any;

interface PlatformPageProps {
    onNavigate: (state: AppState) => void;
}

const PillarCard = ({ icon: Icon, title, desc, color, targetState, onAction }: any) => (
    <div className="group h-[400px] perspective-1000">
        <div className="relative w-full h-full transition-all duration-1000 transform style-preserve-3d group-hover:rotate-y-180 rounded-2xl shadow-2xl">
            {/* FRONT */}
            <div className={`absolute inset-0 backface-hidden bg-evalion-surface border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center`}>
                <div className={`mb-8 p-6 rounded-2xl bg-black/40 ${color.text} border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={48} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 font-mono tracking-tighter uppercase">{title}</h3>
                <div className={`w-12 h-1 ${color.bg} rounded-full mt-2 opacity-60`}></div>
            </div>
            
            {/* BACK */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-evalion-bg border ${color.border} rounded-2xl p-10 flex flex-col justify-between text-left shadow-[0_0_50px_rgba(0,0,0,0.8)]`}>
                <div>
                    <h4 className={`text-lg font-black font-mono mb-4 uppercase tracking-tighter ${color.text}`}>{title} Core</h4>
                    <p className="text-xs md:text-sm font-mono text-evalion-textDim leading-relaxed opacity-90">
                        {desc}
                    </p>
                </div>
                <button 
                    onClick={() => onAction(targetState)} 
                    className="mt-8 w-full text-[10px] font-black font-mono text-white border border-white/10 px-6 py-4 rounded-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    Explore_Module <ArrowRight size={14} />
                </button>
            </div>
        </div>
    </div>
);

export const PlatformPage: React.FC<PlatformPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono text-evalion-teal mb-4 uppercase tracking-[0.6em] font-black"
        >
            System_Architecture
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase"
        >
            Zero-Trust <span className="text-transparent bg-clip-text bg-gradient-to-r from-evalion-teal to-evalion-purple">Platform Core</span>
        </motion.h1>
        <p className="text-evalion-textDim font-mono max-w-2xl mx-auto text-sm leading-relaxed opacity-80">
            EvaluationMind is built on four hardened pillars, ensuring security, scalability, and performance. Each component is designed for autonomous operation within our unified OS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PillarCard 
            icon={Layout}
            title="Frontend Interface"
            desc="Reactive architecture using Signal-based state management. Optimized for zero-latency real-time video and audio streams during critical evaluation phases."
            color={{ text: 'text-evalion-teal', bg: 'bg-evalion-teal', border: 'border-evalion-teal/30', from: 'from-evalion-teal/5' }}
            targetState="FRONTEND_ARCH"
            onAction={onNavigate}
          />
          <PillarCard 
            icon={Server}
            title="Backend Core"
            desc="A modular monolith built on NestJS with strict typing. Handles complex orchestration between AI models, databases, and real-time WebSockets."
            color={{ text: 'text-evalion-purple', bg: 'bg-evalion-purple', border: 'border-evalion-purple/30', from: 'from-evalion-purple/5' }}
            targetState="BACKEND_ARCH"
            onAction={onNavigate}
          />
          <PillarCard 
            icon={Cpu}
            title="AI Engine"
            desc="Orchestration layer for GPT-4o, Whisper V3, and computer vision models. Processes thousands of data points to generate sub-second technical insights."
            color={{ text: 'text-white', bg: 'bg-white', border: 'border-white/20', from: 'from-white/5' }}
            targetState="AI_ENGINE_ARCH"
            onAction={onNavigate}
          />
          <PillarCard 
            icon={Shield}
            title="Security Layer"
            desc="RSA-4096 end-to-end encryption. Zero-trust validation on every request with automated threat detection and regional data residency compliance."
            color={{ text: 'text-evalion-danger', bg: 'bg-evalion-danger', border: 'border-evalion-danger/30', from: 'from-evalion-danger/5' }}
            targetState="SECURITY_ARCH"
            onAction={onNavigate}
          />
      </div>

      <div className="mt-20 p-8 glass-panel rounded-3xl border border-evalion-teal/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
              <div className="p-4 bg-evalion-teal/10 rounded-2xl border border-evalion-teal/20 text-evalion-teal">
                  <Shield size={32} />
              </div>
              <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">Security Protocol v4.2 Active</h4>
                  <p className="text-xs font-mono text-evalion-textDim mt-1">All architectural nodes are currently synchronized and operational.</p>
              </div>
          </div>
          <button 
            onClick={() => onNavigate('STATUS')}
            className="px-10 py-4 bg-white text-evalion-bg font-black rounded-xl hover:bg-evalion-teal transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] text-[10px] uppercase tracking-widest"
          >
              Check_System_Status
          </button>
      </div>
    </div>
  );
};