
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Logo } from './Logo';
import { User, AppState, SocketStatus } from '../types';
import { ChevronLeft, ArrowRight, Shield, Activity, Search, Command, LayoutDashboard, User as UserProfileIcon, CreditCard, BarChartHorizontal, Power, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const motion = framerMotion as any;

const SocketStatusIndicator: React.FC<{ status: SocketStatus }> = ({ status }) => {
    const statusConfig = {
        'CONNECTING': { text: 'SYNCING...', icon: RefreshCw, color: 'text-evalion-teal', animate: 'animate-spin' },
        'CONNECTED': { text: 'LIVE SYNC', icon: CheckCircle, color: 'text-evalion-success', animate: '' },
        'UNSTABLE': { text: 'UNSTABLE', icon: AlertTriangle, color: 'text-yellow-500', animate: 'animate-pulse' },
        'DISCONNECTED': { text: 'OFFLINE', icon: XCircle, color: 'text-evalion-danger', animate: 'animate-pulse' }
    };
    const { text, icon: Icon, color, animate } = statusConfig[status];

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
            status === 'CONNECTED' ? 'bg-evalion-success/5 border-evalion-success/10 text-evalion-success/70' :
            status === 'CONNECTING' ? 'bg-evalion-teal/5 border-evalion-teal/10 text-evalion-teal/70' :
            status === 'UNSTABLE' ? 'bg-yellow-500/5 border-yellow-500/10 text-yellow-500/70' :
            'bg-evalion-danger/5 border-evalion-danger/10 text-evalion-danger/70'
        }`}>
            <Icon size={12} className={`${color} ${animate}`} />
            {text}
        </div>
    );
};


interface HeaderProps {
  user: User | null;
  state: AppState;
  historyLength: number;
  socketStatus: SocketStatus;
  onNavigate: (state: AppState) => void;
  onBack: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onOpenCommandHub: () => void;
}

const navLinks: { name: string, state: AppState }[] = [
    { name: 'Platform', state: 'PLATFORM' },
    { name: 'Solutions', state: 'SOLUTIONS' },
    { name: 'Pricing', state: 'PRICING' },
    { name: 'Enterprise', state: 'ENTERPRISE' },
    { name: 'Docs', state: 'DOCS' },
    { name: 'About', state: 'ABOUT' },
    { name: 'Contact', state: 'CONTACT' },
    { name: 'Status', state: 'STATUS' },
];

export const Header: React.FC<HeaderProps> = ({ 
  user, state, historyLength, socketStatus, onNavigate, onBack, onLogout, onProfile, onOpenCommandHub
}) => {
  const isLanding = state === 'LANDING';
  const isCritical = ['INTERVIEW', 'VERIFICATION', 'ANALYSIS'].includes(state);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-[100] h-16 glass-panel rounded-full px-6 flex justify-between items-center transition-all border border-white/10 shadow-2xl">
      <div className="flex items-center gap-6">
        {/* Conditional Back Button */}
        {historyLength > 0 && !isCritical && !isLanding && (
            <motion.button 
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="p-1.5 hover:bg-white/10 rounded-full text-evalion-textDim hover:text-white transition-all group"
            >
                <ChevronLeft size={20} />
            </motion.button>
        )}
        
        <div onClick={() => !isCritical && onNavigate('LANDING')} className="cursor-pointer">
          <Logo size="sm" />
        </div>
      </div>

      {/* Global Navigation */}
      {!user && !isCritical && (
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map(link => (
            <button 
                key={link.state}
                onClick={() => onNavigate(link.state)}
                className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-all rounded-full hover:bg-white/5 ${state === link.state ? 'text-evalion-teal' : 'text-evalion-textDim hover:text-white'}`}
            >
                {link.name}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2"></div>
          <button 
            onClick={() => onNavigate('AUTH')}
            className="px-4 py-1.5 bg-evalion-purple/20 border border-evalion-purple/30 text-evalion-purple font-black uppercase tracking-widest rounded-full hover:bg-evalion-purple/30 transition-all text-[10px]"
          >
              Access_ID
          </button>
        </nav>
      )}

      {/* Logged In State */}
      {user && (
        <div className="flex items-center gap-4">
          <SocketStatusIndicator status={socketStatus} />

          <button 
            onClick={onOpenCommandHub}
            className="flex items-center gap-3 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white/40 hover:text-white transition-all group"
            title="Search Neural Hub (⌘K)"
          >
              <Command size={14} className="group-hover:text-evalion-teal transition-colors" />
              <span className="text-[10px] font-mono uppercase tracking-widest hidden md:block">Neural Hub</span>
              <div className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-3">
                  <span className="text-[9px] font-mono opacity-40">⌘K</span>
              </div>
          </button>
          
          <div className="relative group">
            <button 
              className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/5 hover:border-evalion-teal/40 transition-all cursor-pointer"
            >
              <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  className="w-7 h-7 rounded-full border border-evalion-teal/30" 
                  alt="Profile" 
              />
              <div className="text-left hidden md:block">
                  <div className="text-[10px] font-bold text-white leading-none mb-0.5">{user.name}</div>
                  <div className="text-[8px] font-mono text-evalion-teal uppercase leading-none opacity-70">{user.role}</div>
              </div>
            </button>
            
            <div 
              className="absolute top-full right-0 mt-3 w-64 glass-panel rounded-2xl shadow-2xl border border-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right z-50 scale-95 group-hover:scale-100"
            >
              <div className="p-4 border-b border-white/5">
                <div className="text-sm font-bold text-white">{user.name}</div>
                <div className="text-[9px] font-mono text-evalion-textDim truncate">{user.email}</div>
              </div>
              <div className="p-2 space-y-1 font-mono text-xs">
                <button onClick={() => onNavigate('DASHBOARD')} className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 text-evalion-textDim hover:text-white transition-colors">
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button onClick={() => onNavigate('PROFILE')} className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 text-evalion-textDim hover:text-white transition-colors">
                  <UserProfileIcon size={16} /> Profile Settings
                </button>
                {user.role === 'RECRUITER' && (
                  <button onClick={() => onNavigate('BILLING')} className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 text-evalion-textDim hover:text-white transition-colors">
                    <CreditCard size={16} /> Billing & Usage
                  </button>
                )}
                <button onClick={() => onNavigate('STATUS')} className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 text-evalion-textDim hover:text-white transition-colors">
                  <BarChartHorizontal size={16} /> System Status
                </button>
              </div>
              <div className="p-2 border-t border-white/5">
                <button onClick={onLogout} className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-evalion-danger/10 text-evalion-danger transition-colors font-mono text-xs">
                  <Power size={16} /> Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical State UI */}
      {isCritical && (
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-evalion-danger/10 border border-evalion-danger/30 rounded-full text-evalion-danger text-[9px] font-mono font-bold animate-pulse uppercase tracking-widest">
                  <Activity size={12} /> Critical_Buffer_Active
              </div>
          </div>
      )}
    </header>
  );
};
