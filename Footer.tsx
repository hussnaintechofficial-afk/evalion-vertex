
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Logo } from './Logo';
import { AppState } from '../types';
import { Twitter, Linkedin, Github, MapPin, Phone, Mail, Activity } from 'lucide-react';

const motion = framerMotion as any;

interface FooterProps {
    onNavigate: (state: AppState) => void;
}

interface FooterLinkProps {
    onClick: () => void;
    children: React.ReactNode;
}
const FooterLink: React.FC<FooterLinkProps> = ({ onClick, children }) => (
    <li>
        <button onClick={onClick} className="hover:text-evalion-teal transition-all py-1.5 px-3 -ml-3 rounded-xl hover:bg-white/5 uppercase tracking-widest text-[10px] font-black text-evalion-textDim">
            {children}
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full relative mt-auto">
      {/* Visual Separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-evalion-teal/20 to-transparent"></div>
      
      <div className="glass-panel border-t border-white/5 pt-20 pb-10 px-10 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1 space-y-8">
               <Logo size="sm" />
               <p className="text-[11px] text-evalion-textDim font-mono font-bold leading-relaxed uppercase tracking-widest opacity-60">
                  Autonomous hiring via Zero-Trust architecture. Neural proctoring. Bias-free scaling.
               </p>
               <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex flex-col">
                      <p className="text-[9px] text-evalion-purple font-black uppercase tracking-[0.4em] mb-2">Developed_Entity</p>
                      <div className="text-white font-black text-sm uppercase tracking-tighter">HussnainTechVertex Pvt Ltd</div>
                  </div>
                  <div className="text-[10px] font-black font-mono text-evalion-textDim uppercase tracking-widest">Architect: <span className="text-evalion-teal">Mr. Hussnain</span></div>
               </div>
            </div>

            {/* Links Column 1 */}
            <div className="col-span-1">
               <h4 className="text-[11px] font-black text-white mb-8 font-mono uppercase tracking-[0.5em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-evalion-teal"></div> PLATFORM
               </h4>
               <ul className="space-y-3 font-mono">
                  <FooterLink onClick={() => onNavigate('PLATFORM')}>Arch_Overview</FooterLink>
                  <FooterLink onClick={() => onNavigate('SOLUTIONS')}>Solution_Map</FooterLink>
                  <FooterLink onClick={() => onNavigate('ENTERPRISE')}>Enterprise_Scale</FooterLink>
                  <FooterLink onClick={() => onNavigate('DOCS')}>API_Reference</FooterLink>
                  <FooterLink onClick={() => onNavigate('STATUS')}>
                      <div className="flex items-center gap-3">
                          SYSTEM_LIVE <div className="w-2 h-2 rounded-full bg-evalion-success animate-pulse shadow-[0_0_10px_#05FF00]"></div>
                      </div>
                  </FooterLink>
               </ul>
            </div>

            {/* Links Column 2 */}
            <div className="col-span-1">
               <h4 className="text-[11px] font-black text-white mb-8 font-mono uppercase tracking-[0.5em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-evalion-purple"></div> ENTITY
               </h4>
               <ul className="space-y-3 font-mono">
                  <FooterLink onClick={() => onNavigate('ABOUT')}>The_Architects</FooterLink>
                  <FooterLink onClick={() => onNavigate('CONTACT')}>Comms_Link</FooterLink>
                  <FooterLink onClick={() => onNavigate('POLICY')}>Privacy_Protocol</FooterLink>
               </ul>
            </div>

            {/* Connect Column */}
            <div className="col-span-1">
               <h4 className="text-[11px] font-black text-white mb-8 font-mono uppercase tracking-[0.5em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div> HQ_UPLINK
               </h4>
               <div className="space-y-4 text-[10px] font-mono font-bold text-evalion-textDim uppercase tracking-widest mb-10">
                  <div className="flex items-center gap-4 glass-panel-item p-3 rounded-xl border border-white/5 hover:border-evalion-teal/30 transition-all">
                      <Phone size={14} className="text-evalion-teal"/> +92 302 8808488
                  </div>
                  <div className="flex items-center gap-4 glass-panel-item p-3 rounded-xl border border-white/5 hover:border-evalion-teal/30 transition-all overflow-hidden text-ellipsis">
                      <Mail size={14} className="text-evalion-teal"/> hussnaintechofficial@gmail.com
                  </div>
                  <div className="flex items-center gap-4 glass-panel-item p-3 rounded-xl border border-white/5 hover:border-evalion-teal/30 transition-all">
                      <MapPin size={14} className="text-evalion-teal"/> Daska, Sialkot, Pakistan
                  </div>
               </div>
               <div className="flex gap-4">
                  {[
                      { icon: Twitter, color: "text-evalion-teal" },
                      { icon: Linkedin, color: "text-evalion-teal" },
                      { icon: Github, color: "text-white" }
                  ].map((social, i) => (
                    <motion.button 
                        key={i}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 glass-panel-item rounded-2xl border border-white/10 hover:border-evalion-teal/40 transition-all ${social.color}`}
                    >
                        <social.icon size={20} />
                    </motion.button>
                  ))}
               </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[9px] font-black font-mono text-evalion-textDim uppercase tracking-[0.3em]">
                    © 2024 EVALUATIONMIND OS. AUTH_SECURED. ALL RIGHTS RESERVED.
               </p>
               <p className="text-[9px] font-black font-mono text-evalion-textDim uppercase tracking-[0.3em] flex items-center gap-3">
                    CORE_OS POWERED BY <span className="text-evalion-teal neon-text">HUSSNAINTECHVERTEX PVT LTD</span>
               </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
