/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- TECHNICAL CONTEXT DICTIONARY ---
// This map allows the AI OS to "hear" technical terms correctly.
const TECH_CORRECTIONS = {
    'nest js': 'NestJS', 'nestjs': 'NestJS', 'prisma': 'Prisma', 'postgress': 'PostgreSQL', 'postgres': 'PostgreSQL',
    'typescript': 'TypeScript', 'javascript': 'JavaScript', 'cap theorem': 'CAP Theorem', 'zero trust': 'Zero-Trust',
    'micro expressions': 'micro-expressions', 'webrtc': 'WebRTC', 'kubernetes': 'Kubernetes', 'k8s': 'K8s',
    'docker': 'Docker', 'react': 'React', 'angular': 'Angular', 'backend': 'Backend', 'frontend': 'Frontend',
    'api': 'API', 'restful': 'RESTful', 'graphql': 'GraphQL', 'nosql': 'NoSQL', 'sql': 'SQL', 'agile': 'Agile', 'scrum': 'Scrum'
};

const FILLER_WORDS = [
    'um', 'uh', 'er', 'ah', 'like', 'okay', 'right', 'so', 'you know', 
    'basically', 'actually', 'literally', 'well', 'i mean', 'i guess'
];

/**
 * Applies fuzzy matching and regex-based correction for technical vocabulary.
 */
function applyNeuralCorrection(text) {
    let corrected = text;
    // Iterate through tech terms and perform case-insensitive replacement with word-boundary checks
    for (const [misspelled, correct] of Object.entries(TECH_CORRECTIONS)) {
        const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
        corrected = corrected.replace(regex, correct);
    }
    return corrected;
}

/**
 * Removes common filler words to clean up the transcript.
 */
function removeFillerWords(text) {
    const fillerRegex = new RegExp(`\\b(${FILLER_WORDS.join('|')})\\b`, 'gi');
    return text.replace(fillerRegex, '').replace(/\s\s+/g, ' ').trim();
}

/**
 * Main worker message handler. Receives raw transcript chunks, cleans them,
 * and posts back the processed result.
 */
self.onmessage = (event) => {
    if (event.data.type === 'process_transcript_chunk') {
        const { chunk } = event.data;
        const correctedChunk = applyNeuralCorrection(chunk);
        const cleanedChunk = removeFillerWords(correctedChunk);
        
        self.postMessage({ 
            type: 'processed_transcript_chunk', 
            cleanedChunk
        });
    }
};
