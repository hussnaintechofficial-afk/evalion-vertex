
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion as framerMotion } from 'framer-motion';

// Use any to bypass motion type issues in the local environment and maintain consistency with other components
const motion = framerMotion as any;

export const RegionalLoadMap = () => {
    const [nodes, setNodes] = useState<number[]>(Array(72).fill(0).map(() => Math.random()));

    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prev => prev.map(n => {
                const delta = (Math.random() - 0.5) * 0.2;
                return Math.max(0.1, Math.min(1, n + delta));
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-12 gap-1.5 w-full h-full p-2">
            {nodes.map((load, i) => (
                <motion.div
                    key={i}
                    animate={{ 
                        backgroundColor: load > 0.8 ? '#8B5CF6' : load > 0.4 ? '#00F0FF' : '#0d1117',
                        opacity: load > 0.5 ? 0.6 : 0.2,
                        scale: load > 0.7 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 1 }}
                    className="aspect-square rounded-sm border border-white/5"
                    title={`Node Load: ${(load * 100).toFixed(1)}%`}
                />
            ))}
        </div>
    );
};
