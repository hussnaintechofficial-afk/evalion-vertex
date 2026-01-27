/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { AppState } from '../../types';
import { Layout, Server, Cpu, Shield, Database, ChevronsRight, Lock, Bot, Wind } from 'lucide-react';

const motion = framerMotion as any;

const ArchPageLayout = ({ icon: Icon, title, subtitle, colorClass, children }: any) => (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8"
        >
            <div className={`p-4 rounded-xl bg-evalion-surface border border-white/10 ${colorClass}`}>
                <Icon size={48} />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                <p className="text-evalion-textDim font-mono">{subtitle}</p>
            </div>
        </motion.div>
        <div className="prose prose-invert prose-p:font-mono prose-p:text-evalion-textDim prose-headings:text-white prose-headings:font-bold prose-headings:font-mono prose-a:text-evalion-teal hover:prose-a:text-white max-w-none">
            {children}
        </div>
    </div>
);

const CodeBlock = ({ code, language, title }: { code: string; language: string, title: string }) => (
    <div className="bg-[#0d1117] rounded-lg border border-white/10 my-8 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-xs font-mono text-white/50">{title}</span>
            <span className="text-[10px] font-mono text-evalion-teal uppercase">{language}</span>
        </div>
        <pre className="p-4 text-xs md:text-sm overflow-x-auto"><code dangerouslySetInnerHTML={{ __html: code.trim() }}></code></pre>
    </div>
);

// --- SPECIFIC ARCHITECTURE PAGES ---

export const FrontendArchPage = ({ onNavigate }: { onNavigate: (s: AppState) => void }) => (
    <ArchPageLayout icon={Layout} title="Frontend Architecture" subtitle="The Interface Layer" colorClass="text-evalion-teal">
        <h2>Reactive & Performant by Design</h2>
        <p>
            The EvaluationMind frontend is engineered as a standalone, component-based application using the latest industry standards.
            The primary architectural goal is to ensure a fluid, real-time user experience with zero-latency feedback during critical interview sessions.
        </p>
        <h3>Core Principles:</h3>
        <ul>
            <li><strong>State Management:</strong> We leverage a signal-based state management system for fine-grained reactivity. This avoids unnecessary re-renders and ensures UI updates are surgical and efficient.</li>
            <li><strong>Component Architecture:</strong> A fully component-based model ensures reusability, testability, and clear separation of concerns. All components are designed with performance in mind.</li>
            <li><strong>Styling:</strong> TailwindCSS is used for a utility-first styling approach, allowing for rapid development of a consistent and maintainable design system. The "glassmorphism" effect is used to create a modern, layered interface.</li>
            <li><strong>Asynchronous Operations:</strong> Heavy computational tasks, such as real-time audio transcript processing, are offloaded from the main thread to Web Workers. This prevents UI blocking and maintains a responsive interface even under load.</li>
        </ul>
    </ArchPageLayout>
);

const PRISMA_SCHEMA_HTML = `
<span class="text-purple-400">model</span> <span class="text-green-400">Job</span> {
  <span class="text-blue-400">id</span>          String   <span class="text-yellow-400">@id @default(uuid())</span>
  <span class="text-blue-400">title</span>       String
  <span class="text-blue-400">department</span>  String
  <span class="text-blue-400">applications</span>  Application[]
}

<span class="text-purple-400">model</span> <span class="text-green-400">PipelineStage</span> {
  <span class="text-blue-400">id</span>          String   <span class="text-yellow-400">@id @default(uuid())</span>
  <span class="text-blue-400">name</span>        String
  <span class="text-blue-400">order</span>       Int
  <span class="text-blue-400">applications</span>  Application[]
}

<span class="text-purple-400">model</span> <span class="text-green-400">Application</span> {
  <span class="text-blue-400">id</span>          String   <span class="text-yellow-400">@id @default(uuid())</span>
  <span class="text-blue-400">job</span>         Job      <span class="text-yellow-400">@relation(fields: [jobId], references: [id])</span>
  <span class="text-blue-400">jobId</span>       String
  <span class="text-blue-400">stage</span>       PipelineStage <span class="text-yellow-400">@relation(fields: [stageId], references: [id])</span>
  <span class="text-blue-400">stageId</span>     String
  <span class="text-gray-500">// ... other fields</span>
}`;

const NESTJS_CONTROLLER_HTML = `
<span class="text-yellow-400">@Controller('ats')</span>
<span class="text-purple-400">export class</span> <span class="text-green-400">AtsController</span> {
  <span class="text-purple-400">constructor</span>(<span class="text-blue-400">private readonly</span> atsService: AtsService) {}

  <span class="text-yellow-400">@Get('pipeline/:jobId')</span>
  <span class="text-purple-400">async</span> <span class="text-blue-400">getPipeline</span>(<span class="text-yellow-400">@Param('jobId')</span> jobId: <span class="text-green-400">string</span>) {
    <span class="text-purple-400">return this</span>.atsService.<span class="text-blue-400">getPipelineForJob</span>(jobId);
  }

  <span class="text-yellow-400">@Put('application/move')</span>
  <span class="text-purple-400">async</span> <span class="text-blue-400">moveCandidate</span>(<span class="text-yellow-400">@Body()</span> moveDto: MoveStageDto) {
    <span class="text-purple-400">return this</span>.atsService.<span class="text-blue-400">moveApplication</span>(moveDto);
  }

  <span class="text-gray-500">// ... other endpoints</span>
}`;

