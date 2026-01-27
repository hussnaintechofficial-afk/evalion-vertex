/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Building2, Server, Users, BarChart3, ArrowRight } from 'lucide-react';

const motion = framerMotion as any;

export const EnterprisePage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="text-evalion-purple font-mono font-bold mb-4">EVALION_MIND FOR ENTERPRISE</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Deploy Autonomous Hiring at <span className="text-evalion-purple">Global Scale</span>.
                </h1>
                <p className="text-evalion-textDim text-lg mb-8 leading-relaxed">
                    Standardize technical assessments across 50+ countries. Integrate with your existing HRIS stack. 
                    Ensure compliance with automated audit trails.
                </p>
                <button className="px-8 py-4 bg-white text-black font-bold font-mono rounded hover:bg-evalion-teal transition-colors flex items-center gap-2">
                    SCHEDULE BRIEFING <ArrowRight size={18}/>
                </button>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-evalion-purple/20 blur-[100px] rounded-full"></div>
                <div className="glass-panel p-8 rounded-xl border-l-4 border-l-evalion-purple relative z-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Building2 className="text-evalion-purple" />
                        </div>
                        <div>
                            <div className="text-white font-bold">TechGlobal Corp</div>
                            <div className="text-xs text-evalion-textDim font-mono">ENTERPRISE_INSTANCE_01</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-evalion-textDim">Active Pipelines</span>
                            <span className="text-white font-bold">142</span>
                         </div>
                         <div className="w-full h-1 bg-white/10 rounded-full"><div className="w-3/4 h-full bg-evalion-purple rounded-full"></div></div>
                         
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-evalion-textDim">Candidates Processed (24h)</span>
                            <span className="text-white font-bold">8,920</span>
                         </div>
                         <div className="w-full h-1 bg-white/10 rounded-full"><div className="w-1/2 h-full bg-evalion-purple rounded-full"></div></div>
                         
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-evalion-textDim">System Uptime</span>
                            <span className="text-evalion-success font-bold">99.999%</span>
                         </div>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="p-6 border border-white/5 hover:border-evalion-purple/50 rounded-xl transition-colors bg-evalion-surface">
                <Server className="text-evalion-purple mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">On-Premise / VPC</h3>
                <p className="text-sm text-evalion-textDim">Deploy EvalionMind completely within your own VPC or physical infrastructure for maximum data control.</p>
            </div>
            <div className="p-6 border border-white/5 hover:border-evalion-purple/50 rounded-xl transition-colors bg-evalion-surface">
                <Users className="text-evalion-purple mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">SSO & RBAC</h3>
                <p className="text-sm text-evalion-textDim">Seamless integration with Okta, Azure AD, and Google Workspace. Granular permission controls.</p>
            </div>
            <div className="p-6 border border-white/5 hover:border-evalion-purple/50 rounded-xl transition-colors bg-evalion-surface">
                <BarChart3 className="text-evalion-purple mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Custom BI Reporting</h3>
                <p className="text-sm text-evalion-textDim">Direct SQL access to your recruitment data lake for creating custom dashboards and insights.</p>
            </div>
        </div>
    </div>
  );
};