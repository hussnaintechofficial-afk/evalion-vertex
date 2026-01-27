
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, Cpu, RefreshCw, Activity, Mic, Binary, Send, Timer, AlertTriangle } from 'lucide-react';
import { CircularTimer, AudioVisualizer } from './Visualizers';
import { ProctoringPanel } from './ProctoringPanel';
import { Question, ProctoringMetrics } from '../types';

const motion = framerMotion as any;

const DEMO_QUESTIONS: Question[] = [
    { id: 101, text: "Describe a challenging project and how you overcame technical hurdles.", durationSeconds: 30, category: 'BEHAVIORAL' },
    { id: 102, text: "Explain how you ensure the security of a distributed API gateway.", durationSeconds: 45, category: 'TECHNICAL' },
    { id: 103, text: "How would you approach debugging a memory leak in a production Node.js application?", durationSeconds: 60, category: 'SYSTEM_DESIGN' },
];

export const DemoSession = ({ onExit }: { onExit: () => void }) => {
    const [step, setStep] = useState<'idle' | 'preparing' | 'running' | 'analyzing' | 'complete'>('idle');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [proctorMetrics, setProctorMetrics] = useState<ProctoringMetrics>({
        gaze: 'FOCUSED', expression: 'NEUTRAL', audioAnomaly: false, systemIntegrity: 'SECURE'
    });
    const recognitionRef = useRef<any>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const restartTimeoutRef = useRef<any>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript, interimTranscript]);

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            try {
                recognitionRef.current.stop();
            } catch (e) {}
            recognitionRef.current = null;
        }
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
        setIsListening(false);
    };

    const startRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        try {
            stopRecognition();
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            
            recognition.onresult = (event: any) => {
                let final_chunk = '';
                let interim_chunk = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_chunk += event.results[i][0].transcript;
                    } else {
                        interim_chunk += event.results[i][0].transcript;
                    }
                }

                if (final_chunk) {
                    setTranscript(prev => (prev + " " + final_chunk).trim());
                    setInterimTranscript('');
                } else {
                    setInterimTranscript(interim_chunk);
                }
            };

            recognition.onerror = (event: any) => {
                if (event.error === 'aborted' || event.error === 'no-speech') {
                    console.info(`Speech recognition ended: ${event.error}`);
                    return;
                }
                
                console.error("Demo Speech Recognition Error", event.error);
                if (event.error === 'not-allowed') {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                if (step === 'running' && !isThinking) {
                    restartTimeoutRef.current = setTimeout(() => {
                        if (step === 'running' && !isThinking) startRecognition();
                    }, 300);
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (e) {
            console.error("Demo Speech Recognition initialization failed", e);
        }
    };

    useEffect(() => {
        if (step === 'running' && !isThinking) {
            startRecognition();
        } else {
            stopRecognition();
        }
        return () => stopRecognition();
    }, [step, isThinking, questionIndex]);

    useEffect(() => {
        if (step !== 'running' || isThinking) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleNext();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step, isThinking, questionIndex]);

    const startDemo = () => {
        setStep('preparing');
        setTimeout(() => {
            setStep('running');
            setQuestionIndex(0);
            setTimeLeft(DEMO_QUESTIONS[0].durationSeconds);
            setTranscript("");
            setInterimTranscript("");
        }, 2000);
    };

    const handleNext = () => {
        if (questionIndex < DEMO_QUESTIONS.length - 1) {
            setIsThinking(true);
            setTranscript("");
            setInterimTranscript("");
            setTimeout(() => {
                setQuestionIndex(q => q + 1);
                setTimeLeft(DEMO_QUESTIONS[questionIndex + 1].durationSeconds);
                setIsThinking(false);
            }, 1500);
        } else {
            setStep('analyzing');
            setTimeout(() => setStep('complete'), 3000);
        }
    };

    const restartDemo = () => {
        setStep('idle');
        setQuestionIndex(0);
        setTranscript("");
        setInterimTranscript("");
    };

    const renderContent = () => {
        switch (step) {
            case 'idle':
                return (
                    <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center glass-panel p-12 rounded-2xl max-w-2xl border border-evalion-teal/20">
                        <div className="w-20 h-20 bg-evalion-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-evalion-teal/30">
                            <Cpu size={40} className="text-evalion-teal animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter uppercase">Simulation_Environment</h2>
                        <p className="text-evalion-textDim max-w-md mx-auto mb-10 font-mono text-sm leading-relaxed">
                            Initialize a high-fidelity practice session. 
                            Experience full neural proctoring, real-time speech analytics, and architectural evaluation 
                            in a sandboxed local context. <br/><br/>
                            <span className="text-evalion-teal/60 font-bold tracking-widest uppercase text-[10px]">Note: Performance metrics are not persisted in the recruiter cloud.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={onExit} className="px-8 py-4 border border-white/10 text-white font-mono text-xs rounded hover:bg-white/5 transition-all">
                                RETURN_TO_DASHBOARD
                            </button>
                            <button onClick={startDemo} className="px-8 py-4 bg-evalion-teal text-black font-bold font-mono text-xs rounded flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                                <Play size={18} fill="currentColor" /> INITIATE_PROTOCOL
                            </button>
                        </div>
                    </motion.div>
                );

            case 'preparing':
                return (
                    <div className="flex flex-col items-center">
                        <RefreshCw size={48} className="text-evalion-teal animate-spin mb-6" />
                        <h2 className="text-xl font-mono text-white tracking-[0.4em] animate-pulse uppercase">Syncing_Neural_Buffers...</h2>
                    </div>
                );

            case 'running':
                return (
                    <div className="w-full max-w-7xl mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 pt-12 pb-12 px-6">
                        {/* Sidebar: Proctoring and Visuals */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white/20">DEMO_FEED_SIMULATED</div>
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-evalion-teal/20 text-evalion-teal text-[10px] font-bold rounded animate-pulse border border-evalion-teal/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-evalion-teal"></div> PRACTICE_TX
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                            </div>
                            
                            <ProctoringPanel metrics={proctorMetrics} />

                            <div className="glass-panel p-4 rounded-xl border border-white/5 bg-black/20 mt-auto">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-evalion-textDim mb-4 uppercase tracking-widest">
                                    <Activity size={12} className="text-evalion-teal" /> Entropy_Spectrum
                                </div>
                                <AudioVisualizer isActive={isListening && !isThinking} level={isThinking ? 0 : 40} />
                            </div>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <AnimatePresence mode="wait">
                                {isThinking ? (
                                    <motion.div key="thinking" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center gap-6 min-h-[500px]">
                                        <RefreshCw size={48} className="text-evalion-teal animate-spin" />
                                        <div className="text-center">
                                            <div className="text-evalion-teal font-mono text-sm tracking-[0.4em] mb-2 uppercase font-black">Synthesizing_Context...</div>
                                            <div className="text-[10px] font-mono text-evalion-textDim uppercase tracking-widest opacity-40 font-black">Neural practice layer initializing</div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 h-full">
                                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-evalion-teal shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={160} /></div>
                                            
                                            <div className="relative z-10 flex-1">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="text-[10px] font-mono text-evalion-teal bg-evalion-teal/10 px-3 py-1.5 rounded-full border border-evalion-teal/20 uppercase tracking-widest font-black">PRACTICE_{questionIndex + 1}</div>
                                                    <div className="text-[10px] font-mono text-evalion-textDim uppercase tracking-widest border-l border-white/10 pl-2 font-black opacity-40">{DEMO_QUESTIONS[questionIndex].category}</div>
                                                </div>
                                                <h3 className="text-xl md:text-3xl font-black text-white leading-tight pr-0 sm:pr-12 uppercase tracking-tight">{DEMO_QUESTIONS[questionIndex].text}</h3>
                                            </div>

                                            <div className="relative z-10 shrink-0 ml-0 sm:ml-4">
                                                <CircularTimer timeLeft={timeLeft} totalTime={DEMO_QUESTIONS[questionIndex].durationSeconds} />
                                            </div>
                                        </div>

                                        <div className="glass-panel rounded-3xl flex-1 flex flex-col overflow-hidden border border-white/5 shadow-2xl bg-black/40">
                                            <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-black/60">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-mono text-evalion-teal/60 font-black uppercase tracking-widest">
                                                        <Binary size={14} /> DATA_BUS: LOCAL_ONLY
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mic size={12} className={`${isListening ? 'text-evalion-success animate-pulse' : 'text-evalion-danger opacity-40'}`} />
                                                        <span className="text-[9px] font-mono text-evalion-textDim uppercase tracking-tighter font-black">{isListening ? 'LISTENING_ACTIVE' : 'AUDIO_IDLE'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-evalion-success animate-pulse shadow-[0_0_10px_#05FF00]"></div>
                                                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">Protocol: Stable</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-10 font-mono text-lg text-white/90 overflow-y-auto min-h-[300px] scroll-smooth bg-black/20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")` }}>
                                                {transcript || interimTranscript ? (
                                                    <div className="leading-relaxed space-y-4">
                                                        <p className="tracking-tight whitespace-pre-wrap">
                                                            <span className="text-evalion-teal/30 mr-4 select-none font-black">{'>'}</span>
                                                            <span className="text-white/90">{transcript}</span> 
                                                            <span className="text-evalion-textDim/50 italic ml-1">{interimTranscript}</span>
                                                            {isListening && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-5 bg-evalion-teal ml-1 align-middle shadow-[0_0_15px_rgba(0,240,255,0.8)]" />}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-white/10 gap-6">
                                                        <Activity size={48} className="animate-pulse" />
                                                        <span className="text-[11px] uppercase tracking-[0.5em] font-black opacity-40">Initiate_Speech_Protocol_Uplink...</span>
                                                    </div>
                                                )}
                                                <div ref={transcriptEndRef} />
                                            </div>
                                            <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex justify-between items-center gap-4">
                                                <div className="text-[10px] font-mono text-white/30 flex items-center gap-3 uppercase tracking-widest font-black">
                                                    <Timer size={14} /> Neural_Sandbox_Uplink
                                                </div>
                                                <button 
                                                    onClick={handleNext}
                                                    className="px-10 py-4 bg-evalion-teal text-evalion-bg font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.2)] active:scale-95 text-[11px] uppercase tracking-[0.2em]"
                                                >
                                                    ADVANCE_SIMULATION <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );

            case 'analyzing':
                return (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className="relative">
                            <div className="w-32 h-32 border-4 border-white/5 rounded-full"></div>
                            <div className="absolute inset-0 border-t-4 border-evalion-teal rounded-full animate-spin"></div>
                            <Cpu size={48} className="absolute inset-0 m-auto text-evalion-teal animate-pulse" />
                        </div>
                        <h2 className="mt-8 text-2xl font-black text-white tracking-[0.4em] animate-pulse uppercase font-mono">Synthesizing_Logic_Report</h2>
                        <div className="mt-4 text-[10px] font-mono text-evalion-textDim uppercase tracking-[0.5em] opacity-40 font-black">LOCAL_NEURAL_PROCESSING_ACTIVE</div>
                    </div>
                );

            case 'complete':
                return (
                    <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center glass-panel p-12 rounded-[3rem] max-w-xl mx-auto border border-white/10 shadow-2xl">
                        <div className="w-20 h-20 bg-evalion-success/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-evalion-success/30">
                            <CheckCircle size={40} className="text-evalion-success" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Protocol_Synchronized</h2>
                        <p className="text-evalion-textDim font-mono text-[10px] mb-10 uppercase tracking-widest opacity-60 font-black">Session analysis complete. Local cache invalidated.</p>
                        
                        <div className="space-y-6 text-left font-mono text-xs border-y border-white/5 py-10 mb-10">
                            <div className="flex justify-between items-center group">
                                <span className="text-evalion-textDim uppercase tracking-widest font-black opacity-60">PRACTICE_TECH_SCORE:</span>
                                <span className="text-evalion-teal font-black text-2xl tracking-tighter neon-text">91.4%</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-evalion-textDim uppercase tracking-widest font-black opacity-60">CLARITY_VECTORS:</span>
                                <span className="text-evalion-teal font-black text-2xl tracking-tighter neon-text">84.0%</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-evalion-textDim uppercase tracking-widest font-black opacity-60">SENTINEL_TRUST:</span>
                                <span className="text-evalion-success font-black text-lg tracking-[0.2em]">NOMINAL_STABLE</span>
                            </div>
                            <div className="mt-6 p-5 bg-evalion-teal/5 rounded-2xl border border-evalion-teal/20 italic text-[11px] text-white/80 leading-relaxed uppercase tracking-tight font-black">
                                <span className="text-evalion-teal mr-2 opacity-50">AI_INSIGHT:</span> 
                                High-depth architectural reasoning during Question 3. Maintain consistent focal point synchronization during logic deep-dives.
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button onClick={restartDemo} className="flex-1 py-4 border border-evalion-teal/30 text-evalion-teal rounded-2xl font-mono text-[10px] font-black hover:bg-evalion-teal/10 flex items-center justify-center gap-3 uppercase tracking-[0.2em] transition-all">
                                <RefreshCw size={16}/> RE_INIT_UPLINK
                            </button>
                            <button onClick={onExit} className="flex-1 py-4 bg-white text-black rounded-2xl font-mono text-[10px] font-black hover:bg-evalion-teal uppercase tracking-[0.2em] transition-all shadow-xl">
                                TERMINATE_DEMO
                            </button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
    );
};
