/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Logo } from './Logo';

const motion = framerMotion as any;

interface IntroProps {
    onComplete: () => void;
}

const brandText = "EVALUATIONMIND";
const subText = "NEURAL HIRING OS v1.0.24";

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {

    useEffect(() => {
        const timer = setTimeout(onComplete, 4500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 1, ease: "circIn" }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 80, damping: 12 }
        }
    };

    return (
        <motion.div 
            key="intro"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-evalion-bg overflow-hidden"
        >
            {/* Ambient Neural Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-cyber-grid bg-[length:60px_60px] opacity-10"></div>
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-gradient-to-tr from-evalion-teal/20 via-transparent to-evalion-purple/20 rounded-full blur-[160px]"
                />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="mb-12 relative z-10"
            >
                <Logo size="lg" />
            </motion.div>

            <motion.div 
                className="flex font-black text-4xl md:text-7xl tracking-tighter relative z-10"
                variants={containerVariants}
            >
                {brandText.split('').map((char, index) => (
                    <motion.span 
                        key={index}
                        variants={letterVariants}
                        className={brandText.indexOf("MIND") <= index && index < brandText.indexOf("MIND") + 4 ? "text-evalion-teal neon-text" : "text-white"}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="mt-6 flex items-center gap-4 z-10"
            >
                <div className="h-[1px] w-8 bg-evalion-teal/30"></div>
                <span className="text-[10px] text-evalion-textDim font-mono uppercase tracking-[0.6em] font-black italic">
                    {subText}
                </span>
                <div className="h-[1px] w-8 bg-evalion-teal/30"></div>
            </motion.div>

            {/* Cinematic Boot Progress */}
            <div className="absolute bottom-20 flex flex-col items-center gap-4 z-10">
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                    <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-evalion-teal to-transparent"
                    />
                </div>
                <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[9px] font-mono text-evalion-teal/60 uppercase tracking-[0.4em] font-bold"
                >
                    NEURAL_SYNC_ESTABLISHED
                </motion.span>
            </div>
        </motion.div>
    );
};