
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Search, Command, Zap, Layout, Users, FileText, Settings, X, Globe, Cpu, ArrowRight, Shield } from 'lucide-react';
import { AppState, UserRole } from '../types';

const motion = framerMotion as any;

interface CommandHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (state: AppState) => void;
  role: UserRole;
}

export const NeuralCommandHub: React.FC<CommandHubProps> = ({ isOpen, onClose, onNavigate, role }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandOptions = [
    { id: 'dash', label: 'Go to Dashboard', icon: Layout, state: 'DASHBOARD', roles: ['CANDIDATE', 'RECRUITER', 'INTERVIEWER'] },
    { id: 'ats', label: 'Candidate Pipeline', icon: Users, state: 'ATS', roles: ['RECRUITER', 'INTERVIEWER'] },
    { id: 'reports', label: 'Latest Reports', icon: FileText, state: 'REPORT', roles: ['RECRUITER', 'INTERVIEWER'] },
    { id: 'profile', label: 'User Profile Settings', icon: Settings, state: 'PROFILE', roles: ['CANDIDATE', 'RECRUITER', 'INTERVIEWER'] },
    { id: 'status', label: 'System Kernel Status', icon: Globe, state: 'STATUS', roles: ['CANDIDATE', 'RECRUITER', 'INTERVIEWER'] },
    { id: 'demo', label: 'Run Practice Simulation', icon: Cpu, state: 'DEMO_SESSION', roles: ['CANDIDATE'] },
  ].filter(opt => opt.roles.includes(role));

  const filteredOptions = commandOptions.filter(opt => 
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        const selected = filteredOptions[selectedIndex];
        if (selected) {
          onNavigate(selected.state as AppState);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-32 px-6 backdrop-blur-2xl bg-evalion-bg/60"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            className="w-full max-w-2xl glass-panel rounded-3xl border-2 border-evalion-teal/20 overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Bar */}
            <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-black/40">
              <Command size={20} className="text-evalion-teal animate-pulse" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Neural Command Interface... (Dash, Pipeline, Status)"
                className="bg-transparent border-none outline-none text-white text-lg font-mono flex-1 placeholder:text-white/20"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-white/40 uppercase">
                ESC to close
              </div>
            </div>

            {/* Results */}
            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                <div className="space-y-1">
                  {filteredOptions.map((opt, i) => (
                    <div 
                      key={opt.id}
                      onClick={() => { onNavigate(opt.state as AppState); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                        selectedIndex === i ? 'bg-evalion-teal/10 border border-evalion-teal/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]' : 'border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selectedIndex === i ? 'bg-evalion-teal text-evalion-bg' : 'bg-white/5 text-evalion-teal'}`}>
                          <opt.icon size={18} />
                        </div>
                        <div>
                          <div className={`text-sm font-black uppercase tracking-tight ${selectedIndex === i ? 'text-white' : 'text-white/80'}`}>{opt.label}</div>
                          <div className="text-[9px] font-mono text-evalion-textDim uppercase tracking-widest opacity-60">System Protocol: {opt.state}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className={`transition-transform ${selectedIndex === i ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                  <Zap size={40} className="text-evalion-danger/20" />
                  <div className="text-xs font-mono text-evalion-textDim uppercase tracking-widest">No matching neural protocols found</div>
                </div>
              )}
            </div>

            {/* Footer Telemetry */}
            <div className="p-4 bg-black/60 border-t border-white/5 flex justify-between items-center px-8">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-[9px] font-mono text-evalion-teal/40 uppercase font-black">
                    <Shield size={12} /> Zero-Trust Encryption: RSA_4096
                 </div>
                 <div className="flex items-center gap-2 text-[9px] font-mono text-evalion-success/40 uppercase font-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-evalion-success animate-pulse"></div> Kernel Stable
                 </div>
              </div>
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">EvaluationMind v1.0</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
