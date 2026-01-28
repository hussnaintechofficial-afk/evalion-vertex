/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Send, MessageSquare, CheckCircle } from 'lucide-react';

const motion = framerMotion as any;

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', message: '', honeypot: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check: If the hidden field is filled, it's a bot.
    if (formData.honeypot) {
        console.warn("Spam detected");
        // Fake success to the bot
        setIsSubmitted(true);
        return;
    }

    // Process valid submission (Simulated)
    setTimeout(() => {
        setIsSubmitted(true);
        setFormData({ name: '', message: '', honeypot: '' });
    }, 800);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <h1 className="text-4xl font-bold text-white mb-4">SECURE COMMS CHANNEL</h1>
            <p className="text-evalion-textDim font-mono">
                Encrypted communication lines are open. Initiate protocol to connect with HussnainTechVertex.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details Card */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-evalion-teal/5 to-transparent"></div>
                
                <h2 className="text-xl font-bold text-white mb-8 font-mono border-b border-evalion-teal/10 pb-4">DIRECT_UPLINK</h2>
                
                <div className="space-y-8">
                    <div className="flex items-start gap-4 group">
                        <div className="p-3 rounded-lg bg-evalion-teal/10 text-evalion-teal group-hover:bg-evalion-teal group-hover:text-black transition-colors">
                            <Phone size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-evalion-textDim uppercase mb-1">Secure Line (PK)</div>
                            <div className="text-lg font-bold text-white tracking-wide">+92 302 8808488</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="p-3 rounded-lg bg-evalion-purple/10 text-evalion-purple group-hover:bg-evalion-purple group-hover:text-white transition-colors">
                            <Mail size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-evalion-textDim uppercase mb-1">Official Query Stream</div>
                            <div className="text-lg font-bold text-white tracking-wide break-all">hussnaintechofficial@gmail.com</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="p-3 rounded-lg bg-evalion-surface border border-evalion-teal/20 text-evalion-textDim group-hover:border-evalion-teal transition-colors">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-evalion-textDim uppercase mb-1">Operational Base</div>
                            <div className="text-lg font-bold text-white">Daska, Sialkot</div>
                            <div className="text-sm text-evalion-textDim">Punjab, Pakistan</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Message Form Mockup */}
            <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8 rounded-2xl border-t-4 border-t-evalion-teal relative"
            >
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                        >
                            <div className="w-16 h-16 bg-evalion-success/10 rounded-full flex items-center justify-center text-evalion-success border border-evalion-success/30 shadow-[0_0_20px_rgba(5,255,0,0.2)]">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white font-mono">TRANSMISSION RECEIVED</h3>
                                <p className="text-sm text-evalion-textDim mt-2">Your encrypted packet has been securely logged.</p>
                            </div>
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono rounded border border-white/10 transition-colors"
                            >
                                SEND ANOTHER
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                                <MessageSquare size={20} className="text-evalion-teal"/> TRANSMISSION_FORM
                            </h2>
                            
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Honeypot Field - Hidden from humans */}
                                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                                    <label htmlFor="website_url">Website</label>
                                    <input 
                                        type="text" 
                                        id="website_url" 
                                        name="website_url" 
                                        tabIndex={-1} 
                                        autoComplete="off"
                                        value={formData.honeypot}
                                        onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-evalion-textDim uppercase">Identity</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="NAME / ORG" 
                                        className="w-full bg-black/30 border border-evalion-teal/20 rounded px-4 py-3 text-white text-sm focus:border-evalion-teal outline-none transition-colors" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-evalion-textDim uppercase">Payload</label>
                                    <textarea 
                                        rows={4} 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="ENTER MESSAGE..." 
                                        className="w-full bg-black/30 border border-evalion-teal/20 rounded px-4 py-3 text-white text-sm focus:border-evalion-teal outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-evalion-teal text-black font-bold font-mono rounded flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                                    SEND ENCRYPTED PACKET <Send size={16} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    </div>
  );
};