/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Check, Zap, Globe, Shield } from 'lucide-react';

const motion = framerMotion as any;

export const PricingPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
            Scalable <span className="text-evalion-teal">Intelligence</span> Licensing
        </motion.h1>
        <p className="text-evalion-textDim font-mono max-w-2xl mx-auto">
            Select a compute tier based on your concurrent interview volume and AI analysis depth requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* STARTER TIER */}
        <div className="glass-panel p-8 rounded-xl border-t-2 border-t-evalion-teal/20 hover:border-t-evalion-teal transition-all relative group">
            <h3 className="text-xl font-bold text-white font-mono mb-2">SEED_TIER</h3>
            <div className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm text-evalion-textDim font-normal">/ month</span></div>
            <p className="text-xs text-evalion-textDim font-mono mb-8 border-b border-evalion-teal/10 pb-6">
                For startups and early-stage validation.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-white font-mono">
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> 5 Concurrent Interviews</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> Basic Code Sandbox</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> 720p Video Retention</li>
                <li className="flex gap-3 opacity-50"><Check size={16}/> Neural Biometrics</li>
            </ul>
            <button className="w-full py-3 border border-evalion-teal/30 text-evalion-teal rounded font-bold hover:bg-evalion-teal/10 transition-colors">
                INITIALIZE FREE
            </button>
        </div>

        {/* PRO TIER */}
        <div className="glass-panel p-8 rounded-xl border-t-4 border-t-evalion-teal bg-evalion-teal/5 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-evalion-teal text-black text-[10px] font-bold px-3 py-1 font-mono uppercase">Most Deployed</div>
            <h3 className="text-xl font-bold text-white font-mono mb-2">SCALE_TIER</h3>
            <div className="text-3xl font-bold text-white mb-6">$499 <span className="text-sm text-evalion-textDim font-normal">/ month</span></div>
            <p className="text-xs text-evalion-textDim font-mono mb-8 border-b border-evalion-teal/10 pb-6">
                Full autonomous capabilities for growing teams.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-white font-mono">
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> 500 Concurrent Interviews</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> Advanced Proctoring (Gaze/Audio)</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> 4K Video Archival</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> Custom LLM Prompts</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-teal"/> ATS Integration (Greenhouse/Lever)</li>
            </ul>
            <button className="w-full py-3 bg-evalion-teal text-black rounded font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                UPGRADE NODE
            </button>
        </div>

        {/* ENTERPRISE TIER */}
        <div className="glass-panel p-8 rounded-xl border-t-2 border-t-evalion-purple/50 hover:border-t-evalion-purple transition-all">
            <h3 className="text-xl font-bold text-white font-mono mb-2">CORP_TIER</h3>
            <div className="text-3xl font-bold text-white mb-6">CUSTOM</div>
            <p className="text-xs text-evalion-textDim font-mono mb-8 border-b border-evalion-teal/10 pb-6">
                Dedicated infrastructure for global organizations.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-white font-mono">
                <li className="flex gap-3"><Check size={16} className="text-evalion-purple"/> Unlimited Concurrency</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-purple"/> On-Premise Deployment Option</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-purple"/> Dedicated CSM & SLA</li>
                <li className="flex gap-3"><Check size={16} className="text-evalion-purple"/> SSO / SAML / Audit Logs</li>
            </ul>
            <button className="w-full py-3 border border-evalion-purple/50 text-evalion-purple rounded font-bold hover:bg-evalion-purple/10 transition-colors">
                CONTACT SALES
            </button>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="mt-24 border-t border-evalion-teal/10 pt-12 text-center">
          <p className="text-xs font-mono text-evalion-textDim mb-8">SECURED BY INDUSTRY STANDARD PROTOCOLS</p>
          <div className="flex justify-center gap-12 grayscale opacity-50">
             <div className="flex items-center gap-2"><Shield size={24}/> SOC2 TYPE II</div>
             <div className="flex items-center gap-2"><Globe size={24}/> GDPR READY</div>
             <div className="flex items-center gap-2"><Zap size={24}/> ISO 27001</div>
          </div>
      </div>
    </div>
  );
};