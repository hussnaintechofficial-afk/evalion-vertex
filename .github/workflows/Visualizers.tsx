
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import { motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

export const HexGridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
    <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px]"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-evalion-bg/50 to-evalion-bg"></div>
  </div>
);

export const AudioVisualizer = ({ isActive, level }: { isActive: boolean; level: number }) => {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[3px] h-20">
      {Array.from({ length: bars }).map((_, i) => {
        const center = bars / 2;
        const dist = Math.abs(i - center);
        const maxH = 100 - (dist * 4); 
        return (
          <motion.div
            key={i}
            className={`w-2 rounded-full ${isActive ? 'bg-gradient-to-t from-evalion-teal to-evalion-purple shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-evalion-surface border border-white/5'}`}
            animate={{
              height: isActive ? Math.max(8, Math.random() * level * maxH * 0.06 + 8) : 6,
              opacity: isActive ? 1 : 0.2
            }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
        );
      })}
    </div>
  );
};

export const NeuralWaveform = ({ active }: { active: boolean }) => {
  return (
    <div className="flex items-center gap-1 h-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-evalion-teal/40 rounded-full"
          animate={active ? {
            height: [4, 16, 4],
            backgroundColor: ['#00F0FF44', '#00F0FFFF', '#00F0FF44']
          } : { height: 4 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const CircularTimer = ({ timeLeft, totalTime }: { timeLeft: number, totalTime: number }) => {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * circumference;
  const isUrgent = timeLeft <= 15;
  const isCritical = timeLeft <= 5;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      {/* Heartbeat pulse on critical */}
      <motion.div 
        animate={isCritical ? { 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.4, 0.1]
        } : isUrgent ? {
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1]
        } : { opacity: 0.05 }}
        transition={{ repeat: Infinity, duration: isCritical ? 0.6 : 1.2 }}
        className={`absolute inset-0 rounded-full blur-3xl ${isUrgent ? 'bg-evalion-danger' : 'bg-evalion-teal'}`}
      />
      
      <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isUrgent ? "#FF2A6D" : "#00F0FF"} />
            <stop offset="100%" stopColor={isUrgent ? "#FF2A6D" : "#8B5CF6"} />
          </linearGradient>
        </defs>
        
        {/* Track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        
        {/* Progress Bar */}
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#timerGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          className="transition-all duration-1000 ease-linear"
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
            animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <span className={`text-4xl font-black font-mono leading-none tracking-tighter ${isUrgent ? 'text-evalion-danger neon-text' : 'text-white'}`}>
                {timeLeft}
            </span>
            <span className={`text-[10px] font-black font-mono uppercase tracking-[0.3em] mt-1 ${isUrgent ? 'text-evalion-danger/60' : 'text-evalion-textDim'}`}>
                SEC
            </span>
        </motion.div>
      </div>

      {/* Exterior Ring */}
      <div className="absolute inset-0 border-2 border-white/5 rounded-full scale-[0.85]"></div>
      <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.1]"></div>
    </div>
  );
};

export const FaceScanner = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      <div className="relative w-80 h-80">
        {/* Animated Scanning Line */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-evalion-teal shadow-[0_0_30px_#00F0FF] z-30"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-evalion-teal rounded-tl-2xl shadow-[-10px_-10px_20px_rgba(0,240,255,0.2)]"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-evalion-teal rounded-tr-2xl shadow-[10px_-10px_20px_rgba(0,240,255,0.2)]"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-evalion-teal rounded-bl-2xl shadow-[-10px_10px_20px_rgba(0,240,255,0.2)]"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-evalion-teal rounded-br-2xl shadow-[10px_10px_20px_rgba(0,240,255,0.2)]"></div>

        {/* Circular Scanning Rings */}
        <div className="absolute inset-0 m-auto w-64 h-64 border border-white/5 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 m-auto w-48 h-48 border border-white/10 rounded-full animate-pulse"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute bottom-16 text-evalion-teal font-mono text-[11px] font-black tracking-[0.5em] uppercase"
      >
        CALIBRATING_BIOMETRIC_SENTINEL_ARRAY
      </motion.div>
    </div>
  );
};