export const BackendArchPage = ({ onNavigate }: { onNavigate: (s: AppState) => void }) => (
    <ArchPageLayout icon={Server} title="Backend Architecture" subtitle="The Core Logic Layer" colorClass="text-evalion-purple">
        <h2>Modular, Type-Safe Monolith</h2>
        <p>
            The backend is built on a NestJS (Node.js) framework, providing a robust, scalable, and maintainable foundation. It follows a "modular monolith" pattern, where features are encapsulated into distinct modules (Auth, ATS, AI, etc.) that can be scaled or extracted into microservices as needed.
        </p>
        <h3><Database size={16} className="inline mr-2"/> Database Schema</h3>
        <p>
            We use Prisma as our ORM to interact with a PostgreSQL database. This ensures full type-safety from the database query all the way to the frontend client, eliminating an entire class of data-related bugs. The schema is the single source of truth for our data models.
        </p>
        <CodeBlock code={PRISMA_SCHEMA_HTML} language="Prisma" title="schema.prisma" />
        
        <h3><ChevronsRight size={16} className="inline mr-2"/> Controller Logic</h3>
        <p>
            Controllers handle incoming HTTP requests. We use DTOs (Data Transfer Objects) with `class-validator` to automatically validate incoming request bodies, ensuring that our service layer only ever receives sanitized, correctly-formatted data.
        </p>
        <CodeBlock code={NESTJS_CONTROLLER_HTML} language="TypeScript" title="ats.controller.ts" />
    </ArchPageLayout>
);

export const AIEngineArchPage = ({ onNavigate }: { onNavigate: (s: AppState) => void }) => (
    <ArchPageLayout icon={Cpu} title="AI Engine Architecture" subtitle="The Intelligence Layer" colorClass="text-white">
        <h2>Orchestrated Intelligence</h2>
        <p>
            The AI Engine is not a single model but an orchestration layer that leverages multiple specialized AI services to perform complex analysis tasks. This modular approach allows us to use the best-in-class model for each specific job.
        </p>
        <h3>Core Models:</h3>
        <ul>
            <li><strong><Bot className="inline mr-2"/> Reasoning & Logic:</strong> Utilizes large language models (LLMs) like GPT-4o for analyzing the semantic content of candidate responses, assessing problem-solving approaches, and generating follow-up questions.</li>
            <li><strong><Wind className="inline mr-2"/> Speech-to-Text (STT):</strong> Employs models like Whisper for highly accurate, real-time transcription of interview audio. This transcript forms the basis for all further linguistic analysis.</li>
            <li><strong><Layout className="inline mr-2"/> Computer Vision (CV):</strong> Powers the "Biometric Sentinel" by using models like ResNet to analyze the video stream for proctoring purposes, such as gaze detection and liveness checks.</li>
        </ul>
        <h3>Processing Pipeline:</h3>
        <p>
            When an interview is complete, the collected data (video, audio, code) is passed to an asynchronous processing pipeline. A master orchestrator (e.g., LangChain) routes the data to the appropriate models, collects the outputs, and synthesizes them into a final, multi-faceted report.
        </p>
    </ArchPageLayout>
);

export const SecurityArchPage = ({ onNavigate }: { onNavigate: (s: AppState) => void }) => (
    <ArchPageLayout icon={Shield} title="Security Architecture" subtitle="The Zero-Trust Layer" colorClass="text-evalion-danger">
        <h2>Security by Default</h2>
        <p>
            Our entire platform is built on a "Zero-Trust" security model. This means that no service or user is trusted by default, and verification is required for every request, whether it originates from inside or outside the network.
        </p>
        <h3>Key Security Measures:</h3>
        <ul>
            <li><strong><Lock className="inline mr-2"/> Authentication:</strong> We use stateless JSON Web Tokens (JWT) for authentication. Tokens are short-lived and contain scoped permissions, limiting the potential impact of a compromised token. Integration with OAuth 2.0 providers (like Google, Microsoft) is supported for enterprise clients.</li>
            <li><strong>Data Encryption:</strong> All data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256). Sensitive data within the database, such as PII, undergoes an additional layer of application-level encryption.</li>
            <li><strong>Rate Limiting & Threat Detection:</strong> API endpoints are protected against abuse with strict rate limiting. We employ automated systems to detect and block suspicious activity, such as credential stuffing or enumeration attacks.</li>
            <li><strong>Data Sovereignty:</strong> We provide options for enterprise clients to deploy the entire stack within their own VPC or on-premise infrastructure, ensuring they have full control over their data. Read more in our <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('POLICY'); }}>Privacy & Data Protocol</a>.</li>
        </ul>
    </ArchPageLayout>
);