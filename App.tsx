
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { AppState, User, UserRole, Notification, FinalReport, SocketStatus } from './types';
import { HexGridBackground } from './components/Visualizers';
import { FinalReportDashboard } from './components/Dashboard';
import { CandidateDashboard, RecruiterDashboard } from './components/RoleDashboards';
import { InterviewRoom } from './components/InterviewRoom';
import { Auth } from './components/Auth';
import { UserProfile } from './components/Profile';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { PlatformPage } from './components/pages/PlatformPage';
import { PricingPage } from './components/pages/PricingPage';
import { EnterprisePage } from './components/pages/EnterprisePage';
import { DocsPage } from './components/pages/DocsPage';
import { CompanyPage } from './components/pages/CompanyPage';
import { ContactPage } from './components/pages/ContactPage';
import { SolutionsPage } from './components/pages/SolutionsPage';
import { PolicyPage } from './components/pages/PolicyPage';
import { StatusPage } from './components/pages/StatusPage';
import { FrontendArchPage, BackendArchPage, AIEngineArchPage, SecurityArchPage } from './components/pages/arch';
import { ATSView } from './components/ATSView';
import { APIService, AIKernelError, socketService } from './services';
import { DemoSession } from './components/DemoSession';
import { DeployPage } from './components/DeployPage';
import { Intro } from './components/Intro';
import { NeuralCommandHub } from './components/NeuralCommandHub';
import { BillingPage } from './components/pages/BillingPage';
import { NetworkStatusGuard, ApiKeyGuard } from './components/SystemGuard';
import { Cpu, RefreshCw, Activity, CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const motion = framerMotion as any;

const ROUTE_PERMISSIONS: Record<AppState, UserRole[] | 'PUBLIC'> = {
    'LANDING': 'PUBLIC', 'PLATFORM': 'PUBLIC', 'PRICING': 'PUBLIC', 'ENTERPRISE': 'PUBLIC',
    'DOCS': 'PUBLIC', 'SOLUTIONS': 'PUBLIC', 'ABOUT': 'PUBLIC', 'CONTACT': 'PUBLIC',
    'POLICY': 'PUBLIC', 'AUTH': 'PUBLIC', 'DEMO_SESSION': 'PUBLIC', 'DEPLOY_PAGE': 'PUBLIC',
    'STATUS': 'PUBLIC', 'FRONTEND_ARCH': 'PUBLIC', 'BACKEND_ARCH': 'PUBLIC',
    'AI_ENGINE_ARCH': 'PUBLIC', 'SECURITY_ARCH': 'PUBLIC', 
    'DASHBOARD': ['CANDIDATE', 'RECRUITER', 'INTERVIEWER'],
    'ATS': ['RECRUITER', 'INTERVIEWER'], 
    'PROFILE': ['CANDIDATE', 'RECRUITER', 'INTERVIEWER'], 
    'BILLING': ['RECRUITER'],
    'IDLE': ['CANDIDATE'], 'VERIFICATION': ['CANDIDATE'], 'INTERVIEW': ['CANDIDATE'],
    'ANALYSIS': ['CANDIDATE'], 
    'REPORT': ['CANDIDATE', 'RECRUITER', 'INTERVIEWER']
};

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>('LANDING');
  const [history, setHistory] = useState<AppState[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isIntroing, setIsIntroing] = useState(true);
  const [currentReport, setCurrentReport] = useState<FinalReport | null>(null);
  const [isCommandHubOpen, setIsCommandHubOpen] = useState(false);
  const [lastInterviewContext, setLastInterviewContext] = useState<{ text: string, answer?: string }[]>([]);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('CONNECTING');
  const [isApiKeyInvalid, setIsApiKeyInvalid] = useState(false);

  useEffect(() => {
    // Initial check for API Key presence with safety check
    const apiKeyExists = typeof process !== 'undefined' && process.env && process.env.API_KEY;
    if (!apiKeyExists) {
        setIsApiKeyInvalid(true);
    }

    APIService.initialize();
    
    const handleSocketStatus = (status: SocketStatus) => setSocketStatus(status);
    socketService.on('socket_status_update', handleSocketStatus);
    
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandHubOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
        socketService.off('socket_status_update', handleSocketStatus);
        window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', message: string, recoveryHint?: string) => {
    if (message === 'API_KEY_INVALID') {
        setIsApiKeyInvalid(true);
    }
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message, recoveryHint }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 10000);
  };

  const navigateTo = (newState: AppState) => {
      if (newState === state) return;
      const allowed = ROUTE_PERMISSIONS[newState];
      if (allowed !== 'PUBLIC' && (!user || !allowed.includes(user.role))) {
          addToast('error', 'UNAUTHORIZED_ACCESS_BLOCKED', 'Security node permissions rejected the request.');
          if (!user) setState('AUTH');
          return;
      }
      setHistory(prev => [...prev, state]);
      setState(newState);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
      if (state === 'INTERVIEW' || state === 'VERIFICATION') {
          if (!confirm("CRITICAL: Terminating session will invalidate results. Terminate Uplink?")) return;
      }
      const newHistory = [...history];
      const prevState = newHistory.pop();
      if (prevState) {
          setHistory(newHistory);
          setState(prevState);
      } else {
          setState(user ? 'DASHBOARD' : 'LANDING');
      }
  };

  const handleLogout = () => {
      if (window.confirm("CONFIRM_SESSION_TERMINATION: Are you sure you want to log out?")) {
        setUser(null);
        setState('LANDING');
        setHistory([]);
        addToast('info', 'SESSION_TERMINATED');
      }
  };

  const handleLogin = async (u: User) => {
      try {
        let existing = await APIService.login(u.email);
        if (!existing) existing = await APIService.register(u);
        setUser(existing);
        setState('DASHBOARD');
        setHistory([]);
        addToast('success', `ACCESS_GRANTED: ${existing.name.toUpperCase()}`);
      } catch (e) {
          addToast('error', 'AUTHENTICATION_FAILED', 'Neural buffer mismatch. Check credentials.');
      }
  };

  const handleInterviewComplete = async (finalTranscript: string, context: { text: string, answer?: string }[]) => {
      setState('ANALYSIS');
      setLastInterviewContext(context);
      try {
          const report = await APIService.generateFinalReport(finalTranscript, 'Senior Full Stack Engineer');
          await APIService.saveReport(report);
          setCurrentReport(report);
          setState('REPORT');
          addToast('success', 'ANALYSIS_SYNCHRONIZED', 'The neural report has been successfully generated.');
      } catch (e: any) {
          const err = e as AIKernelError;
          addToast('error', err.message || 'ANALYSIS_FAILED', err.recoveryHint || 'Manual review required.');
          if (err.message !== 'API_KEY_INVALID') {
            setState('DASHBOARD');
          }
      }
  };

  const renderContent = () => {
    switch (state) {
        case 'LANDING': return <LandingPage onNavigate={navigateTo} />;
        case 'AUTH': return <div className="pt-24 flex-1 flex flex-col justify-center"><Auth onLogin={handleLogin} /></div>;
        case 'DASHBOARD': 
            if (user?.role === 'CANDIDATE') return <div className="pt-32 pb-12 px-6"><CandidateDashboard user={user!} onNavigate={navigateTo} onStartInterview={() => navigateTo('IDLE')}/></div>;
            return <div className="pt-32 pb-24 px-6"><RecruiterDashboard user={user!} onNavigate={navigateTo}/></div>;
        case 'IDLE': return (
            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pt-24 min-h-screen p-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 mb-8 rounded-full border-4 border-evalion-teal flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-pulse">
                    <Cpu size={48} className="text-evalion-teal" />
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tighter uppercase leading-none">OS_READY_FOR_BOOT<br/><span className="text-evalion-teal tracking-widest">EVALUATION PROTOCOL</span></h1>
                <p className="text-sm text-evalion-textDim mb-12 font-mono uppercase tracking-widest italic opacity-60">Liveness detection active. High-trust zone established.</p>
                <button onClick={() => navigateTo('VERIFICATION')} className="px-14 py-6 bg-evalion-teal text-evalion-bg font-black font-mono tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(0,240,255,0.4)] rounded-2xl active:scale-95 uppercase text-sm">
                    INITIATE_SESSION_KERNEL
                </button>
            </div>
        );
        case 'VERIFICATION': return (
            <div className="relative flex flex-col items-center pt-32 min-h-screen justify-center p-6">
                <h2 className="text-xl font-mono text-evalion-teal mb-8 animate-pulse uppercase tracking-[0.2em] font-black">Biometric_Scan_Active</h2>
                <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black rounded-[2rem] overflow-hidden border-2 border-evalion-teal/30 shadow-[0_0_100px_rgba(0,240,255,0.1)]">
                     <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                        <div className="relative w-80 h-80">
                            <motion.div className="absolute top-0 left-0 right-0 h-1 bg-evalion-teal shadow-[0_0_30px_#00F0FF]" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-evalion-teal rounded-tl-2xl"></div>
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-evalion-teal rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-evalion-teal rounded-bl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-evalion-teal rounded-br-2xl"></div>
                        </div>
                     </div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <Activity className="text-evalion-teal opacity-20 animate-pulse" size={120} />
                        <button onClick={() => navigateTo('INTERVIEW')} className="z-30 px-8 py-3 bg-white text-black font-black font-mono text-[10px] rounded uppercase tracking-widest">Override_Manual_Verify</button>
                     </div>
                     <div className="absolute bottom-4 left-4 font-mono text-[10px] text-evalion-success bg-black/50 px-2 py-1 uppercase font-black">OS_KERNEL: V1.0_STABLE</div>
                </div>
            </div>
        );
        case 'INTERVIEW': return <InterviewRoom user={user!} onComplete={handleInterviewComplete} onNavigate={navigateTo} />;
        case 'ANALYSIS': return (
            <div className="flex flex-col items-center justify-center h-screen pt-24">
                <RefreshCw size={64} className="text-evalion-teal animate-spin mb-8" />
                <h2 className="text-3xl font-black text-white tracking-[0.4em] animate-pulse uppercase font-mono">Synthesizing_Intelligence</h2>
                <div className="mt-4 text-[10px] font-mono text-evalion-textDim uppercase tracking-[0.8em] opacity-40 font-black">CALIBRATING_NEURAL_SCORING_V4.2.0</div>
            </div>
        );
        case 'REPORT': return <div className="pt-32 pb-12 px-6">{currentReport && <FinalReportDashboard report={currentReport} />}</div>;
        case 'PLATFORM': return <PlatformPage onNavigate={navigateTo} />;
        case 'PRICING': return <PricingPage />;
        case 'ENTERPRISE': return <EnterprisePage />;
        case 'DOCS': return <DocsPage />;
        case 'SOLUTIONS': return <SolutionsPage onNavigate={navigateTo} />;
        case 'ABOUT': return <CompanyPage />;
        case 'CONTACT': return <ContactPage />;
        case 'POLICY': return <PolicyPage />;
        case 'PROFILE': return <div className="pt-32 px-6"><UserProfile user={user!} onUpdate={(u) => { setUser(u); APIService.updateUser(u); addToast('success', 'PROFILE_COMMITTED'); }} onCancel={goBack} /></div>;
        case 'ATS': return <ATSView onBack={goBack} notify={addToast} user={user!} />;
        case 'DEMO_SESSION': return <DemoSession onExit={goBack} />;
        case 'DEPLOY_PAGE': return <DeployPage onNavigate={navigateTo} />;
        case 'STATUS': return <StatusPage />;
        case 'FRONTEND_ARCH': return <FrontendArchPage onNavigate={navigateTo} />;
        case 'BACKEND_ARCH': return <BackendArchPage onNavigate={navigateTo} />;
        case 'AI_ENGINE_ARCH': return <AIEngineArchPage onNavigate={navigateTo} />;
        case 'SECURITY_ARCH': return <SecurityArchPage onNavigate={navigateTo} />;
        case 'BILLING': return <BillingPage user={user!} onNavigate={navigateTo} />;
        default: return <LandingPage onNavigate={navigateTo} />;
    }
  };

  // Render ApiKeyGuard if API key is invalid, takes precedence over intro and all other app content.
  if (isApiKeyInvalid) return <ApiKeyGuard />;
  
  if (isIntroing) return <Intro onComplete={() => setIsIntroing(false)} />;

  return (
    <div className="min-h-screen bg-evalion-bg text-evalion-text font-sans selection:bg-evalion-teal selection:text-evalion-bg">
      <NetworkStatusGuard />
      <HexGridBackground />
      <Header 
        user={user} 
        state={state} 
        historyLength={history.length}
        socketStatus={socketStatus}
        onNavigate={navigateTo} 
        onBack={goBack} 
        onLogout={handleLogout} 
        onProfile={() => navigateTo('PROFILE')} 
        onOpenCommandHub={() => setIsCommandHubOpen(true)}
      />
      
      {user && (
        <NeuralCommandHub 
          isOpen={isCommandHubOpen} 
          onClose={() => setIsCommandHubOpen(false)} 
          onNavigate={navigateTo}
          role={user.role}
        />
      )}

      <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
        <AnimatePresence>
            {notifications.map(n => (
                <motion.div 
                    key={n.id} 
                    initial={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(10px)' }} 
                    animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(10px)' }}
                    className={`pointer-events-auto p-5 rounded-2xl border-2 glass-panel flex flex-col gap-2 shadow-2xl ${n.type === 'error' ? 'border-evalion-danger/40' : n.type === 'success' ? 'border-evalion-teal/40' : 'border-evalion-purple/40'}`}
                >
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${n.type === 'error' ? 'bg-evalion-danger/10 text-evalion-danger' : n.type === 'success' ? 'bg-evalion-teal/10 text-evalion-teal' : 'bg-evalion-purple/10 text-evalion-purple'}`}>
                                {n.type === 'success' ? <CheckCircle size={22} /> : n.type === 'error' ? <AlertTriangle size={22} /> : <Info size={22} />}
                            </div>
                            <span className={`text-xs font-mono font-black uppercase tracking-[0.15em] ${n.type === 'error' ? 'text-evalion-danger' : n.type === 'success' ? 'text-evalion-teal' : 'text-evalion-purple'}`}>{n.message}</span>
                        </div>
                        <button onClick={() => setNotifications(prev => prev.filter(not => not.id !== n.id))} className="hover:rotate-90 transition-transform p-1 pointer-events-auto text-white/40 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                    {n.recoveryHint && (
                        <p className="text-[10px] font-mono text-evalion-textDim leading-relaxed uppercase pl-12 border-t border-white/5 pt-2 opacity-80 italic">
                            RECOVERY_HINT: {n.recoveryHint}
                        </p>
                    )}
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <main className="min-h-screen flex flex-col relative z-10">
        <AnimatePresence mode="wait">
            <motion.div 
              key={state} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="w-full flex-1 flex flex-col"
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};
