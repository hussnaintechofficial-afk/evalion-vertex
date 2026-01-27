
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Activity, Cpu, Target, MessageSquare, BarChart3, AlertCircle, Terminal, Info, CheckCircle2, FileText, BrainCircuit, Sparkles } from 'lucide-react';
import { ATSApplication } from '../types';

const motion = framerMotion as any;

interface CandidateDeepDiveProps {
    candidate: ATSApplication;
    onClose: () => void;
}

const TelemetryGauge = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>{label}</span>
            <span className={color}>{value}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] opacity-60`}
            />
        </div>
    </div>
);

export const CandidateDeepDive: React.FC<CandidateDeepDiveProps> = ({ candidate, onClose }) => {
    const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'INTELLIGENCE'>('TELEMETRY');

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-xl bg-evalion-bg/60"
        >
            <motion.div 
                layoutId={`card-${candidate.id}`}
                className="w-full max-w-6xl h-[85vh] glass-panel rounded-[3rem] border-2 border-white/10 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.15)]"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <div className="flex items-center gap-6">
                        <img src={candidate.candidateAvatar} className="w-16 h-16 rounded-2xl border-2 border-evalion-teal/30" alt="" />
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{candidate.candidateName}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <button 
                                    onClick={() => setActiveTab('TELEMETRY')}
                                    className={`text-[10px] font-black font-mono uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === 'TELEMETRY' ? 'text-evalion-teal border-evalion-teal' : 'text-white/20 border-transparent'}`}
                                >
                                    Session_Telemetry
                                </button>
                                <button 
                                    onClick={() => setActiveTab('INTELLIGENCE')}
                                    className={`text-[10px] font-black font-mono uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === 'INTELLIGENCE' ? 'text-evalion-purple border-evalion-purple' : 'text-white/20 border-transparent'}`}
                                >
                                    Neural_Intelligence
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'TELEMETRY' ? (
                            <motion.div 
                                key="tel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-12 gap-8"
                            >
                                <div className="col-span-4 space-y-8">
                                    <div className="glass-panel-item p-6 rounded-3xl space-y-6">
                                        <h3 className="text-[11px] font-black text-evalion-teal uppercase tracking-[0.3em] flex items-center gap-3"><Target size={16}/> Match_Vector</h3>
                                        <div className="flex justify-center py-6">
                                            <div className="text-6xl font-black text-white font-mono neon-text">{candidate.matchScore}%</div>
                                        </div>
                                        <div className="space-y-4">
                                            <TelemetryGauge label="Core Competency" value={92} color="text-evalion-teal" />
                                            <TelemetryGauge label="Logic Flow" value={84} color="text-evalion-purple" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-8 bg-black/40 rounded-3xl p-8 border border-white/5">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><Terminal size={18} className="text-evalion-teal"/> Execution_Log</h3>
                                    <div className="font-mono text-[10px] text-white/40 space-y-3">
                                        <p>[09:12:04] INITIALIZING_HANDSHAKE: RSA_4096_NOMINAL</p>
                                        <p>[09:15:22] RESUME_STREAM_INIT: ENCRYPTED_VECT_BUFFER</p>
                                        <p>[09:18:40] NEURAL_AUDIT: COMPLETE. FIT_INDEX: {candidate.matchScore > 80 ? 'OPTIMAL' : 'VALID'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="int" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {candidate.parsedData ? (
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-evalion-teal/5 p-8 rounded-3xl border border-evalion-teal/20">
                                                <h4 className="text-evalion-teal font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><BrainCircuit size={16}/> Technical_Skills_Vector</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.parsedData.skills.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white font-mono">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                                                <h4 className="text-white/40 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16}/> Professional_History</h4>
                                                <div className="space-y-4">
                                                    {candidate.parsedData.experience.map((e, i) => (
                                                        <div key={i} className="border-l-2 border-white/10 pl-4 py-1">
                                                            <div className="text-xs font-black text-white">{e.role} @ {e.company}</div>
                                                            <div className="text-[9px] text-white/40 font-mono mt-1">{e.duration}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-evalion-purple/5 p-8 rounded-3xl border border-evalion-purple/20">
                                            <h4 className="text-evalion-purple font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={16}/> AI_Audit_Justification</h4>
                                            <p className="text-white/80 text-sm font-mono leading-relaxed italic">
                                                "{candidate.rankingReason || 'Audit metrics indicate strong architectural alignment. Recommended for immediate deep-dive evaluation.'}"
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                        <AlertCircle size={48} className="mb-4" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest">No neural data synchronized. Run audit from pipeline view.</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="px-10 py-8 bg-black/40 border-t border-white/5 flex justify-end gap-6">
                    <button className="px-10 py-3 bg-evalion-teal text-evalion-bg font-black rounded-xl text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        COMMENCE_PROTOCOL
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};