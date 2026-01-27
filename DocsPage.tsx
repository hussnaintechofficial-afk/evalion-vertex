/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Terminal, Copy } from 'lucide-react';

export const DocsPage = () => {
  return (
    <div className="pt-24 min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-evalion-teal/10 hidden lg:block fixed h-full bg-evalion-bg/95 backdrop-blur-sm pt-8 pl-6 overflow-y-auto z-20">
            <h3 className="text-xs font-bold text-evalion-teal font-mono mb-6">API_REFERENCE_V1</h3>
            <ul className="space-y-1 text-sm font-mono text-evalion-textDim">
                <li className="text-white font-bold pl-2 border-l-2 border-evalion-teal cursor-pointer">Introduction</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">Authentication</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">Webhooks</li>
                <li className="pt-4 pb-2 text-xs text-white/50 uppercase">Endpoints</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">POST /interview/init</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">GET /candidate/:id</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">POST /code/execute</li>
                <li className="pl-2 hover:text-white cursor-pointer py-1">GET /report/generate</li>
            </ul>
        </div>

        {/* Content */}
        <div className="flex-1 lg:ml-64 px-6 lg:px-12 py-8 max-w-5xl">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">REST API Documentation</h1>
                <p className="text-evalion-textDim leading-relaxed">
                    Integrate EvaluationMind's autonomous hiring engine directly into your existing ATS or internal portals. 
                    All endpoints are secured via JWT and rate-limited to 1000 req/min/IP.
                </p>
            </div>

            <div className="space-y-12">
                {/* SECTION: AUTH */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Terminal size={20} className="text-evalion-teal"/> Authentication
                    </h2>
                    <p className="text-sm text-evalion-textDim mb-4">Include your API key in the Authorization header.</p>
                    <div className="bg-[#0d1117] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto">
                        <div className="flex justify-between text-white/50 mb-2">
                            <span>bash</span>
                            <Copy size={12} className="cursor-pointer hover:text-white"/>
                        </div>
                        <code className="text-green-400">
                            curl -X GET https://api.evalion-mind.os/v1/status \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer <span className="text-yellow-400">YOUR_API_KEY</span>"
                        </code>
                    </div>
                </section>

                {/* SECTION: INIT INTERVIEW */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Initialize Interview</h2>
                    <p className="text-sm text-evalion-textDim mb-4">
                        Creates a secure room and generates a one-time access token for the candidate.
                    </p>
                    <div className="flex gap-2 mb-2 font-mono text-xs">
                        <span className="bg-evalion-teal text-black px-2 py-0.5 rounded font-bold">POST</span>
                        <span className="text-white">/v1/interview/init</span>
                    </div>
                    
                    <div className="bg-[#0d1117] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto">
                         <div className="text-purple-400 mb-2">// Request Payload</div>
                         <pre className="text-gray-300">
{`{
  "candidateEmail": "alex@example.com",
  "jobRole": "SENIOR_BACKEND",
  "modules": ["CODE_SANDBOX", "SYSTEM_DESIGN"],
  "difficulty": "HARD"
}`}
                         </pre>
                         <div className="text-purple-400 my-2">// Response (200 OK)</div>
                         <pre className="text-gray-300">
{`{
  "sessionId": "sess_99821_ax",
  "secureLink": "https://evalion.os/meet/sess_99821_ax?token=...",
  "expiresAt": "2024-10-12T14:00:00Z"
}`}
                         </pre>
                    </div>
                </section>

                {/* SECTION: GET CANDIDATE */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Get Candidate Details</h2>
                    <p className="text-sm text-evalion-textDim mb-4">
                        Retrieves comprehensive assessment history, biometric profiles, and technical scores for a specific candidate identity.
                    </p>
                    <div className="flex gap-2 mb-2 font-mono text-xs">
                        <span className="bg-evalion-teal text-black px-2 py-0.5 rounded font-bold">GET</span>
                        <span className="text-white">/v1/candidate/:id</span>
                    </div>
                    
                    <div className="bg-[#0d1117] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto mb-4">
                         <div className="text-purple-400 mb-2">// cURL Example</div>
                         <code className="text-green-400">
                            curl -X GET https://api.evalion-mind.os/v1/candidate/cand_550e8400 \<br/>
                            &nbsp;&nbsp;-H "Authorization: Bearer <span className="text-yellow-400">YOUR_API_KEY</span>"
                        </code>
                    </div>

                    <div className="bg-[#0d1117] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto">
                         <div className="text-purple-400 mb-2">// Response (200 OK)</div>
                         <pre className="text-gray-300">
{`{
  "id": "cand_550e8400",
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "status": "EVALUATED",
  "trustScore": 92,
  "biometricId": "bio_v4_772",
  "lastAssessment": "2024-10-25T10:00:00Z",
  "metadata": {
    "verified": true,
    "roleExpertise": ["System Architecture", "Cloud Native"]
  }
}`}
                         </pre>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};
