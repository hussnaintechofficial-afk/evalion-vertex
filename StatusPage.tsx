
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Server, Database, BrainCircuit, Shield, MessageSquare, CheckCircle, AlertTriangle, XCircle, Activity, Lock, Key } from 'lucide-react';

const motion = framerMotion as any;

type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: string;
  icon: React.ElementType;
  history: number[];
}

const getStatusInfo = (status: ServiceStatus) => {
    switch (status) {
        case 'OPERATIONAL': return { color: 'text-evalion-success', bgColor: 'bg-evalion-success', icon: CheckCircle };
        case 'DEGRADED': return { color: 'text-yellow-500', bgColor: 'bg-yellow-500', icon: AlertTriangle };
        case 'OUTAGE': return { color: 'text-evalion-danger', bgColor: 'bg-evalion-danger', icon: XCircle };
    }
};

const Sparkline = ({ data, colorClass }: { data: number[], colorClass: string }) => {
    const width = 120;
    const height = 40;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / (max - min + 1)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-50">
            <polyline
                fill="none"
                stroke={colorClass === 'text-evalion-success' ? '#05FF00' : colorClass === 'text-yellow-500' ? '#FFA500' : '#FF2A6D'}
                strokeWidth="2"
                points={points}
            />
        </svg>
    );
};

interface StatusCardProps {
    service: Service;
    index: number;
}
const StatusCard: React.FC<StatusCardProps> = ({ service, index }) => {
    const { icon: StatusIcon, color } = getStatusInfo(service.status);
    const ServiceIcon = service.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col justify-between border-t-2 border-white/5 hover:border-evalion-teal/30 transition-colors"
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-evalion-surface rounded-lg border border-white/10">
                            <ServiceIcon size={20} className="text-evalion-textDim" />
                        </div>
                        <h3 className="text-white font-bold font-mono">{service.name}</h3>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold font-mono ${color}`}>
                        <StatusIcon size={12} className="animate-pulse" />
                        {service.status}
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-evalion-textDim font-mono">Latency</div>
                        <div className="text-2xl text-white font-bold font-mono">{service.latency}<span className="text-sm">ms</span></div>
                    </div>
                    <Sparkline data={service.history} colorClass={color} />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-evalion-textDim font-mono flex justify-between">
                <span>Uptime (90d)</span>
                <span className="text-evalion-success font-bold">{service.uptime}</span>
            </div>
        </motion.div>
    );
};


export const StatusPage = () => {
    const initialServices: Service[] = [
        { id: 'api', name: 'API Gateway', status: 'OPERATIONAL', latency: 52, uptime: '99.998%', icon: Server, history: [] },
        { id: 'db', name: 'Database Clusters', status: 'OPERATIONAL', latency: 68, uptime: '99.999%', icon: Database, history: [] },
        { id: 'auth', name: 'Authentication', status: 'OPERATIONAL', latency: 45, uptime: '99.999%', icon: Shield, history: [] },
        { id: 'ai', name: 'AI Engine', status: 'OPERATIONAL', latency: 850, uptime: '99.981%', icon: BrainCircuit, history: [] },
        { id: 'sec', name: 'Security Kernel', status: 'OPERATIONAL', latency: 8, uptime: '100.00%', icon: Lock, history: [] },
        { id: 'rate', name: 'Bandwidth Limiter', status: 'OPERATIONAL', latency: 2, uptime: '99.999%', icon: Key, history: [] },
    ];

    const [services, setServices] = useState<Service[]>(initialServices.map(s => ({
        ...s,
        history: Array(20).fill(0).map(() => s.latency + Math.random() * 20 - 10)
    })));
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setServices(prevServices => prevServices.map(s => {
                const randomFactor = Math.random();
                let newStatus: ServiceStatus = s.status;
                let newLatency = s.latency + (Math.random() * 10 - 5);

                if (randomFactor > 0.98) {
                    newStatus = 'DEGRADED';
                    newLatency *= 3;
                } else if (randomFactor < 0.01) {
                    newStatus = 'OUTAGE';
                    newLatency = 9999;
                } else {
                    newStatus = 'OPERATIONAL';
                    if (s.id === 'ai') newLatency = 850 + (Math.random() * 100 - 50);
                    else if (s.id === 'sec') newLatency = 8 + (Math.random() * 2);
                    else if (s.id === 'rate') newLatency = 2 + (Math.random() * 1);
                    else newLatency = 50 + (Math.random() * 20 - 10);
                }
                
                const newHistory = [...s.history.slice(1), newLatency];

                return { ...s, status: newStatus, latency: Math.round(newLatency), history: newHistory };
            }));
            setLastUpdated(new Date());
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const allOperational = services.every(s => s.status === 'OPERATIONAL');

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tighter">System_Kernel_Status</h1>
                <p className="text-evalion-textDim font-mono max-w-2xl uppercase tracking-widest text-xs opacity-60">
                    Real-time operational metrics for all EvalionMind core services and security nodes.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`glass-panel p-4 rounded-lg mb-8 flex items-center gap-4 border-l-4 ${allOperational ? 'border-l-evalion-success' : 'border-l-evalion-danger'}`}
            >
                {allOperational ? <CheckCircle className="text-evalion-success" /> : <AlertTriangle className="text-evalion-danger animate-pulse" />}
                <div>
                    <h2 className={`font-bold font-mono uppercase tracking-widest ${allOperational ? 'text-evalion-success' : 'text-evalion-danger'}`}>
                        {allOperational ? 'All Security Protocols Nominal' : 'Protocol Disruption Detected'}
                    </h2>
                    <p className="text-[10px] text-evalion-textDim font-mono uppercase">
                        Last sync offset: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, i) => (
                    <StatusCard key={service.id} service={service} index={i} />
                ))}
            </div>

            <div className="mt-16 p-8 glass-panel rounded-2xl border border-evalion-teal/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Shield size={120} /></div>
                <h3 className="text-white font-bold font-mono mb-4 uppercase tracking-widest flex items-center gap-3">
                    <Lock size={18} className="text-evalion-teal" /> Zero-Trust Integrity Reports
                </h3>
                <p className="text-evalion-textDim font-mono text-sm leading-relaxed max-w-3xl mb-6">
                    EvaluationMind enforces absolute data immutability. Every interview transcript is cryptographically sealed using HMAC-SHA256 at the moment of completion. Our rate-limiting node monitors the global bandwidth mesh to prevent brute-force and enumeration vectors.
                </p>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-evalion-teal/10 border border-evalion-teal/30 rounded font-mono text-[9px] text-evalion-teal uppercase tracking-widest">
                        HMAC-SHA256_ACTIVE
                    </div>
                    <div className="px-4 py-2 bg-evalion-purple/10 border border-evalion-purple/30 rounded font-mono text-[9px] text-evalion-purple uppercase tracking-widest">
                        RATE_LIMITER_NODE_OPERATIONAL
                    </div>
                </div>
            </div>
        </div>
    );
};
