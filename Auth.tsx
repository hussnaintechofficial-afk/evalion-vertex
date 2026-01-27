
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { User, UserRole } from '../types';
import { Briefcase, User as UserIcon, ArrowRight, Shield, Fingerprint, Lock, RefreshCw, Users } from 'lucide-react';

const motion = framerMotion as any;

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('CANDIDATE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || (role === 'CANDIDATE' ? 'Alex Candidate' : role === 'RECRUITER' ? 'Sarah Recruiter' : 'Interviewer 01'),
      email: formData.email,
      role: role,
      companyName: role !== 'CANDIDATE' ? (formData.companyName || 'TechCorp Global') : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    };
    
    localStorage.setItem('evalion_token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(user))}.signature`);
    setIsProcessing(false);
    onLogin(user);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`w-full max-w-lg glass-panel p-10 rounded-[2.5rem] border-2 relative overflow-hidden shadow-2xl ${role !== 'CANDIDATE' ? 'glass-panel-purple' : ''}`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${role === 'CANDIDATE' ? 'from-evalion-teal to-evalion-bg' : 'from-evalion-purple to-evalion-bg'}`}></div>
        
        <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/5 border rounded-full mb-6 ${role === 'CANDIDATE' ? 'border-evalion-teal/20' : 'border-evalion-purple/20'}`}>
                <Shield size={12} className={role === 'CANDIDATE' ? 'text-evalion-teal' : 'text-evalion-purple'} />
                <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${role === 'CANDIDATE' ? 'text-evalion-teal' : 'text-evalion-purple'}`}>Zero_Trust_Gateway_v1.2</span>
            </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">{isLogin ? 'Initialize Access' : 'Register Identity'}</h2>
          <p className="text-[10px] text-evalion-textDim font-mono uppercase tracking-[0.3em]">Neural Verification Protocol</p>
        </div>

        {/* Role Selection Tabs - 3 Column Layout */}
        <div className="grid grid-cols-3 gap-2 mb-10 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setRole('CANDIDATE')}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl text-[8px] font-black font-mono transition-all duration-500 uppercase tracking-widest ${
              role === 'CANDIDATE' 
                ? 'bg-evalion-teal text-evalion-bg shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                : 'text-evalion-textDim hover:text-white hover:bg-white/5'
            }`}
          >
            <UserIcon size={12} /> Candidate
          </button>
          <button
            onClick={() => setRole('INTERVIEWER')}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl text-[8px] font-black font-mono transition-all duration-500 uppercase tracking-widest ${
              role === 'INTERVIEWER' 
                ? 'bg-evalion-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                : 'text-evalion-textDim hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={12} /> Interviewer
          </button>
          <button
            onClick={() => setRole('RECRUITER')}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl text-[8px] font-black font-mono transition-all duration-500 uppercase tracking-widest ${
              role === 'RECRUITER' 
                ? 'bg-white text-evalion-bg shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'text-evalion-textDim hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase size={12} /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-white/40 uppercase font-black tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:border-white/40 outline-none transition-all font-mono"
                    placeholder="E.G. ALAN TURING"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                {role !== 'CANDIDATE' && (
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/40 uppercase font-black tracking-widest ml-1">Organization Entity</label>
                        <input 
                        type="text" 
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:border-white/40 outline-none transition-all font-mono"
                        placeholder="TECH_CORP_GLOBAL"
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-white/40 uppercase font-black tracking-widest ml-1">Secure Email Uplink</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:border-white/40 outline-none transition-all font-mono"
              placeholder="IDENTITY@PROTOCOL.SYS"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-white/40 uppercase font-black tracking-widest ml-1">Encryption Key</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:border-white/40 outline-none transition-all font-mono"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 mt-4 rounded-xl font-black font-mono text-[11px] flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-xl ${
              isProcessing ? 'opacity-50 cursor-wait' : 'hover:scale-[1.01] active:scale-98'
            } ${
              role === 'CANDIDATE' ? 'bg-evalion-teal text-evalion-bg' : role === 'INTERVIEWER' ? 'bg-evalion-purple text-white' : 'bg-white text-evalion-bg'
            }`}
          >
            {isProcessing ? (
                <><RefreshCw className="animate-spin" size={16} /> Processing_Uplink...</>
            ) : (
                <>{isLogin ? 'Access_Dashboard' : 'Initialize_Account'} <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-6">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] text-evalion-textDim font-mono hover:text-white uppercase tracking-widest underline decoration-dashed underline-offset-8 transition-colors"
          >
            {isLogin ? 'New Node? Initialize Profile' : 'Existing Node? Secure Login'}
          </button>
          
          <div className="flex items-center gap-4 opacity-20 hover:opacity-50 transition-opacity">
              <Fingerprint size={18} className="text-evalion-teal" />
              <Lock size={14} className="text-white" />
              <Shield size={16} className="text-evalion-purple" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
