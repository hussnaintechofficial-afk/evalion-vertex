
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { FinalReport, EvaluationMetric, QuestionResult } from '../types';
import { AlertTriangle, Share2, Download, CheckCircle2, Target, MessageSquare, Zap, Lightbulb, TrendingUp, Activity, Cpu } from 'lucide-react';

const motion = framerMotion as any;

interface MetricBarProps {
  metric: EvaluationMetric;
  index: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ metric, index }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-evalion-text uppercase tracking-widest">{metric.label}</span>
        <span className="text-evalion-teal font-black">{metric.score}%</span>
      </div>
      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
        <motion.div 
          className="h-full bg-evalion-teal shadow-[0_0_15px_#00F0FF]"
          initial={{ width: 0 }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: "circOut" }}
        />
      </div>
    </div>
  );
};

const SubScoreItem = ({ label, score, icon: Icon }: { label: string; score: number; icon: any }) => (
  <div className="space-y-1.5 glass-panel-item p-3 rounded-lg border border-white/5">
    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-evalion-textDim">
      <div className="flex items-center gap-2"><Icon size={12} className="text-evalion-teal" /> {label}</div>
      <span className="text-white font-black">{score}%</span>
    </div>
    <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className="h-full bg-evalion-teal shadow-[0_0_8px_rgba(0,240,255,0.6)]"
      />
    </div>
  </div>
);

