/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

export const PolicyPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <h1 className="text-4xl font-bold text-white mb-4">Privacy & Data Protocol</h1>
            <p className="text-evalion-textDim font-mono">Last Updated: October 26, 2024</p>
        </motion.div>

        <div className="prose prose-invert prose-p:font-mono prose-p:text-evalion-textDim prose-headings:text-white prose-headings:font-bold prose-headings:font-mono prose-a:text-evalion-teal hover:prose-a:text-white max-w-none">
            <h2>1. Data Collection</h2>
            <p>
                EvaluationMind collects data solely for the purpose of technical and behavioral assessment. This includes video, audio, and code submissions ("Session Data"). All data is encrypted in transit (TLS 1.3) and at rest (AES-256).
            </p>
            
            <h2>2. Data Usage</h2>
            <p>
                Session Data is processed by our AI models to generate an assessment report. This report is accessible only to the authenticated recruiter or hiring manager associated with the assessment. We do not use your data to train our global models without explicit, opt-in consent.
            </p>
            
            <h2>3. Biometric Information</h2>
            <p>
                Our Biometric Sentinel module analyzes visual and audio streams to generate metadata (e.g., gaze vector, expression classification). We do not store raw biometric identifiers. The generated metadata is part of the Session Data and is deleted according to the retention policy.
            </p>

            <h2>4. Data Retention</h2>
            <p>
                By default, all Session Data is permanently deleted from our systems 90 days after an assessment is completed. Enterprise clients may configure custom data retention policies, including immediate deletion upon request.
            </p>
            
            <h2>5. Sub-processors</h2>
            <p>
                We may use third-party sub-processors for services like cloud hosting (e.g., AWS, GCP) and AI inference. All sub-processors are vetted for SOC 2 Type II and GDPR compliance. A full list is available upon request for enterprise customers.
            </p>

            <h2>6. Your Rights</h2>
            <p>
                Under GDPR and CCPA, you have the right to access, rectify, or request deletion of your personal data. Please direct any such requests to the organization that initiated your assessment. For direct inquiries, contact our Data Protection Officer at <a href="mailto:privacy@hussnaintechvertex.com">privacy@hussnaintechvertex.com</a>.
            </p>
        </div>
    </div>
  );
};