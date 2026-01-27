
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useMemo } from 'react';
import { motion as framerMotion } from 'framer-motion';
import { User, AppState, FinalReport, ATSApplication, ATSStage } from '../types';
import { APIService } from '../services';
import { Play, FileText, Clock, Settings, Briefcase, Users, PieChart, ShieldCheck, Layout, CreditCard, Activity, Cpu, Mic, Video, ChevronRight, Search, Plus, Calendar, Star, Target, Globe2, Zap, ArrowUpRight } from 'lucide-react';
import { RegionalLoadMap } from './RegionalLoadMap';
import { VerificationCertificate } from './VerificationCertificate';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';


const motion = framerMotion as any;

interface CandidateDashProps {
  user: User;
  onStartInterview: () => void;
  onNavigate: (state: AppState) => void;
}

interface RecruiterDashProps {
  user: User;
  onNavigate: (state: AppState) => void;
}

const WorkflowOrchestrator = ({ steps, activeIdx }: { steps: string[], activeIdx: number }) => (
    <div className="flex items-center gap-4 w-full p-4 glass-panel-item rounded-2xl border border-white/5 mb-10 overflow-x-auto custom-scrollbar">
        {steps.map((step, i) => (
            <React.Fragment key={i}>
                <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-black ${
                        i < activeIdx ? 'bg-evalion-success text-evalion-bg' : i === activeIdx ? 'bg-evalion-teal text-evalion-bg animate-pulse shadow-[0_0_15px_#00F0FF]' : 'bg-white/5 text-white/20 border border-white/10'
                    }`}>
                        {i < activeIdx ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-black ${
                        i <= activeIdx ? 'text-white' : 'text-white/20'
                    }`}>{step}</span>
                </div>
                {i < steps.length - 1 && <div className="w-8 h-[1px] bg-white/10 shrink-0"></div>}
            </React.Fragment>
        ))}
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-4 rounded-xl border border-evalion-teal/30 shadow-2xl">
                <p className="text-[10px] font-mono text-evalion-textDim uppercase tracking-widest">{label}</p>
                <p className="text-xl font-bold font-mono text-evalion-teal neon-text">{`${payload[0].value} Nodes`}</p>
            </div>
        );
    }
    return null;
};

