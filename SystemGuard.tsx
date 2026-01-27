
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Terminal, ShieldAlert, WifiOff, CloudOff, Key } from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';

// Use any to bypass strict motion types if needed, though here we use simple divs mostly
const motion = framerMotion as any;

// FIX: Renamed Props to avoid potential global type conflicts.
interface ErrorBoundaryProps {
  children: ReactNode;
}

// FIX: Renamed State to avoid potential global type conflicts.
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * CATCHES CRITICAL RENDERING ERRORS
 * Displays a "Red Screen of Death" styled to match the OS aesthetic.
 */
// Fix: Use React.Component explicitly to ensure inheritance properties are correctly recognized by the compiler.
export class SystemErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly typed state to ensure complex type inference issues are avoided.
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("SystemGuard CRITICAL FAILURE:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010409] text-[#E6EDF3] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-[#FF2A6D] selection:text-white">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,42,109,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,42,109,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl w-full">
            <div className="glass-panel border-2 border-[#FF2A6D] bg-[#0d1117]/90 p-12 rounded-[2rem] shadow-[0_0_50px_rgba(255,42,109,0.15)] backdrop-blur-xl relative overflow-hidden">
               {/* Danger Striping */}
               <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF2A6D] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-50"></div>

               <div className="flex flex-col items-center text-center">
                  <div className="mb-8 relative">
                      <div className="w-24 h-24 bg-[#FF2A6D]/10 rounded-full flex items-center justify-center border border-[#FF2A6D]/30 animate-pulse">
                          <ShieldAlert size={48} className="text-[#FF2A6D]" />
                      </div>
                      <div className="absolute -inset-4 bg-[#FF2A6D]/5 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                      System Critical <span className="text-[#FF2A6D]">Failure</span>
                  </h1>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF2A6D]/10 border border-[#FF2A6D]/20 text-[#FF2A6D] font-mono text-xs font-bold uppercase tracking-widest mb-8">
                      <AlertTriangle size={12} /> Runtime_Exception_Detected
                  </div>

                  <p className="text-[#8B949E] font-mono text-sm leading-relaxed max-w-lg mb-10">
                      The application kernel encountered an unrecoverable error. Safety protocols have engaged to prevent data corruption. 
                      <br/><br/>
                      <span className="text-white bg-white/10 px-2 py-1 rounded border border-white/5">{this.state.error?.message || 'Unknown Error Vector'}</span>
                  </p>

                  <button 
                      onClick={this.handleReload}
                      className="group relative px-10 py-4 bg-[#FF2A6D] text-white font-black font-mono rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,42,109,0.4)] cursor-pointer"
                  >
                      <div className="relative z-10 flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> 
                          Reboot_System
                      </div>
                  </button>
               </div>

               {/* Technical Details (Collapsible) */}
               <div className="mt-12 border-t border-white/5 pt-8 w-full text-left">
                  <div className="bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-[#8B949E] overflow-x-auto max-h-40 custom-scrollbar">
                      <div className="flex items-center gap-2 text-[#FF2A6D] mb-2 uppercase font-bold sticky top-0 bg-[#0d1117]/0">
                          <Terminal size={12} /> Stack_Trace_Log
                      </div>
                      <pre className="opacity-70 whitespace-pre-wrap select-text">
                          {this.state.errorInfo?.componentStack || this.state.error?.stack || 'No stack trace available.'}
                      </pre>
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * MONITORS NETWORK CONNECTIVITY
 * Displays a banner when the user loses internet connection.
 */
export const NetworkStatusGuard = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#FF2A6D] text-white py-3 px-4 text-center font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_-5px_20px_rgba(255,42,109,0.3)] animate-pulse">
            <CloudOff size={16} /> Network_Uplink_Severed // Attempting Reconnection...
        </div>
    );
};

/**
 * BLOCKS APP IF API KEY IS MISSING OR INVALID
 * Provides a "hot-swap" capability by forcing a reload to pick up a new key.
 */
export const ApiKeyGuard = () => {
  const handleReload = () => window.location.reload();

  return (
    <div className="min-h-screen bg-[#010409] text-[#E6EDF3] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="relative z-10 max-w-xl w-full">
            <div className="glass-panel border-2 border-yellow-500/50 bg-[#0d1117]/90 p-12 rounded-[2rem] shadow-[0_0_50px_rgba(255,165,0,0.15)] backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-8 relative">
                        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 animate-pulse">
                            <Key size={48} className="text-yellow-500" />
                        </div>
                        <div className="absolute -inset-4 bg-yellow-500/5 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                        Access Protocol <span className="text-yellow-500">Failed</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-mono text-xs font-bold uppercase tracking-widest mb-8">
                        <AlertTriangle size={12} /> API_KEY_INVALIDATED
                    </div>
                    <p className="text-evalion-textDim font-mono text-sm leading-relaxed max-w-lg mb-10">
                        The required API key for the AI kernel is missing or improperly configured. 
                        Please ensure `process.env.API_KEY` is set in your environment.
                    </p>
                    <button 
                        onClick={handleReload}
                        className="group relative px-10 py-4 bg-yellow-500 text-black font-black font-mono rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,165,0,0.4)] cursor-pointer"
                    >
                        <div className="relative z-10 flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> 
                            Reload System
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
