/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { AppState } from '../types';
import { Cloud, Building, ArrowRight, CheckCircle } from 'lucide-react';

const motion = framerMotion as any;

interface DeployPageProps {
    onNavigate: (state: AppState) => void;
}

export const DeployPage: React.FC<DeployPageProps> = ({ onNavigate }) => {
    return (
        <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Deploy EvaluationMind OS</h1>
                <p className="text-evalion-textDim font-mono max-w-2xl mx-auto">
                    Choose the deployment model that fits your organization's security and scalability requirements.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CLOUD OPTION */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 rounded-xl border-t-4 border-evalion-teal flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Cloud size={32} className="text-evalion-teal" />
                        <h2 className="text-2xl font-bold text-white font-mono">Cloud Instance</h2>
                    </div>
                    <p className="text-evalion-textDim font-mono text-sm mb-6 flex-grow">
                        Get started in minutes with our secure, multi-tenant cloud infrastructure. Fully managed and auto-scaling.
                    </p>
                    <ul className="space-y-3 mb-8 text-sm text-evalion-text">
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> 99.99% Uptime SLA</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> Instant Updates</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> Global Low-Latency Network</li>
                    </ul>
                    <button 
                        onClick={() => onNavigate('AUTH')}
                        className="w-full mt-auto py-3 bg-evalion-teal text-black font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                        GET STARTED <ArrowRight size={16}/>
                    </button>
                </motion.div>

                {/* ENTERPRISE OPTION */}
                <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.4 }}
                     className="glass-panel p-8 rounded-xl border-t-4 border-evalion-purple flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Building size={32} className="text-evalion-purple" />
                        <h2 className="text-2xl font-bold text-white font-mono">Enterprise VPC</h2>
                    </div>
                    <p className="text-evalion-textDim font-mono text-sm mb-6 flex-grow">
                        Deploy within your own Virtual Private Cloud or on-premise servers for maximum data control and compliance.
                    </p>
                     <ul className="space-y-3 mb-8 text-sm text-evalion-text">
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> Data Sovereignty</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> SSO & Custom Integrations</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-evalion-success"/> Dedicated Support & Onboarding</li>
                    </ul>
                    <button 
                        onClick={() => onNavigate('CONTACT')}
                        className="w-full mt-auto py-3 bg-evalion-purple/20 border border-evalion-purple text-evalion-purple font-bold rounded hover:bg-evalion-purple hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        CONTACT SALES <ArrowRight size={16}/>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