const PipelineMetricsChart = ({ applications, stages }: { applications: ATSApplication[], stages: ATSStage[] }) => {
    const chartData = useMemo(() => {
        return stages
            .map(stage => ({
                name: stage.name.replace('_', ' '),
                count: applications.filter(app => app.stageId === stage.id).length,
                order: stage.order,
            }))
            .sort((a, b) => a.order - b.order);
    }, [applications, stages]);

    return (
        <div className="w-full h-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 1" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
                        tickLine={false} 
                        dy={10}
                    />
                    <YAxis 
                        tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                        axisLine={false}
                        tickLine={false} 
                        allowDecimals={false} 
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }} />
                    <Bar 
                        dataKey="count" 
                        fill="url(#colorUv)" 
                        radius={[4, 4, 0, 0]}
                        stroke="#00F0FF"
                        strokeWidth={1}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const CandidateDashboard: React.FC<CandidateDashProps> = ({ user, onStartInterview, onNavigate }) => {
  const [pastReports, setPastReports] = useState<FinalReport[]>([]);

  useEffect(() => {
    APIService.getLatestReport().then(r => {
        if (r) {
            setPastReports([r]);
        } else {
            // Create a mock approved report for demonstration if none exists
            const mockReport: FinalReport = {
                id: 'mock_cert_01',
                overallScore: 94,
                metrics: [],
                questionResults: [],
                summary: 'Exemplary performance in system design and algorithmic challenges.',
                hiringDecision: 'APPROVE', 
                generatedAt: new Date().toISOString()
            };
            setPastReports([mockReport]);
        }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <WorkflowOrchestrator 
        steps={['Auth', 'Identity Verify', 'Assessment', 'Neural Ranking', 'Hire Decision']} 
        activeIdx={pastReports[0]?.hiringDecision === 'APPROVE' ? 4 : 3} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
      >
        <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-evalion-teal/5 rounded-full blur-[100px] group-hover:bg-evalion-teal/10 transition-all duration-1000"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="px-4 py-1.5 bg-evalion-teal/10 border border-evalion-teal/20 rounded-full text-[10px] font-black font-mono text-evalion-teal uppercase tracking-widest">Uplink_Identity_Confirmed</div>
                   <div className="w-2 h-2 rounded-full bg-evalion-success animate-pulse shadow-[0_0_10px_#05FF00]"></div>
                </div>
                <h1 className="text-5xl font-black text-white mb-3 tracking-tighter leading-none uppercase">Session_01: {user.name.split(' ')[0]}</h1>
                <p className="text-evalion-textDim font-mono text-[11px] mb-8 uppercase tracking-[0.4em] font-black opacity-40">Candidate_Node: {user.id.toUpperCase()}</p>
            </div>
            <div className="border-t border-white/5 pt-8 relative z-10">
                <div className="text-[10px] font-black font-mono text-evalion-teal uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                    <Activity size={16} className="animate-pulse" /> Neural_Health_Telemetry
                </div>
                <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-3 text-evalion-success text-[10px] font-black font-mono uppercase tracking-widest"><ShieldCheck size={18}/> Auth: <span className="text-white opacity-80">STABLE</span></div>
                    <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-3 text-evalion-teal text-[10px] font-black font-mono uppercase tracking-widest"><Activity size={18}/> Ping: <span className="text-white opacity-80">14MS</span></div>
                    <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-3 text-evalion-purple text-[10px] font-black font-mono uppercase tracking-widest"><Video size={18}/> Link: <span className="text-white opacity-80">ULTRA_HD</span></div>
                </div>
            </div>
        </div>

        <div className="glass-panel p-10 rounded-[3rem] border-2 border-evalion-teal/20 flex flex-col text-center items-center justify-center bg-evalion-teal/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-10"></div>
            <h2 className="text-[11px] font-black text-evalion-teal font-mono mb-6 uppercase tracking-[0.5em] relative z-10 animate-pulse">Execute_Protocol</h2>
            <div className="mb-8 relative z-10">
                <p className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Senior Full Stack</p>
                <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-evalion-textDim font-black font-mono uppercase tracking-widest">Protocol_Ref: #AX-2024-81</div>
            </div>
            <button 
                onClick={onStartInterview}
                className="w-full px-8 py-5 bg-evalion-teal text-evalion-bg font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_50px_rgba(0,240,255,0.4)] relative z-10 active:scale-95 text-[12px] uppercase tracking-[0.2em]"
            >
                <Play size={20} fill="currentColor" /> BOOT_NEURAL_OS
            </button>
            <div className="text-[10px] font-black font-mono text-evalion-textDim mt-6 uppercase tracking-widest relative z-10 opacity-30">EST_RESOURCES: 45M_COGNITIVE_LOAD</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <h3 className="text-[11px] font-black text-white font-mono uppercase tracking-[0.4em] flex items-center gap-4">
                    <FileText size={18} className="text-evalion-teal" /> Hist_Buffer_Cache
                </h3>
                <span className="text-[10px] font-black font-mono text-evalion-teal bg-evalion-teal/10 px-4 py-1.5 rounded-full border border-evalion-teal/20 tracking-widest uppercase">NODES: {pastReports.length}</span>
            </div>
            
            {pastReports.length > 0 ? (
                <div className="space-y-6">
                    {pastReports.map((report, i) => (
                        <div key={i} onClick={() => onNavigate('REPORT')} className="glass-panel-item p-6 rounded-[2rem] border border-white/5 hover:border-evalion-teal/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl">
                            <div>
                                <div className="text-lg font-black text-white mb-2 group-hover:text-evalion-teal transition-colors uppercase tracking-tighter">Technical_Assessment_01</div>
                                <div className="text-[9px] font-black font-mono text-evalion-textDim uppercase tracking-[0.2em] opacity-50 flex items-center gap-3">
                                    <Clock size={12} /> Sync_Time: {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '24_OCT_2024'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-evalion-teal font-mono tracking-tighter neon-text">{report.overallScore}%</div>
                                <div className={`text-[10px] font-black font-mono mt-1 uppercase tracking-widest ${report.hiringDecision === 'APPROVE' ? 'text-evalion-success' : 'text-evalion-danger'}`}>
                                    {report.hiringDecision}_VECT
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center text-evalion-textDim/20 font-mono text-[10px] border-2 border-dashed border-white/5 rounded-[2.5rem] bg-black/20">
                    <Cpu size={40} className="mb-6 opacity-10 animate-pulse" />
                    EMPTY_COGNITIVE_HISTORY
                </div>
            )}
        </div>

        <VerificationCertificate user={user} report={pastReports[0] || null} />
      </div>
    </div>
  );
}

export const RecruiterDashboard: React.FC<RecruiterDashProps> = ({ user, onNavigate }) => {
    const [stats, setStats] = useState({ jobs: 0, candidates: 0 });
    const [applications, setApplications] = useState<ATSApplication[]>([]);
    const [stages, setStages] = useState<ATSStage[]>([]);
    const isInterviewer = user.role === 'INTERVIEWER';

    useEffect(() => {
        const loadData = async () => {
            const jobs = await APIService.getJobs();
            const apps = await APIService.getApplications();
            setStats({ jobs: jobs.length, candidates: apps.length });
            setApplications(apps);
            setStages(APIService.getStages());
        };
        loadData();
    }, []);

    return (
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
        <WorkflowOrchestrator 
            steps={['Pipeline Def', 'Screening Active', 'Neural Audit', 'Panel Sync', 'Decision']} 
            activeIdx={1} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-panel ${isInterviewer ? 'border-evalion-teal/30 shadow-[0_0_60px_rgba(0,240,255,0.05)]' : 'glass-panel-purple shadow-2xl'} p-12 rounded-[4rem] border border-white/10 relative overflow-hidden group shadow-2xl`}
        >
          <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] ${isInterviewer ? 'bg-evalion-teal/5' : 'bg-evalion-purple/5'} rounded-full blur-[150px] group-hover:opacity-80 transition-all duration-1000`}></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`px-5 py-2 ${isInterviewer ? 'bg-evalion-teal/10 border-evalion-teal/30 text-evalion-teal' : 'bg-evalion-purple/10 border-evalion-purple/30 text-evalion-purple'} border rounded-full text-[10px] font-black font-mono uppercase tracking-[0.4em] shadow-inner`}>
                        {isInterviewer ? 'Staff_Protocol_v1.2' : 'Admin_Protocol_v1.0'}
                    </div>
                    <div className="w-2.5 h-2.5 bg-evalion-success rounded-full animate-pulse shadow-[0_0_12px_#05FF00]"></div>
                </div>
                <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-none">{isInterviewer ? 'Staff Terminal' : user.companyName}</h1>
                <p className="text-evalion-textDim text-[12px] font-black font-mono uppercase tracking-[0.5em] opacity-40">{isInterviewer ? 'Interviewer_Node' : 'Architect_Terminal_Root'}: {user.name.toUpperCase()}</p>
              </div>
              {!isInterviewer && (
                <button 
                  onClick={() => onNavigate('ATS')}
                  className="px-10 py-5 bg-white text-black font-black text-[11px] font-mono rounded-[2rem] hover:bg-evalion-teal transition-all flex items-center gap-4 uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    <Plus size={20} /> Deploy_New_Protocol
                </button>
              )}
              {isInterviewer && (
                <div className="flex items-center gap-4 text-evalion-teal/60 font-mono text-[10px] uppercase tracking-widest font-black mb-2">
                    <Star size={14} className="animate-pulse" /> Focus_Mode: Evaluation_Assigned
                </div>
              )}
          </div>
        </motion.div>
  
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-10">
                <div className={`glass-panel ${isInterviewer ? 'border-evalion-teal/10' : 'glass-panel-purple'} rounded-[3rem] p-8 space-y-6 border border-white/5 shadow-2xl`}>
                    <button onClick={() => onNavigate('ATS')} className={`glass-panel-item w-full text-left p-6 rounded-[2rem] ${isInterviewer ? 'hover:bg-evalion-teal/10' : 'hover:bg-evalion-purple/10'} transition-all border border-white/5 group relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isInterviewer ? 'bg-evalion-teal' : 'bg-evalion-purple'} opacity-60`}></div>
                        <h3 className="font-black text-white text-[12px] uppercase tracking-[0.2em] flex items-center justify-between font-mono">
                            {isInterviewer ? 'Assigned_Queue' : 'Pipeline_Control'} <ChevronRight size={18} className={`group-hover:translate-x-2 transition-transform ${isInterviewer ? 'text-evalion-teal' : 'text-evalion-purple'}`} />
                        </h3>
                        <p className="text-[10px] font-mono font-bold text-evalion-textDim mt-3 uppercase tracking-widest opacity-40">
                            {isInterviewer ? 'View pending evaluations' : 'Manage active recruitment nodes'}
                        </p>
                    </button>
                    <button onClick={() => onNavigate('REPORT')} className={`glass-panel-item w-full text-left p-6 rounded-[2rem] ${isInterviewer ? 'hover:bg-evalion-teal/10' : 'hover:bg-evalion-purple/10'} transition-all border border-white/5 group relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isInterviewer ? 'bg-evalion-teal' : 'bg-evalion-purple'} opacity-60`}></div>
                        <h3 className="font-black text-white text-[12px] uppercase tracking-[0.2em] flex items-center justify-between font-mono">
                            Neural_Synthesis <ChevronRight size={18} className={`group-hover:translate-x-2 transition-transform ${isInterviewer ? 'text-evalion-teal' : 'text-evalion-purple'}`} />
                        </h3>
                        <p className="text-[10px] font-mono font-bold text-evalion-textDim mt-3 uppercase tracking-widest opacity-40">Assess candidate logic vectors</p>
                    </button>
                    {!isInterviewer && (
                    <button onClick={() => onNavigate('BILLING')} className={`glass-panel-item w-full text-left p-6 rounded-[2rem] hover:bg-evalion-purple/10 transition-all border border-white/5 group relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-evalion-danger opacity-60`}></div>
                        <h3 className="font-black text-white text-[12px] uppercase tracking-[0.2em] flex items-center justify-between font-mono">
                            Billing & Usage <ChevronRight size={18} className={`group-hover:translate-x-2 transition-transform text-evalion-danger`} />
                        </h3>
                        <p className="text-[10px] font-mono font-bold text-evalion-textDim mt-3 uppercase tracking-widest opacity-40">Manage plan and view invoices</p>
                    </button>
                    )}
                </div>

                <div className="glass-panel rounded-[3rem] p-10 border border-white/5 bg-gradient-to-br from-black/40 via-transparent to-transparent shadow-2xl">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 font-mono">
                            <Globe2 size={16} className="text-evalion-teal" /> Neural_Node_Load
                        </h3>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-evalion-success animate-pulse"></div>
                             <span className="text-[8px] font-mono text-evalion-success uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="h-40 relative overflow-hidden rounded-2xl bg-black/60 shadow-inner border border-white/5">
                        <RegionalLoadMap />
                    </div>
                    <div className="mt-8 space-y-6">
                        {[
                            { label: isInterviewer ? 'Depth_Accuracy' : 'Active_Nodes', value: isInterviewer ? '98.2%' : stats.jobs.toLocaleString(), icon: isInterviewer ? Target : Briefcase, color: 'text-evalion-teal', barColor: 'bg-evalion-teal', width: isInterviewer ? '98%' : '70%' },
                            { label: 'Trust_Index', value: '94.2%', icon: ShieldCheck, color: 'text-evalion-success', barColor: 'bg-evalion-success', width: '94%' },
                        ].map((stat, idx) => (
                            <div key={stat.label} className="relative group">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-4 text-[10px] text-evalion-textDim font-mono font-black uppercase tracking-[0.2em]">
                                        <stat.icon size={18} className={`${stat.color} group-hover:scale-110 transition-transform`}/> {stat.label}
                                    </div>
                                    <div className="text-xl font-black text-white font-mono tracking-tighter">{stat.value}</div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: stat.width }}
                                        className={`h-full ${stat.barColor} shadow-[0_0_15px_currentColor] opacity-60`}
                                        transition={{ duration: 1.5, delay: idx * 0.2, ease: "circOut" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 glass-panel rounded-[3rem] p-10 flex flex-col border border-white/10 bg-black/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-8 border-b border-white/5 gap-6">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 font-mono">
                        <PieChart size={20} className="text-evalion-teal" /> Pipeline_Funnel_Metrics
                    </h3>
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <input type="text" placeholder="FILTER_ACTIVITY..." className="bg-black/40 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-[10px] font-black font-mono text-white outline-none focus:border-evalion-teal transition-all w-full tracking-[0.2em] shadow-inner" />
                        </div>
                    </div>
                </div>
                
                <div className="flex-1">
                    <PipelineMetricsChart applications={applications} stages={stages} />
                </div>
            </div>
        </div>
      </div>
    );
  }
