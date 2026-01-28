/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion as framerMotion } from 'framer-motion';
import { Shield, Target, Globe, Award, MapPin, Play, Terminal, Cpu } from 'lucide-react';

const motion = framerMotion as any;

const HR_ALGO_CODE = `// HR Risk Analysis Algorithm v1.2
// Analyzing flight risk based on engagement metrics

interface Employee {
  id: string;
  name: string;
  tenureMonths: number;
  lastPromotionMonths: number;
  engagementScore: number; // 0-100
}

function calculateFlightRisk(employee: Employee): string {
  const stagnationFactor = employee.lastPromotionMonths / 12;
  const riskScore = (100 - employee.engagementScore) * 1.5 + (stagnationFactor * 10);
  
  if (riskScore > 80) return "CRITICAL_RISK";
  if (riskScore > 50) return "MODERATE_RISK";
  return "STABLE";
}

// Simulating analysis on sample data...
const sampleData = {
  id: "E-492",
  name: "J. Doe",
  tenureMonths: 36,
  lastPromotionMonths: 24,
  engagementScore: 62
};

console.log("Analyzing Employee: " + sampleData.name);
const result = calculateFlightRisk(sampleData);
console.log("Risk Assessment: " + result);
return { riskLevel: result, score: 72 };`;

export const CompanyPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Simulate execution steps
    setTimeout(() => setOutput(prev => [...prev, "> Compiling TypeScript module..."]), 300);
    setTimeout(() => setOutput(prev => [...prev, "> Loading employee dataset E-492..."]), 800);
    setTimeout(() => setOutput(prev => [...prev, "> Analyzing Employee: J. Doe"]), 1400);
    setTimeout(() => setOutput(prev => [...prev, "> Risk Assessment: MODERATE_RISK"]), 2000);
    setTimeout(() => {
        setOutput(prev => [...prev, "> Execution finished in 142ms"]);
        setIsRunning(false);
    }, 2200);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 mb-4 border border-evalion-teal/30 rounded-full bg-evalion-teal/5 text-evalion-teal font-mono text-xs tracking-widest uppercase"
            >
                Architects of Intelligence
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-evalion-textDim">POWERED BY</span><br/>
                <span className="text-evalion-teal neon-text">HUSSNAIN TECH VERTEX</span>
            </h1>
            <p className="text-lg text-evalion-textDim font-mono max-w-3xl mx-auto">
                Redefining the digital frontier from Daska, Sialkot to the World. We build zero-trust, autonomous systems for the next generation of enterprise.
            </p>
        </div>

        {/* The Architect Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
            <motion.div 
                className="lg:col-span-5 relative group"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-evalion-teal/20 rounded-xl z-0 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-evalion-teal/20 to-evalion-purple/20 blur-xl opacity-50 z-0"></div>
                
                {/* Image Container */}
                <div className="relative z-10 rounded-xl overflow-hidden border-2 border-evalion-teal/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] aspect-[3/4]">
                    <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                        alt="Mr. Hussnain - Owner & Principal Architect" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                        <h2 className="text-2xl font-bold text-white mb-1">MR. HUSSNAIN</h2>
                        <div className="flex items-center gap-2 text-evalion-teal font-mono text-xs tracking-wider uppercase">
                            <Award size={14} /> Owner & Principal Architect
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="lg:col-span-7 space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-evalion-purple relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Globe size={100} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Target className="text-evalion-purple" /> MISSION_STATEMENT
                    </h3>
                    <p className="text-evalion-textDim leading-relaxed font-mono text-sm">
                        "At HussnainTechVertex, we don't just write code; we architect ecosystems. EvaluationMind 1.0 represents the pinnacle of our vision—a world where recruitment is unbiased, instant, and mathematically precise. Born in Pakistan, serving the global digital economy."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            <MapPin className="text-evalion-teal" size={16} /> HQ_COORDINATES
                        </h4>
                        <div className="text-sm text-evalion-textDim font-mono space-y-1">
                            <p>Daska, Sialkot</p>
                            <p>Punjab, Pakistan</p>
                            <p className="text-xs opacity-50">32.3242° N, 74.3503° E</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-xl">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Shield className="text-evalion-teal" size={16} /> CORE_EXPERTISE
                        </h4>
                        <ul className="text-sm text-evalion-textDim font-mono space-y-1">
                            <li>• AI/ML Architecture</li>
                            <li>• Zero-Trust Security</li>
                            <li>• Enterprise Full-Stack</li>
                            <li>• Real-time Systems</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* --- LIVE HR ALGO PLAYGROUND --- */}
        <section className="mb-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Terminal size={28} className="text-evalion-teal" /> Algorithmic Sandbox
                    </h2>
                    <p className="text-evalion-textDim font-mono text-sm max-w-2xl">
                        Experience our proprietary HR logic engine. Run the script below to simulate flight risk analysis on a dummy employee record.
                    </p>
                </div>
                <button 
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-6 py-3 bg-evalion-teal hover:bg-white text-black font-bold font-mono rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                    {isRunning ? <Cpu className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                    {isRunning ? 'PROCESSING...' : 'EXECUTE PROTOCOL'}
                </button>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden border border-evalion-teal/20 bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="ml-3 text-xs font-mono text-white/40">risk_analysis.ts</span>
                    </div>
                    <div className="text-[10px] text-evalion-teal font-mono">READ_ONLY_MODE</div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Code Editor Area */}
                    <div className="p-6 font-mono text-xs md:text-sm bg-black/20 overflow-x-auto">
                        <pre className="text-gray-300">
                            {HR_ALGO_CODE.split('\n').map((line, i) => (
                                <div key={i} className="table-row">
                                    <span className="table-cell text-gray-700 select-none pr-4 text-right w-8">{i + 1}</span>
                                    <span className="table-cell">
                                        {line
                                            .replace('function', '___FUNC___')
                                            .replace('interface', '___INT___')
                                            .replace('return', '___RET___')
                                            .replace('const', '___CNST___')
                                            .replace('___FUNC___', '<span class="text-purple-400">function</span>')
                                            .replace('___INT___', '<span class="text-blue-400">interface</span>')
                                            .replace('___RET___', '<span class="text-red-400">return</span>')
                                            .replace('___CNST___', '<span class="text-blue-400">const</span>')
                                            .replace(/\/\/.*/, match => `<span class="text-gray-500">${match}</span>`)
                                            .split(/(<span.*?>.*?<\/span>)/g).map((part, j) => 
                                                part.startsWith('<span') ? <span key={j} dangerouslySetInnerHTML={{__html: part}}/> : part
                                            )
                                        }
                                    </span>
                                </div>
                            ))}
                        </pre>
                    </div>

                    {/* Output Console */}
                    <div className="border-t lg:border-t-0 lg:border-l border-white/5 bg-[#05090e] p-6 font-mono text-xs md:text-sm flex flex-col">
                         <div className="text-white/30 mb-4 text-[10px] uppercase tracking-wider border-b border-white/5 pb-2">Console Output</div>
                         <div className="flex-1 space-y-2 font-mono">
                            {output.length === 0 && !isRunning && (
                                <div className="text-gray-600 italic">Waiting for execution trigger...</div>
                            )}
                            {output.map((line, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`${line.includes('CRITICAL') || line.includes('MODERATE') ? 'text-evalion-danger font-bold' : 'text-green-400'}`}
                                >
                                    {line}
                                </motion.div>
                            ))}
                            {isRunning && (
                                <div className="w-2 h-4 bg-evalion-teal animate-pulse inline-block align-middle ml-1"></div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};