interface QuestionAnalysisCardProps {
  result: QuestionResult;
  index: number;
}
const QuestionAnalysisCard: React.FC<QuestionAnalysisCardProps> = ({ result, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + (index * 0.1) }}
    className="glass-panel p-8 rounded-[2rem] border-l-4 border-l-evalion-teal/50 hover:border-l-evalion-teal transition-all mb-8 shadow-2xl"
  >
    <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6 border-b border-white/5 pb-8">
      <div className="max-w-[100%] lg:max-w-[65%]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-black font-mono bg-evalion-teal/10 text-evalion-teal border border-evalion-teal/20 px-3 py-1 rounded-full uppercase tracking-widest">Question_{result.questionId}</span>
          <span className="text-[10px] font-mono text-evalion-textDim uppercase tracking-[0.3em] font-black">{result.category}</span>
        </div>
        <h4 className="text-white font-black text-lg md:text-xl leading-relaxed uppercase tracking-tight">{result.questionText}</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
        <SubScoreItem label="Technical" score={result.detailedFeedback.scores.technicalAccuracy} icon={Target} />
        <SubScoreItem label="Communication" score={result.detailedFeedback.scores.communicationClarity} icon={MessageSquare} />
        <SubScoreItem label="Logic" score={result.detailedFeedback.scores.problemSolving} icon={Zap} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-evalion-success font-mono uppercase tracking-widest">
          <CheckCircle2 size={14} /> Key_Strengths
        </div>
        <ul className="space-y-3">
          {result.detailedFeedback.strengths.map((s, i) => (
            <li key={i} className="text-xs text-evalion-textDim flex items-start gap-3 glass-panel-item p-3 rounded-xl border border-white/5">
              <span className="text-evalion-success mt-1">●</span> {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-evalion-danger font-mono uppercase tracking-widest">
          <TrendingUp size={14} className="rotate-90" /> Vector_Improvements
        </div>
        <ul className="space-y-3">
          {result.detailedFeedback.improvements.map((s, i) => (
            <li key={i} className="text-xs text-evalion-textDim flex items-start gap-3 glass-panel-item p-3 rounded-xl border border-white/5">
              <span className="text-evalion-danger mt-1">●</span> {s}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="bg-evalion-teal/5 p-6 rounded-2xl border border-evalion-teal/10 relative overflow-hidden group/synth">
      <div className="absolute inset-0 bg-cyber-grid bg-[length:15px_15px] opacity-[0.03]"></div>
      <div className="relative z-10">
        <div className="text-[10px] font-black font-mono text-evalion-teal uppercase mb-3 flex items-center gap-2 tracking-[0.2em]"><Lightbulb size={14} className="animate-pulse"/> AI_Synthesis_Feedback</div>
        <p className="text-sm font-mono text-evalion-text leading-relaxed opacity-90">{result.detailedFeedback.summary}</p>
      </div>
    </div>
  </motion.div>
);

export const FinalReportDashboard: React.FC<{ report: FinalReport }> = ({ report }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Score Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 glass-panel p-10 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-evalion-teal/5 pointer-events-none group-hover:to-evalion-teal/10 transition-all"></div>
                
                <h3 className="text-[11px] font-black font-mono text-evalion-teal mb-8 uppercase tracking-[0.4em] relative z-10">Aggregate_Fit_Index</h3>
                
                <div className="relative w-56 h-56 flex items-center justify-center mb-10 group-hover:scale-105 transition-transform duration-700">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                        <circle cx="50%" cy="50%" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="none" />
                        <motion.circle 
                            cx="50%" cy="50%" r="90" 
                            stroke={report.overallScore > 85 ? '#00F0FF' : report.overallScore > 70 ? '#FFA500' : '#FF2A6D'}
                            strokeWidth="12" 
                            fill="none" 
                            strokeDasharray="565"
                            strokeDashoffset={565 - (565 * report.overallScore) / 100}
                            initial={{ strokeDashoffset: 565 }}
                            animate={{ strokeDashoffset: 565 - (565 * report.overallScore) / 100 }}
                            transition={{ duration: 2.5, ease: "circOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="text-7xl font-black text-white font-mono tracking-tighter neon-text">{report.overallScore}</div>
                </div>

                <div className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.3em] relative z-10 shadow-2xl border ${
                    report.hiringDecision === 'APPROVE' ? 'bg-evalion-success/10 text-evalion-success border-evalion-success/40' :
                    report.hiringDecision === 'REJECT' ? 'bg-evalion-danger/10 text-evalion-danger border-evalion-danger/40' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/40'
                }`}>
                    {report.hiringDecision}_VECT
                </div>
            </motion.div>

            {/* Detailed Metrics */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 lg:col-span-2 glass-panel p-10 rounded-[3rem] shadow-2xl"
            >
                <h3 className="text-[11px] font-black font-mono text-evalion-textDim mb-10 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Activity size={18} className="text-evalion-teal animate-pulse" /> Neural_Vector_Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mb-10">
                    <div>
                        {report.metrics.slice(0, 2).map((m, i) => <MetricBar key={i} metric={m} index={i} />)}
                    </div>
                    <div>
                        {report.metrics.slice(2, 4).map((m, i) => <MetricBar key={i} metric={m} index={i+2} />)}
                    </div>
                </div>

                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden mb-10">
                    <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none"><Cpu size={120} /></div>
                    <h4 className="text-[10px] font-black text-evalion-teal mb-4 font-mono tracking-[0.2em] flex items-center gap-2 uppercase">
                        <AlertTriangle size={14} /> Executive_Kernel_Summary
                    </h4>
                    <p className="text-sm md:text-base text-evalion-text leading-relaxed font-mono opacity-80 uppercase tracking-tight">
                        {report.summary}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                     <button className="flex-1 py-4 bg-evalion-teal text-evalion-bg font-black rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(0,240,255,0.2)] active:scale-95">
                        <Download size={18} /> DOWNLOAD_PROTOCOL_REPORT
                     </button>
                     <button className="px-6 py-4 glass-panel-item border border-white/10 text-white rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center active:scale-95">
                        <Share2 size={20} />
                     </button>
                </div>
            </motion.div>
        </div>

        {/* Detailed Question Feedback Section */}
        <div className="mt-16 space-y-10">
          <div className="flex items-center gap-6">
            <h3 className="text-sm font-black font-mono text-white uppercase tracking-[0.5em] whitespace-nowrap">Assessment_Node_Log</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-evalion-teal/40 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {report.questionResults.map((result, idx) => (
                <QuestionAnalysisCard key={idx} result={result} index={idx} />
            ))}
          </div>
        </div>
    </div>
  );
};
