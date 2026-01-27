/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Cpu, Terminal, Shield, Network, Eye, Lock } from 'lucide-react';

const motion = framerMotion as any;

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        viewport={{ once: true }}
        className="glass-panel p-6 rounded-xl border border-evalion-teal/10 hover:border-evalion-teal/40 transition-all group"
    >
        <div className="w-12 h-12 bg-evalion-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-evalion-teal/20">
            <Icon size={24} className="text-evalion-teal" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-mono">{title}</h3>
        <p className="text-sm text-evalion-textDim leading-relaxed">
            {desc}
        </p>
    </motion.div>
);

export const FeaturesPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                System <span className="text-evalion-teal">Architecture</span>
            </h1>
            <p className="text-xl text-evalion-textDim font-mono max-w-3xl">
                A breakdown of the modular components powering the EvaluationMind OS. 
                Each module operates independently within a zero-trust environment.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
                delay={0.1}
                icon={Cpu}
                title="Neural Scoring Engine"
                desc="Proprietary LLM pipelines analyze candidate responses against millions of data points to generate a calibrated 'Trust Score' and 'Technical Depth' rating."
            />
            <FeatureCard 
                delay={0.2}
                icon={Shield}
                title="Biometric Sentinel"
                desc="Continuous authentication using gaze tracking, voice fingerprinting, and liveness detection. Flags suspicious behavior in < 100ms."
            />
            <FeatureCard 
                delay={0.3}
                icon={Terminal}
                title="Sandboxed Runtime"
                desc="Secure code execution environment supporting 40+ languages. Compiles, tests, and analyzes algorithmic complexity (Big O) in real-time."
            />
            <FeatureCard 
                delay={0.4}
                icon={Network}
                title="Distributed Mesh"
                desc="Low-latency WebSocket infrastructure ensures real-time synchronization between candidate audio, video, and code streams globally."
            />
             <FeatureCard 
                delay={0.5}
                icon={Eye}
                title="Anti-Cheat Vision"
                desc="Computer vision algorithms detect secondary screens, unauthorized personnel, and phone usage during the assessment window."
            />
             <FeatureCard 
                delay={0.6}
                icon={Lock}
                title="Data Sovereignty"
                desc="End-to-end encryption for all session data. GDPR/CCPA compliant storage with automated retention policies and audit logs."
            />
        </div>

        {/* Technical Deep Dive Section */}
        <div className="mt-32">
            <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-evalion-purple pl-4">TECHNICAL_SPECIFICATIONS</h2>
            <div className="glass-panel p-8 rounded-xl font-mono text-xs md:text-sm text-evalion-textDim overflow-x-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 min-w-[600px]">
                    <div>
                        <h4 className="text-white font-bold mb-4">AI_MODELS</h4>
                        <ul className="space-y-2">
                            <li>GPT-4o (Reasoning)</li>
                            <li>Whisper V3 (Audio)</li>
                            <li>ResNet-50 (Vision)</li>
                            <li>Custom CodeBERT</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">INFRASTRUCTURE</h4>
                        <ul className="space-y-2">
                            <li>Kubernetes Clusters</li>
                            <li>Redis Mesh</li>
                            <li>PostgreSQL Shards</li>
                            <li>WebRTC Signaling</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">SECURITY</h4>
                        <ul className="space-y-2">
                            <li>AES-256 Encryption</li>
                            <li>OAuth 2.0 / OIDC</li>
                            <li>Role-Based Access</li>
                            <li>Automated Pen-Tests</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="text-white font-bold mb-4">LATENCY</h4>
                        <ul className="space-y-2">
                            <li>Audio: 200ms</li>
                            <li>Video: 350ms</li>
                            <li>Code Exec: 500ms</li>
                            <li>AI Inference: 1.2s</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};