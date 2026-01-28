
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

// Use any to bypass motion type issues in the local environment and maintain consistency with other components
const motion = framerMotion as any;

const LOG_SEQUENCES = [
    "INITIALIZING KERNEL v1.0.24",
    "ESTABLISHING ZERO-TRUST UPLINK...",
    "HANDSHAKE: RSA_4096_NOMINAL",
    "SYNCING GLOBAL NODES [TOKYO, LONDON, NY]",
    "BIOMETRIC SENTINEL: STANDBY",
    "NEURO-ENGINE CALIBRATED",
    "AWAITING DEPLOYMENT PROTOCOL...",
    "READY."
];

export const KernelTerminal = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < LOG_SEQUENCES.length) {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, LOG_SEQUENCES[currentIndex]]);
                setCurrentIndex(prev => prev + 1);
            }, 1200);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex]);

    return (
        <div className="w-full h-full glass-panel bg-black/60 rounded-3xl border border-white/10 p-6 font-mono text-[10px] md:text-xs overflow-hidden flex flex-col shadow-inner">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5 opacity-40">
                <div className="w-2 h-2 rounded-full bg-evalion-danger"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-evalion-success"></div>
                <span className="ml-2 uppercase tracking-widest text-[8px]">Session_Kernel_Logs</span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden">
                <AnimatePresence>
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${log === 'READY.' ? 'text-evalion-teal font-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'text-evalion-textDim'}`}
                        >
                            <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            <span className="text-white/40 mr-2">>></span>
                            {log}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1.5 h-3 bg-evalion-teal ml-1 align-middle"
                />
            </div>
        </div>
    );
};
