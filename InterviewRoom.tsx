
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Question, ProctoringMetrics, User } from '../types';
import { CircularTimer, AudioVisualizer, NeuralWaveform } from './Visualizers';
import { ProctoringPanel } from './ProctoringPanel';
import { Mic, Cpu, Binary, Activity, Send, Timer, Shield, Camera, RefreshCw, AlertTriangle, Key, Bot, Wifi, Volume2 } from 'lucide-react';
import { APIService, AIKernelError } from '../services';

const motion = framerMotion as any;

interface InterviewRoomProps {
  user: User;
  onComplete: (transcript: string, context: { text: string, answer?: string }[]) => void;
  onNavigate: (state: any) => void;
}

const AIInterviewerProfile = () => (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px]"></div>
        </div>
        
        {/* Animated AI Core */}
        <div className="relative">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border border-evalion-purple/40 rounded-full flex items-center justify-center"
            >
                <div className="w-24 h-24 border-2 border-evalion-purple/20 rounded-full flex items-center justify-center border-dashed"></div>
            </motion.div>
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 m-auto w-12 h-12 bg-evalion-purple rounded-full blur-xl"
            />
            <div className="absolute inset-0 m-auto flex items-center justify-center">
                <Bot size={40} className="text-evalion-purple drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
            </div>
        </div>
        
        <div className="mt-8 text-center relative z-10">
            <div className="text-[10px] font-mono text-evalion-purple uppercase tracking-[0.4em] font-black mb-1">Neural_Sentinel</div>
            <div className="text-[8px] font-mono text-evalion-textDim uppercase tracking-widest opacity-40">Orchestration_Mode: Active</div>
        </div>
        
        {/* Thinking Pulse */}
        <motion.div 
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-evalion-purple/10 to-transparent"
        />
    </div>
);

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ user, onComplete, onNavigate }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [questionContext, setQuestionContext] = useState<{text: string, answer?: string}[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [speechStatus, setSpeechStatus] = useState<'IDLE' | 'LISTENING' | 'ERROR'>('IDLE');
  const [isThinking, setIsThinking] = useState(true);
  const [errorContext, setErrorContext] = useState<AIKernelError | null>(null);
  const [proctorMetrics, setProctorMetrics] = useState<ProctoringMetrics>({
    gaze: 'FOCUSED', expression: 'NEUTRAL', audioAnomaly: false, systemIntegrity: 'SECURE'
  });
  const [lastSecurityRefresh, setLastSecurityRefresh] = useState(Date.now());
  const [isRefreshingSecurity, setIsRefreshingSecurity] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const restartTimeoutRef = useRef<any>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (transcriptEndRef.current) {
        transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentTranscript, interimTranscript]);

  useEffect(() => {
    try {
        workerRef.current = new Worker('transcriptProcessorWorker.js');
        workerRef.current.onmessage = (event) => {
          if (event.data.type === 'processed_transcript_chunk') {
              setCurrentTranscript(prev => (prev + " " + event.data.cleanedChunk).trim());
          }
        };
    } catch(e) {
        console.warn("Worker init failed. Performance might be degraded.");
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      fetchNextQuestion();
    }).catch(() => {
      onNavigate('DASHBOARD');
    });

    const securityInterval = setInterval(() => {
        refreshSecurityPosture();
    }, 60000);

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      stopSpeechRecognition();
      workerRef.current?.terminate();
      clearInterval(securityInterval);
    };
  }, []);

  const refreshSecurityPosture = async () => {
      setIsRefreshingSecurity(true);
      await APIService.refreshSecurityPosture();
      setLastSecurityRefresh(Date.now());
      setTimeout(() => setIsRefreshingSecurity(false), 2000);
  };

  const fetchNextQuestion = async () => {
    setIsThinking(true);
    setErrorContext(null);
    stopSpeechRecognition();
    try {
        const q = await APIService.generateNextQuestion('Senior Full Stack Engineer', questionContext);
        setQuestions(prev => [...prev, q]);
        if (questions.length > 0) setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(q.durationSeconds);
        setCurrentTranscript("");
        setInterimTranscript("");
        setIsThinking(false);
        setTimeout(startSpeechRecognition, 400);
    } catch (e: any) {
        const kernelErr = e as AIKernelError;
        setErrorContext(kernelErr);
        setIsThinking(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechStatus('ERROR');
      return;
    }

    try {
      stopSpeechRecognition();
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setSpeechStatus('LISTENING');
      
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
              if (workerRef.current) {
                workerRef.current.postMessage({ type: 'process_transcript_chunk', chunk: final_chunk });
              } else {
                setCurrentTranscript(prev => (prev + " " + final_chunk).trim());
              }
              setInterimTranscript('');
          } else {
              setInterimTranscript(interim_chunk);
          }
      };

      recognition.onend = () => {
          setSpeechStatus('IDLE');
          if (!isThinking && !errorContext) {
              restartTimeoutRef.current = setTimeout(() => {
                  if (!isThinking && !errorContext) startSpeechRecognition();
              }, 300);
          }
      };

      recognition.onerror = (event: any) => {
          if (event.error === 'aborted' || event.error === 'no-speech') return;
          console.error("Interview Speech Recognition Error", event.error);
          if (event.error === 'not-allowed') setSpeechStatus('ERROR');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setSpeechStatus('ERROR');
    }
  };

  const stopSpeechRecognition = () => {
      if (recognitionRef.current) {
          recognitionRef.current.onend = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          try { recognitionRef.current.stop(); } catch(e) {}
          recognitionRef.current = null;
      }
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      setSpeechStatus('IDLE');
  };

  useEffect(() => {
    if (isThinking || timeLeft <= 0 || errorContext) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleNextQuestion(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isThinking, timeLeft, errorContext]);

  useEffect(() => {
    const proctorInterval = setInterval(() => {
      setProctorMetrics({
        gaze: Math.random() > 0.08 ? 'FOCUSED' : 'DISTRACTED',
        expression: ['NEUTRAL', 'CONFIDENT', 'UNCERTAIN', 'STRESSED'][Math.floor(Math.random() * 4)] as any,
        audioAnomaly: Math.random() > 0.98,
        systemIntegrity: 'SECURE'
      });
    }, 3000);
    return () => clearInterval(proctorInterval);
  }, []);

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;
    const finalAnswer = (currentTranscript + " " + interimTranscript).trim();
    const qaPair = `Q: ${currentQ.text}\nA: ${finalAnswer || "(No answer provided)"}\n\n`;
    const newFullTranscript = fullTranscript + qaPair;
    const newQuestionContext = [...questionContext, { text: currentQ.text, answer: finalAnswer }];
    
    setFullTranscript(newFullTranscript);
    setQuestionContext(newQuestionContext);
    setCurrentTranscript("");
    setInterimTranscript("");

    if (currentQuestionIndex >= 2) {
      onComplete(newFullTranscript, newQuestionContext);
    } else {
      fetchNextQuestion();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-[95rem] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24 pb-8 px-6">
      
      {/* LEFT: Neural Telemetry & Biometrics */}
      <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <ProctoringPanel metrics={proctorMetrics} />
          
          <div className="glass-panel p-6 rounded-[2.5rem] bg-evalion-purple/5 border-evalion-purple/20 flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-evalion-purple uppercase tracking-[0.3em] font-black">
                      <Volume2 size={14} /> Logic_Decibels
                  </div>
                  <Wifi size={14} className="text-evalion-purple opacity-40" />
              </div>
              <AudioVisualizer isActive={speechStatus === 'LISTENING' && !isThinking && !errorContext} level={60} />
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/40">
                      <span>Encryption_Load</span>
                      <span className="text-evalion-purple">Nominal</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: ['20%', '25%', '22%'] }} className="h-full bg-evalion-purple shadow-[0_0_10px_#8B5CF6]" />
                  </div>
              </div>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] mt-auto relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000"><RefreshCw size={100} /></div>
              <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-mono text-evalion-teal uppercase tracking-[0.3em] font-black">Secure_Vault</div>
                  <Lock size={12} className="text-evalion-teal" />
              </div>
              <div className="text-[9px] font-mono text-evalion-textDim leading-relaxed uppercase tracking-tighter opacity-60">
                  Transcripts are hashed and cryptographically sealed on endpoint submission.
              </div>
          </div>
      </div>

      {/* CENTER: Main Interaction Stage */}
      <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
          {/* Dual Feed Stage */}
          <div className="grid grid-cols-2 gap-4 h-64 md:h-80">
              {/* Candidate Feed */}
              <div className="relative bg-black rounded-[2.5rem] overflow-hidden border-2 border-evalion-teal/20 shadow-2xl group">
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 bg-evalion-teal/10 border border-evalion-teal/30 rounded-full backdrop-blur-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-evalion-teal animate-pulse"></div>
                      <span className="text-[8px] font-mono text-evalion-teal font-black uppercase tracking-widest">Candidate_Uplink</span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-white/20 bg-black/40 flex items-center justify-center backdrop-blur-md">
                        <Camera size={12} className="text-white/60" />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-lg">{user.name}</span>
                  </div>
              </div>

              {/* AI Sentinel Feed */}
              <div className="relative bg-black rounded-[2.5rem] overflow-hidden border-2 border-evalion-purple/20 shadow-2xl">
                  <AIInterviewerProfile />
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-2.5 py-1 bg-evalion-purple/10 border border-evalion-purple/30 rounded-full backdrop-blur-md">
                      <Shield size={10} className="text-evalion-purple" />
                      <span className="text-[8px] font-mono text-evalion-purple font-black uppercase tracking-widest">AI_Decision_Engine</span>
                  </div>
              </div>
          </div>

          {/* Interaction Area */}
          <div className="flex-1 flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                  {errorContext ? (
                      <motion.div key="error" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 flex-1 border-evalion-danger/30 shadow-2xl">
                          <AlertTriangle size={72} className="text-evalion-danger animate-bounce" />
                          <div className="text-center max-w-md">
                              <div className="text-evalion-danger font-mono text-xl tracking-[0.2em] mb-4 uppercase font-black">{errorContext.message}</div>
                              <div className="text-xs font-mono text-evalion-textDim uppercase tracking-widest leading-relaxed opacity-60">{errorContext.recoveryHint}</div>
                          </div>
                          <button onClick={fetchNextQuestion} className="px-12 py-4 bg-white text-black font-black font-mono rounded-2xl hover:bg-evalion-teal transition-all uppercase tracking-widest text-xs">
                             Restart_Protocol
                          </button>
                      </motion.div>
                  ) : isThinking ? (
                      <motion.div key="thinking" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 flex-1 border-white/5 shadow-2xl">
                          <RefreshCw size={56} className="text-evalion-teal animate-spin" />
                          <div className="text-center">
                              <div className="text-evalion-teal font-mono text-xs tracking-[0.6em] mb-3 uppercase font-black">Processing_Logic_Vector</div>
                              <NeuralWaveform active={true} />
                          </div>
                      </motion.div>
                  ) : (
                      <motion.div key="question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 flex-1 min-h-0">
                          <div className="glass-panel p-8 rounded-[2.5rem] border-l-4 border-l-evalion-teal shadow-2xl relative overflow-hidden flex items-center justify-between gap-6">
                              <div className="relative z-10 flex-1">
                                  <div className="flex items-center gap-3 mb-4">
                                      <span className="text-[9px] font-black font-mono bg-evalion-teal/10 text-evalion-teal px-2.5 py-1 rounded border border-evalion-teal/20 uppercase tracking-widest">Question_0{currentQuestionIndex + 1}</span>
                                      <span className="text-[9px] font-mono text-evalion-textDim uppercase tracking-widest opacity-40 font-black">{currentQuestion?.category}</span>
                                  </div>
                                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight leading-snug">{currentQuestion?.text}</h3>
                              </div>
                              <div className="relative z-10 shrink-0">
                                  <CircularTimer timeLeft={timeLeft} totalTime={currentQuestion?.durationSeconds || 60} />
                              </div>
                          </div>

                          <div className="glass-panel rounded-[2.5rem] flex-1 flex flex-col overflow-hidden shadow-2xl bg-black/40 border-white/5 min-h-0">
                              <div className="px-8 py-3.5 border-b border-white/5 flex justify-between items-center bg-black/60 backdrop-blur-md">
                                  <div className="flex items-center gap-8">
                                      <div className="flex items-center gap-2 text-[9px] font-mono text-evalion-teal/40 font-black uppercase tracking-[0.2em]">
                                          <Binary size={14} /> Neural_Sync: Nominal
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <Mic size={14} className={`${speechStatus === 'LISTENING' ? 'text-evalion-success animate-pulse' : 'text-evalion-danger opacity-40'}`} />
                                          <span className="text-[9px] font-mono text-evalion-textDim uppercase tracking-widest font-black">{speechStatus}_STREAM</span>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-evalion-success/20 bg-evalion-success/5">
                                      <div className="w-1 h-1 rounded-full bg-evalion-success animate-ping"></div>
                                      <span className="text-[8px] font-mono text-evalion-success uppercase font-black">Encrypted</span>
                                  </div>
                              </div>
                              
                              <div className="flex-1 p-8 font-mono text-base text-white/90 overflow-y-auto scroll-smooth custom-scrollbar relative" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")` }}>
                                  <div className="absolute top-4 left-4 w-1 h-4 bg-evalion-teal/20 rounded-full"></div>
                                  <p className="leading-relaxed tracking-tight whitespace-pre-wrap pl-6">
                                      <span className="text-evalion-teal/40 mr-4 select-none font-black italic">TX://</span>
                                      {currentTranscript} 
                                      <span className="text-evalion-textDim/40 italic ml-1">{interimTranscript}</span>
                                      {speechStatus === 'LISTENING' && (
                                          <motion.span 
                                            animate={{ opacity: [0, 1, 0] }} 
                                            transition={{ repeat: Infinity, duration: 1 }} 
                                            className="inline-block w-2.5 h-5 bg-evalion-teal ml-2 align-middle shadow-[0_0_15px_#00F0FF]" 
                                          />
                                      )}
                                  </p>
                                  <div ref={transcriptEndRef} className="h-4" />
                              </div>

                              <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-between items-center">
                                  <div className="flex items-center gap-3 text-[9px] font-mono text-white/20 uppercase font-black tracking-widest">
                                      <Activity size={14} className="animate-pulse" /> Vector_Sampling: 2048Hz
                                  </div>
                                  <button 
                                      onClick={handleNextQuestion}
                                      className="group px-8 py-3.5 bg-evalion-teal text-evalion-bg hover:bg-white transition-all rounded-2xl text-[10px] font-black font-mono shadow-2xl active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                                  >
                                      Submit_Vect <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  </button>
                              </div>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
      </div>

      {/* RIGHT: Security & Session Telemetry */}
      <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <div className="glass-panel p-6 rounded-[2.5rem] bg-evalion-bg/40 border-white/5 shadow-2xl">
              <h4 className="text-[10px] font-black font-mono text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                  <Shield size={16} className="text-evalion-success" /> Security_Posture
              </h4>
              <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">Link_Integrity</span>
                          <span className="text-[8px] font-mono text-evalion-success uppercase font-black">High</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '94%' }} className="h-full bg-evalion-success shadow-[0_0_8px_#05FF00]" />
                      </div>
                  </div>
                  <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">Packet_Encryption</span>
                          <span className="text-[8px] font-mono text-evalion-teal uppercase font-black">RSA_4096</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '100%' }} className="h-full bg-evalion-teal shadow-[0_0_8px_#00F0FF]" />
                      </div>
                  </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                  <button 
                    onClick={refreshSecurityPosture}
                    disabled={isRefreshingSecurity}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                  >
                      {isRefreshingSecurity ? (
                          <RefreshCw size={14} className="text-evalion-teal animate-spin" />
                      ) : (
                          <Key size={14} className="text-evalion-teal group-hover:rotate-45 transition-transform" />
                      )}
                      <span className="text-[9px] font-black font-mono text-white/60 uppercase tracking-widest">
                          {isRefreshingSecurity ? 'Rotating_Keys...' : 'Force_Key_Rotation'}
                      </span>
                  </button>
              </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border-evalion-teal/10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-cyber-grid bg-[length:15px_15px] opacity-[0.03]"></div>
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                      <Timer size={18} className="text-evalion-teal" />
                      <h4 className="text-[10px] font-black font-mono text-white uppercase tracking-[0.3em]">Session_Load</h4>
                  </div>
                  <div className="text-3xl font-black text-white font-mono tracking-tighter mb-2">0{currentQuestionIndex + 1}<span className="text-evalion-textDim opacity-30 text-xl mx-1">/</span>03</div>
                  <div className="text-[8px] font-mono text-evalion-textDim uppercase tracking-[0.2em] font-black">Logical_Nodes_Evaluated</div>
              </div>
          </div>
          
          <div className="mt-auto glass-panel p-6 rounded-[2.5rem] border-evalion-danger/20 bg-evalion-danger/5">
              <div className="flex items-center gap-3 text-evalion-danger font-mono text-[9px] font-black uppercase tracking-widest mb-2">
                  <AlertTriangle size={14} /> Exit_Protocol
              </div>
              <p className="text-[8px] font-mono text-evalion-danger/60 leading-relaxed uppercase mb-4">
                  Terminating the uplink now will purge current logical vectors.
              </p>
              <button 
                onClick={() => { if(confirm("Terminate_Uplink?")) onNavigate('DASHBOARD'); }}
                className="w-full py-2.5 border border-evalion-danger/30 text-evalion-danger hover:bg-evalion-danger hover:text-white transition-all text-[9px] font-black font-mono rounded-xl uppercase tracking-widest"
              >
                  Terminate_Session
              </button>
          </div>
      </div>
    </div>
  );
};
