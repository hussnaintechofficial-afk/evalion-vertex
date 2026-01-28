
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Layers } from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-24 h-24';
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-5xl';
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 22 : 48;
  const subTextSize = size === 'sm' ? 'text-[7px]' : size === 'md' ? 'text-[9px]' : 'text-sm';

  return (
    <div className="flex items-center gap-4 select-none group">
      {/* 3D Kinetic Icon */}
      <div className={`relative ${dim} perspective-1000`}>
        <motion.div 
            className="w-full h-full style-preserve-3d"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
            <div className="absolute inset-0 glass-panel bg-gradient-to-br from-evalion-teal/20 via-[#00E5FF]/20 to-black/20 flex items-center justify-center rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.3)] backface-hidden border border-evalion-teal/30">
                <Layers className="text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" size={iconSize} />
            </div>
            <div className="absolute inset-0 bg-evalion-bg border-2 border-evalion-teal/20 rounded-xl rotate-y-180 backface-hidden flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_80%)]"></div>
            </div>
        </motion.div>
        
        {/* Glow Aura */}
        <div className="absolute -inset-2 bg-evalion-teal/10 rounded-full blur-xl group-hover:bg-evalion-teal/20 transition-all duration-700"></div>
      </div>

      {/* Brand Typography */}
      <div className={`flex flex-col ${size === 'lg' ? 'items-center' : 'items-start'} justify-center`}>
          <div className="flex items-center gap-2.5">
            <h1 className={`${textSize} font-black tracking-tight text-white leading-none flex items-center`}>
                EVALUATION<span className="text-evalion-teal neon-text ml-0.5">MIND</span>
            </h1>
            <div className="flex flex-col">
              <span className="px-1.5 py-0.5 rounded-md bg-evalion-teal/10 border border-evalion-teal/20 text-[9px] font-black font-mono text-evalion-teal">
                  1.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1 opacity-60">
              <div className="h-[1px] w-4 bg-evalion-teal/40 group-hover:w-8 transition-all duration-700"></div>
              <span className={`${subTextSize} font-mono text-evalion-textDim tracking-[0.5em] uppercase font-black`}>
                  Neural OS
              </span>
          </div>
      </div>
    </div>
  );
};
