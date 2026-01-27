/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion as framerMotion } from 'framer-motion';
import { User } from '../types';
import { User as UserIcon, Mail, Building, Save, X, Lock, Shield, Fingerprint, RefreshCcw } from 'lucide-react';

const motion = framerMotion as any;

interface ProfileProps {
  user: User;
  onUpdate: (u: User) => void;
  onCancel: () => void;
}

export const UserProfile: React.FC<ProfileProps> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<User>({
      ...user,
      biometricEnabled: user.biometricEnabled ?? false
  });
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  const handleUpdate = () => {
      // Validate passwords if user tried to change them
      if (passwords.new && passwords.new !== passwords.confirm) {
          alert("ERROR: PASSWORDS_DO_NOT_MATCH");
          return;
      }
      onUpdate({
          ...formData,
          password: passwords.new || undefined
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto glass-panel p-8 rounded-xl border border-white/5 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8 border-b border-evalion-teal/10 pb-4">
        <h2 className="text-xl font-mono text-white flex items-center gap-2">
            <UserIcon size={20} className="text-evalion-teal" /> USER_PROFILE_CONFIG
        </h2>
        <div className="px-3 py-1 rounded bg-evalion-teal/10 text-evalion-teal text-[10px] font-mono border border-evalion-teal/20">
            SESSION_ID: {user.id.toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Avatar and Basic Info */}
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-evalion-teal to-evalion-purple rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-36 h-36 rounded-full border-4 border-evalion-bg overflow-hidden">
                    <img src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <RefreshCcw size={24} className="text-white animate-spin-slow" />
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-evalion-success border-4 border-evalion-bg rounded-full flex items-center justify-center">
                    <Shield size={14} className="text-evalion-bg" />
                </div>
            </div>
            <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">{user.name}</div>
                <div className="text-[10px] font-mono text-evalion-teal bg-evalion-teal/5 border border-evalion-teal/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {user.role}_ACCESS_LEVEL
                </div>
            </div>
        </div>

        {/* Right: Forms */}
        <div className="flex-1 space-y-10">
            {/* Identity Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-evalion-textDim flex items-center gap-2 uppercase">Full Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white font-mono text-sm focus:border-evalion-teal outline-none transition-all"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-evalion-textDim flex items-center gap-2 uppercase">Contact Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        readOnly
                        className="w-full bg-black/20 border border-white/5 rounded px-4 py-3 text-white/40 font-mono text-sm cursor-not-allowed"
                    />
                </div>

                {user.role === 'RECRUITER' && (
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-mono text-evalion-textDim flex items-center gap-2 uppercase">Organization Entity</label>
                        <input 
                            type="text" 
                            value={formData.companyName}
                            onChange={e => setFormData({...formData, companyName: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white font-mono text-sm focus:border-evalion-purple outline-none transition-all"
                        />
                    </div>
                )}
            </div>

            {/* Account Security Section */}
            <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
                    <Lock size={16} className="text-evalion-danger" /> ACCOUNT_SECURITY_CONFIGURATION
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-evalion-textDim flex items-center gap-2 uppercase tracking-wide">
                            <Shield size={12} className="text-evalion-danger" /> New Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••••••"
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white font-mono text-sm focus:border-evalion-danger outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-evalion-textDim flex items-center gap-2 uppercase tracking-wide">
                            <Shield size={12} className="text-evalion-danger" /> Confirm Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••••••"
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white font-mono text-sm focus:border-evalion-danger outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Biometric Toggle */}
                <div className="p-4 bg-evalion-teal/5 border border-evalion-teal/20 rounded-lg flex items-center justify-between group hover:border-evalion-teal/40 transition-all">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${formData.biometricEnabled ? 'bg-evalion-teal text-evalion-bg shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-white/5 text-evalion-textDim'}`}>
                            <Fingerprint size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white font-mono">BIOMETRIC_LOGIN_PROTOCOL</div>
                            <div className="text-[10px] text-evalion-textDim font-mono">Activate iris and micro-expression authentication.</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setFormData({...formData, biometricEnabled: !formData.biometricEnabled})}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${formData.biometricEnabled ? 'bg-evalion-teal' : 'bg-white/10'}`}
                    >
                        <motion.div 
                            animate={{ x: formData.biometricEnabled ? 26 : 4 }}
                            className={`absolute top-1 w-4 h-4 rounded-full ${formData.biometricEnabled ? 'bg-evalion-bg' : 'bg-evalion-textDim'}`}
                        />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 border-t border-white/5 pt-8">
        <button 
            onClick={onCancel}
            className="px-8 py-3 rounded border border-white/10 text-evalion-textDim hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-bold flex items-center justify-center gap-2"
        >
            <X size={16}/> CANCEL_REQUEST
        </button>
        <button 
            onClick={handleUpdate}
            className="px-8 py-3 rounded bg-evalion-teal text-evalion-bg font-bold hover:bg-white transition-all text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
            <Save size={16}/> COMMIT_CONFIGURATION
        </button>
      </div>
    </motion.div>
  );
};