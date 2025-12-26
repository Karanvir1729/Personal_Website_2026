import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BootScreenProps {
    onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const bootSequence = [
            "Initializing kernel...",
            "Loading drivers...",
            "Mounting filesystem /dev/sda1...",
            "Starting OS shell...",
            "Welcome, guest."
        ];

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < bootSequence.length) {
                setLines(prev => [...prev, bootSequence[currentLine]]);
                currentLine++;
                setProgress(prev => prev + 20);
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 800); // Wait a bit after completion
            }
        }, 400);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black text-green-500 font-mono p-10 z-[10000] flex flex-col justify-start items-start">
            <div className="w-full max-w-2xl space-y-2">
                {lines.map((line, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-gray-500">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                        <span>{line}</span>
                    </div>
                ))}
                <div className="mt-8 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
