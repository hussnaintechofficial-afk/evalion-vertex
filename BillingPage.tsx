
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { AppState, User } from '../../types';
import { CreditCard, Zap, Users, Download, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

const motion = framerMotion as any;

const UsageMeter = ({ label, value, limit, color }: { label: string; value: number; limit: number; color: string }) => {
    const percentage = (value / limit) * 100;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-2 font-mono text-xs">
                <span className="text-evalion-textDim uppercase tracking-widest">{label}</span>
                <span className="font-bold text-white">{value.toLocaleString()} / <span className="text-evalion-textDim">{limit.toLocaleString()}</span></span>
            </div>
            <div className="h-2 w-full bg-black/30 rounded-full border border-white/10 overflow-hidden">
                <motion.div 
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                />
            </div>
        </div>
    );
};

export const BillingPage = ({ user, onNavigate }: { user: User; onNavigate: (state: AppState) => void }) => {
    const invoices = [
        { id: 'INV-2024-012', date: 'Oct 1, 2024', amount: '$499.00', status: 'Paid' },
        { id: 'INV-2024-011', date: 'Sep 1, 2024', amount: '$499.00', status: 'Paid' },
        { id: 'INV-2024-010', date: 'Aug 1, 2024', amount: '$499.00', status: 'Paid' },
    ];

    const handleDownloadInvoice = (invoice: typeof invoices[0]) => {
        const receiptContent = `
EVALUATIONMIND OS - OFFICIAL INVOICE
===========================================
INVOICE ID:       ${invoice.id}
ISSUE DATE:       ${invoice.date}
STATUS:           ${invoice.status}
-------------------------------------------
BILLED TO:
  ${user.companyName || user.name}
  ${user.email}
-------------------------------------------
DESCRIPTION                     AMOUNT
===========================================
EvaluationMind OS - SCALE TIER      ${invoice.amount}
-------------------------------------------
TOTAL                             ${invoice.amount}

Thank you for your business.
-- HUSSNAINTECHVERTEX PVT LTD --
Verification Protocol: active
`;
        const blob = new Blob([receiptContent.trim()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8"
            >
                <div className="p-4 rounded-xl bg-evalion-surface border border-white/10 text-evalion-danger">
                    <CreditCard size={48} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight">Billing_&_Usage_Protocol</h1>
                    <p className="text-evalion-textDim font-mono uppercase tracking-widest text-xs">Manage plan, view usage, and access invoices.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CURRENT PLAN */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 glass-panel p-8 rounded-2xl border-t-4 border-evalion-purple flex flex-col justify-between"
                >
                    <div>
                        <h2 className="text-xs font-mono text-evalion-purple uppercase tracking-widest mb-2 font-black">Current_Plan</h2>
                        <p className="text-3xl font-bold text-white font-mono mb-4">SCALE_TIER</p>
                        <p className="text-evalion-textDim text-sm font-mono mb-6">$499 / month</p>
                    </div>
                    <button 
                        onClick={() => onNavigate('PRICING')}
                        className="w-full mt-4 py-3 bg-evalion-purple/20 text-evalion-purple rounded-lg font-bold hover:bg-evalion-purple hover:text-white transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-widest border border-evalion-purple/30"
                    >
                        Manage Subscription <ArrowRight size={16}/>
                    </button>
                </motion.div>

                {/* USAGE METRICS */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-panel p-8 rounded-2xl space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xs font-mono text-evalion-textDim uppercase tracking-widest font-black">Current_Billing_Cycle_Usage</h2>
                        <p className="text-xs font-mono text-evalion-textDim flex items-center gap-2"><RefreshCw size={12} className="animate-spin" /> Renews on Nov 1, 2024</p>
                    </div>
                    <UsageMeter label="Concurrent Interviews" value={182} limit={500} color="bg-evalion-teal" />
                    <UsageMeter label="AI Proctoring Hours" value={310} limit={1000} color="bg-evalion-purple" />
                    <UsageMeter label="Admin Seats" value={4} limit={5} color="bg-evalion-teal" />
                </motion.div>
            </div>

            {/* INVOICE HISTORY */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 glass-panel p-8 rounded-2xl"
            >
                <h2 className="text-xs font-mono text-evalion-textDim uppercase tracking-widest mb-4 font-black">Invoice_History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-sm">
                        <thead className="border-b border-white/10 text-xs text-evalion-textDim uppercase">
                            <tr>
                                <th className="p-3">Invoice ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">{invoice.id}</td>
                                    <td className="p-4">{invoice.date}</td>
                                    <td className="p-4">{invoice.amount}</td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-2 text-evalion-success">
                                            <CheckCircle size={14} /> {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDownloadInvoice(invoice)} className="flex items-center gap-2 text-evalion-teal hover:text-white transition-colors ml-auto text-xs">
                                            <Download size={14} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};
