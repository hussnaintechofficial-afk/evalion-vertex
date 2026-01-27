
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { User, FinalReport } from '../types';
import { Download, CheckCircle, Lock, QrCode } from 'lucide-react';

const motion = framerMotion as any;

interface CertificateProps {
    user: User;
    report: FinalReport | null;
}

export const VerificationCertificate: React.FC<CertificateProps> = ({ user, report }) => {
    const isApproved = report?.hiringDecision === 'APPROVE';
    const verificationUrl = `https://evalion.os/verify/cert_${user.id}_${report?.id || 'pending'}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(verificationUrl)}&bgcolor=0d1117&color=00F0FF&qzone=1`;

    const handleDownloadCertificate = () => {
        const certificateHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate of Completion</title>
                <style>
                    body { font-family: monospace; background: #010409; color: #E6EDF3; padding: 40px; border: 10px solid #05FF00; }
                    .container { text-align: center; }
                    h1 { color: #00F0FF; text-transform: uppercase; letter-spacing: 0.2em; }
                    h2 { font-size: 2em; margin: 0; }
                    h3 { color: #8B949E; }
                    p { font-size: 1.2em; }
                    .footer { margin-top: 50px; font-size: 0.8em; color: #8B949E; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>EVALUATIONMIND OS</h1>
                    <p>Certificate of Technical Proficiency</p>
                    <hr style="border-color: #00F0FF30;"/>
                    <p>This certifies that</p>
                    <h2>${user.name}</h2>
                    <p>has successfully completed the autonomous technical assessment for the role of</p>
                    <h3>Senior Full Stack Engineer</h3>
                    <p>with an overall score of ${report?.overallScore}%.</p>
                    <div class="footer">
                        Verification ID: cert_${user.id}_${report?.id}<br/>
                        Issued On: ${new Date().toLocaleDateString()} by HussnainTechVertex Pvt Ltd
                    </div>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([certificateHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EvaluationMind_Certificate_${user.name.replace(' ', '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-evalion-success/5 rounded-full blur-[100px] group-hover:bg-evalion-success/10 transition-all duration-1000"></div>
            <div className="relative z-10">
                <h3 className="text-[11px] font-black text-white font-mono uppercase tracking-[0.4em] mb-8 pb-6 border-b border-white/5 flex items-center gap-4">
                    <CheckCircle size={18} className={isApproved ? "text-evalion-success" : "text-white/20"} /> 
                    Verification_Protocol
                </h3>

                <div className="flex items-center gap-8">
                    <div className="p-4 bg-evalion-surface border border-white/10 rounded-2xl relative">
                        {isApproved ? (
                            <img src={qrCodeUrl} alt="Verification QR Code" className="w-32 h-32 rounded-lg" />
                        ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-black/40">
                               <Lock size={40} className="text-white/20" />
                            </div>
                        )}
                         <div className="absolute inset-0 bg-cyber-grid bg-[length:15px_15px] opacity-[0.03] pointer-events-none"></div>
                    </div>
                    <div className="flex-1">
                        <div className={`text-xl font-black uppercase tracking-tighter ${isApproved ? 'text-evalion-success' : 'text-yellow-500'}`}>
                           {isApproved ? 'Identity_Verified' : 'Approval_Pending'}
                        </div>
                        <p className="text-[10px] font-mono text-evalion-textDim mt-2 uppercase tracking-widest opacity-60 font-black">
                            {isApproved 
                                ? 'Scan to verify authenticity on the public ledger.' 
                                : 'Certificate generation is locked until final approval.'}
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleDownloadCertificate}
                disabled={!isApproved}
                className={`w-full mt-10 py-5 rounded-2xl font-black text-[11px] font-mono flex items-center justify-center gap-3 uppercase tracking-[0.2em] transition-all relative z-10
                    ${isApproved 
                        ? 'bg-evalion-success text-evalion-bg hover:bg-white shadow-[0_0_40px_rgba(5,255,0,0.3)] active:scale-95' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                    }`
                }
            >
                <Download size={18} /> {isApproved ? 'Download_Certificate' : 'Locked'}
            </button>
        </div>
    );
};
