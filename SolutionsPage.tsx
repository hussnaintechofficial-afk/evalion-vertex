/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { AppState } from '../../types';
import { Briefcase, Code, BarChart, CheckCircle, ArrowRight } from 'lucide-react';

const motion = framerMotion as any;

interface SolutionsPageProps {
    onNavigate: (state: AppState) => void;
}

const SolutionCard = ({ icon: Icon, title, role, description, features, color, onAction }: any) => (
    <div className={`glass-panel p-10 rounded-[2rem] border-2 ${color.border} bg-gradient-to-b ${color.from} to-evalion-bg/50 relative overflow-hidden group flex flex-col h-full`}>
        <div className="flex items-center gap-5 mb-8">
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${color.text} group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={32} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white font-mono tracking-tighter uppercase leading-none">{title}</h3>
                <div className={`text-[9px] font-mono uppercase tracking-[0.2em] mt-2 ${color.text} opacity-80`}>{role}</div>
            </div>
        </div>
        
        <p className="text-sm text-evalion-textDim mb-10 font-mono leading-relaxed h-20 opacity-80">
            {description}
        </p>
        
        <div className="space-y-4 mb-10 flex-grow">
            {features.map((feat: string, i: number) => (
                <div key={i} className="flex items-center gap-4 text-xs font-mono text-evalion-text group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                    <CheckCircle size={14} className="text-evalion-success shrink-0" />
                    <span className="opacity-80">{feat}</span>
                </div>
            ))}
        </div>
        
        <button 
            onClick={onAction} 
            className="w-full py-5 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] font-mono text-white hover:bg-white hover:text-black transition-all group/btn flex items-center justify-center gap-3 uppercase tracking-widest shadow-inner"
        >
            View Dashboard <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
        </button>
    </div>
);

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono text-evalion-teal mb-4 uppercase tracking-[0.6em] font-black"
        >
            Organizational_Workflows
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase"
        >
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-evalion-teal via-evalion-purple to-white">Every Role</span>
        </motion.h1>
        <p className="text-evalion-textDim font-mono max-w-2xl mx-auto text-sm leading-relaxed opacity-80">
            EvaluationMind provides tailored workflows and data insights to empower every member of your hiring team, from sourcing to final decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}}>
            <SolutionCard 
                icon={Briefcase}
                title="Talent Acquisition"
                role="FOR THE TECHNICAL RECRUITER"
                description="Automate top-of-funnel screening and identify high-potential candidates with 98% accuracy, reducing time-to-hire by over 60%."
                features={[
                    "AI-Powered Resume Parsing",
                    "Automated Technical Screens",
                    "Candidate Pipeline Analytics",
                    "Bias Reduction Reporting"
                ]}
                color={{ text: "text-evalion-teal", border: "border-evalion-teal/30", from: "from-evalion-teal/5" }}
                onAction={() => onNavigate('ATS')}
            />
          </motion.div>
          
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}}>
            <SolutionCard 
                icon={Code}
                title="Engineering Leads"
                role="FOR THE HIRING MANAGER"
                description="Go beyond simple pass/fail. Deeply assess code quality, system design philosophy, and problem-solving abilities with our sandboxed environment."
                features={[
                    "Live Code Execution Analysis",
                    "System Design Whiteboarding",
                    "Algorithmic Complexity Scoring",
                    "Plagiarism & Proctoring Alerts"
                ]}
                color={{ text: "text-evalion-purple", border: "border-evalion-purple/30", from: "from-evalion-purple/5" }}
                onAction={() => onNavigate('REPORT')}
            />
          </motion.div>
          
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}}>
            <SolutionCard 
                icon={BarChart}
                title="Executive Oversight"
                role="FOR THE CTO / VP ENG"
                description="Gain a strategic overview of your organization's technical capabilities, identify skill gaps, and make data-driven decisions on talent strategy."
                features={[
                    "Team Skill-Gap Analysis",
                    "Hiring Velocity Metrics",
                    "Interviewer Calibration Reports",
                    "Enterprise SSO & Audit Logs"
                ]}
                color={{ text: "text-white", border: "border-white/20", from: "from-white/5" }}
                onAction={() => onNavigate('ENTERPRISE')}
            />
          </motion.div>
      </div>

      <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-6 p-2 pr-8 glass-panel rounded-full border border-white/5">
              <div className="px-4 py-2 bg-evalion-teal text-evalion-bg rounded-full text-[10px] font-black uppercase tracking-widest">New</div>
              <p className="text-xs font-mono text-evalion-textDim">Scale your recruitment OS with our advanced Enterprise API. <button onClick={() => onNavigate('DOCS')} className="text-white hover:text-evalion-teal ml-2 underline decoration-evalion-teal/50">Read Documentation</button></p>
          </div>
      </div>
    </div>
  );
};