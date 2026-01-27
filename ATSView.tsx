
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { ATSJob, ATSStage, ATSApplication, User } from '../types';
import { APIService, AiEngineService, socketService } from '../services';
import { ChevronRight, MoreHorizontal, Filter, Search, Plus, X, Cpu, Sparkles, RefreshCw, Lock, Loader2, ArrowUpRight, Inbox, Target, Layers, Radio } from 'lucide-react';
import { CandidateDeepDive } from './CandidateDeepDive';

const motion = framerMotion as any;

const formatTimeAgo = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    return "Just now";
};

type DateRangeOption = 'ALL' | '24H' | '7D' | '30D';

export const ATSView = ({ onBack, notify, user }: { onBack: () => void, notify: (type: 'success' | 'error' | 'info', message: string, recoveryHint?: string) => void, user: User }) => {
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<ATSJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<ATSJob | null>(null);
    const [applications, setApplications] = useState<ATSApplication[]>([]);
    const [scoringIds, setScoringIds] = useState<string[]>([]);
    const [editingTagsId, setEditingTagsId] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<ATSApplication | null>(null);
    const [newTagValue, setNewTagValue] = useState('');
    const tagInputRef = useRef<HTMLInputElement>(null);
    const stages = APIService.getStages();

    const isInterviewer = user.role === 'INTERVIEWER';

    // --- Filtering State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{ 
        tags: string[], 
        departments: string[],
        stages: string[],
        dateRange: DateRangeOption
    }>({ tags: [], departments: [], stages: [], dateRange: 'ALL' });

    useEffect(() => { loadData(); }, []);

    // --- Real-time Subscription ---
    useEffect(() => {
        const handleRealtimeUpdate = async (data: any) => {
            // Only refresh if the update pertains to the currently viewed job
            if (selectedJob && data.jobId === selectedJob.id) {
                // Use a silent refresh (don't set main loading spinner)
                const freshApps = await APIService.getApplications(selectedJob.id);
                setApplications(freshApps);
                // Optional: Notify user of live update
                // notify('info', 'LIVE_SYNC_ACTIVE', 'Pipeline data updated from remote.');
            }
        };

        socketService.on('pipeline_update', handleRealtimeUpdate);
        return () => socketService.off('pipeline_update', handleRealtimeUpdate);
    }, [selectedJob]); // Re-subscribe when selectedJob changes to ensure closure captures correct ID

    const loadData = async () => {
        try {
            await APIService.initialize();
            const fetchedJobs = await APIService.getJobs();
            setJobs(fetchedJobs);
            if (fetchedJobs.length > 0 && !selectedJob) {
                setSelectedJob(fetchedJobs[0]);
                fetchApplications(fetchedJobs[0].id);
            }
            setLoading(false);
        } catch (e) { notify('error', 'Failed to load pipeline data', 'Try refreshing the browser.'); }
    };

    const fetchApplications = async (jobId: string) => {
        setLoading(true);
        const apps = await APIService.getApplications(jobId);
        setApplications(apps);
        setTimeout(() => setLoading(false), 600);
    };

    const handleJobSelect = (job: ATSJob) => {
        if (selectedJob?.id === job.id) return;
        setSelectedJob(job);
        fetchApplications(job.id);
    };

    /**
     * FULL ENGINE AI SCAN
     * Orchestrates Resume Parsing and Neural Ranking in sequence.
     */
    const runDeepNeuralAudit = async (appId: string) => {
        if (scoringIds.includes(appId)) return;
        
        if (!selectedJob) {
             notify('error', 'CONTEXT_MISSING', 'Select a pipeline job before running audit.');
             return;
        }
        
        setScoringIds(prev => [...prev, appId]);
        notify('info', 'NEURAL_AUDIT_INITIALIZED', 'Parsing resume vectors and ranking fit.');

        try {
            const app = applications.find(a => a.id === appId);
            if (!app) throw new Error("NODE_NOT_FOUND");
            if (!app.resumeText) throw new Error("RESUME_DATA_EMPTY");

            // Step 1: Parsing (Flash Model)
            let parsedData;
            try {
                parsedData = await AiEngineService.parseResume(app.resumeText);
            } catch (err) {
                throw new Error("PARSING_FAILURE");
            }
            
            // Step 2: Ranking (Pro Model)
            let ranking;
            try {
                ranking = await AiEngineService.rankCandidate(selectedJob, parsedData);
            } catch (err) {
                throw new Error("RANKING_FAILURE");
            }

            const updatedApp = { 
                ...app, 
                parsedData, 
                matchScore: ranking.score, 
                rankingReason: ranking.justification 
            };

            await APIService.updateApplication(updatedApp);
            // Local state update is handled by socket subscription now, but optimistic is fine too.
            // Keeping setApplications here provides immediate feedback before socket roundtrip.
            setApplications(prev => prev.map(a => a.id === appId ? updatedApp : a));
            
            notify('success', 'NEURAL_RANKING_COMPLETE', `Match Score: ${ranking.score}%`);
        } catch (e: any) {
            let errorMsg = 'NEURAL_ENGINE_FAILURE';
            let hint = 'Check model bandwidth or API quota.';

            if (e.message === 'RESUME_DATA_EMPTY') {
                errorMsg = 'DATA_VOID_DETECTED';
                hint = 'Candidate profile lacks resume text content.';
            } else if (e.message === 'PARSING_FAILURE') {
                errorMsg = 'PARSE_VECTOR_ERROR';
                hint = 'Resume format unstructured or illegible.';
            } else if (e.message === 'RANKING_FAILURE') {
                errorMsg = 'INFERENCE_DROPPED';
                hint = 'Ranking model failed to converge. Retry.';
            } else if (e.message === 'NODE_NOT_FOUND') {
                errorMsg = 'CACHE_MISS';
                hint = 'Application ID not found in local memory.';
            }

            notify('error', errorMsg, hint);
        } finally {
            setScoringIds(prev => prev.filter(id => id !== appId));
        }
    };

    const moveCandidate = async (appId: string, direction: 'next' | 'prev') => {
        if (isInterviewer) {
            notify('error', 'ADMIN_ACCESS_REQUIRED', 'Only Recruiters can modify pipeline state.');
            return;
        }
        
        const app = applications.find(a => a.id === appId);
        if (!app) return;
        
        const currentStageIdx = stages.findIndex(s => s.id === app.stageId);
        const nextIdx = direction === 'next' ? currentStageIdx + 1 : currentStageIdx - 1;
        
        if (nextIdx >= 0 && nextIdx < stages.length) {
            const nextStage = stages[nextIdx];
            const originalApplications = [...applications];
            
            // Optimistic Update
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, stageId: nextStage.id } : a));
            
            try {
                await APIService.updateApplicationStage(appId, nextStage.id);
                notify('success', `CANDIDATE_MOVED: ${nextStage.name}`);
            } catch (e: any) {
                // Rollback
                setApplications(originalApplications);
                notify('error', 'PIPELINE_SYNC_FAILURE', 'State mismatch detected. Rolling back transaction.');
            }
        }
    };

    const filteredApplications = useMemo(() => {
        const now = new Date();
        return applications.filter(app => {
            const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTags = activeFilters.tags.length === 0 || activeFilters.tags.every(tag => app.tags.includes(tag));
            const matchesStage = activeFilters.stages.length === 0 || activeFilters.stages.includes(app.stageId);
            
            let matchesDate = true;
            if (activeFilters.dateRange !== 'ALL') {
                const appDate = new Date(app.appliedDate);
                const diffDays = Math.ceil(Math.abs(now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
                if (activeFilters.dateRange === '24H') matchesDate = diffDays <= 1;
                else if (activeFilters.dateRange === '7D') matchesDate = diffDays <= 7;
                else if (activeFilters.dateRange === '30D') matchesDate = diffDays <= 30;
            }

            return matchesSearch && matchesTags && matchesStage && matchesDate;
        });
    }, [applications, searchQuery, activeFilters]);
    
    const toggleFilter = (type: keyof typeof activeFilters, value: string) => {
        if (type === 'dateRange') {
            setActiveFilters(prev => ({ ...prev, dateRange: value as DateRangeOption }));
            return;
        }
        setActiveFilters(prev => {
            const current = prev[type] as string[];
            const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, [type]: newValues };
        });
    };
    
    // Fix: Explicitly handle the types of values in activeFilters to avoid unknown property errors
    const activeFilterCount = Object.values(activeFilters).reduce((acc: number, val: string | string[]) => {
        if (typeof val === 'string') return val === 'ALL' ? acc : acc + 1;
        if (Array.isArray(val)) return acc + (val as string[]).length;
        return acc;
    }, 0);

    return (
        <div className="pt-24 pb-12 px-6 h-screen flex flex-col max-w-[1920px] mx-auto relative overflow-hidden">
            <AnimatePresence>
                {selectedCandidate && (
                    <CandidateDeepDive 
                        candidate={selectedCandidate} 
                        onClose={() => setSelectedCandidate(null)} 
                    />
                )}
            </AnimatePresence>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-20">
                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <button onClick={onBack} className="flex items-center gap-2 text-evalion-textDim text-[10px] font-mono hover:text-evalion-teal mb-3 transition-all group px-2 py-1 rounded-md hover:bg-evalion-teal/5"><ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} /> SYSTEM_DASHBOARD</button>
                    <div className="relative group/switcher">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-evalion-teal/10 border border-evalion-teal/20 rounded-2xl"><Layers size={20} className="text-evalion-teal" /></div>
                            <h1 className="text-3xl font-black text-white uppercase tracking-tight hover:text-evalion-teal transition-colors flex items-center gap-2">
                                {selectedJob?.title || 'CALIBRATING...'} <ChevronRight size={20} className="opacity-40" />
                            </h1>
                        </div>
                    </div>
                </motion.div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input type="text" placeholder="SEARCH_NODES..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-[10px] text-white focus:border-evalion-teal outline-none w-80 font-mono tracking-widest" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-3 px-6 py-3 border rounded-xl transition-all font-mono text-[10px] tracking-widest font-black uppercase ${showFilters ? 'bg-evalion-teal text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                        <Filter size={14} /> FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 overflow-hidden">
                        <div className="glass-panel p-6 rounded-3xl border border-white/5 grid grid-cols-4 gap-6">
                            <div>
                                <h4 className="text-[9px] font-black text-evalion-teal uppercase tracking-widest mb-3">Sync Window</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['ALL', '24H', '7D', '30D'].map(r => (
                                        <button 
                                            key={r} 
                                            onClick={() => toggleFilter('dateRange', r)} 
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono border transition-all ${
                                                activeFilters.dateRange === r 
                                                    ? 'bg-evalion-teal text-black border-evalion-teal shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                                                    : 'bg-white/5 border-white/10 text-white hover:border-evalion-teal/50'
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 overflow-x-auto custom-scrollbar pb-8 relative z-10">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                        <RefreshCw size={64} className="text-evalion-teal animate-spin opacity-20" />
                        <div className="text-[10px] font-mono text-evalion-teal uppercase tracking-[0.6em] animate-pulse">Syncing_Pipeline_Vectors...</div>
                    </div>
                ) : (
                    <motion.div layout className="flex gap-6 h-full min-w-[1400px]">
                        {stages.map((stage) => {
                            const stageApps = filteredApplications.filter(a => a.stageId === stage.id);
                            return (
                                <div key={stage.id} className="flex-1 flex flex-col min-w-[340px]">
                                    <div className={`flex items-center justify-between p-5 rounded-t-[2rem] bg-evalion-surface border-t-4 ${stage.color} border-x border-white/5`}>
                                        <span className="text-[11px] font-black text-white font-mono uppercase tracking-[0.2em]">{stage.name}</span>
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 text-white/40">{stageApps.length}</span>
                                    </div>
                                    <div className="flex-1 bg-black/40 border-x border-b border-white/5 rounded-b-[2rem] p-3 space-y-4 overflow-y-auto custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {/* Fix: Explicitly type app as ATSApplication and cast matchScore if necessary to avoid unknown operator errors */}
                                            {stageApps.map((app: ATSApplication) => {
                                                const isScoring = scoringIds.includes(app.id);
                                                const score = (app.matchScore as number) || 0;
                                                return (
                                                    <motion.div 
                                                        key={app.id} 
                                                        layoutId={`card-${app.id}`}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        whileHover={{ y: -4, scale: 1.01 }}
                                                        onClick={() => !isScoring && setSelectedCandidate(app)}
                                                        className={`glass-panel p-6 rounded-2xl border-2 cursor-pointer transition-all ${isScoring ? 'border-evalion-teal shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-white/5 hover:border-evalion-teal/40'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <img src={app.candidateAvatar} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                                                <div>
                                                                    <div className="text-xs font-black text-white uppercase">{app.candidateName}</div>
                                                                    <div className="text-[8px] text-evalion-textDim font-mono uppercase opacity-60">{formatTimeAgo(app.appliedDate)}</div>
                                                                </div>
                                                            </div>
                                                            <div className={`text-[10px] font-black font-mono px-2.5 py-1 rounded-lg border ${score >= 90 ? 'bg-evalion-success/10 text-evalion-success border-evalion-success/40' : 'bg-evalion-teal/10 text-evalion-teal border-evalion-teal/40'}`}>
                                                                {isScoring ? <RefreshCw size={10} className="animate-spin" /> : <Target size={10} className="inline mr-1" />}
                                                                {isScoring ? 'SCORING' : score > 0 ? `${score}%` : '---'}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* NEURAL RANK ACTION */}
                                                        {(stage.id === 's2' || stage.id === 's3') && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); runDeepNeuralAudit(app.id); }}
                                                                disabled={isScoring}
                                                                className={`w-full py-2.5 mb-4 rounded-xl border-2 flex items-center justify-center gap-3 text-[10px] font-mono font-black uppercase transition-all relative overflow-hidden group/rank ${
                                                                    isScoring 
                                                                        ? 'bg-evalion-teal/5 text-evalion-teal/40 border-evalion-teal/10 cursor-not-allowed' 
                                                                        : 'bg-evalion-teal/10 text-evalion-teal border-evalion-teal/20 hover:bg-evalion-teal hover:text-black shadow-lg active:scale-95'
                                                                }`}
                                                            >
                                                                {isScoring ? (
                                                                    <><Loader2 size={14} className="animate-spin" /> SYNTHESIZING</>
                                                                ) : (
                                                                    <><Sparkles size={14} /> NEURAL_RANK</>
                                                                )}
                                                            </button>
                                                        )}

                                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                            <div className="flex gap-1">
                                                                <button onClick={(e) => { e.stopPropagation(); moveCandidate(app.id, 'prev'); }} disabled={stage.id === 's1'} className="p-1.5 hover:bg-white/10 rounded-lg opacity-40 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronRight className="rotate-180" size={14} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); moveCandidate(app.id, 'next'); }} disabled={stage.id === 's4'} className="p-1.5 hover:bg-white/10 rounded-lg opacity-40 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronRight size={14} /></button>
                                                            </div>
                                                            <div className="text-[8px] font-mono text-evalion-teal/60 flex items-center gap-1">DEEP_ANALYSIS <ArrowUpRight size={10} /></div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
