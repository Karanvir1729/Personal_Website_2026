import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BootScreenProps {
    onComplete: () => void;
}

const ASCII_LOGO = `
██╗  ██╗ █████╗ ██████╗  █████╗ ███╗   ██╗ ██████╗ ███████╗
██║ ██╔╝██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔═══██╗██╔════╝
█████╔╝ ███████║██████╔╝███████║██╔██╗ ██║██║   ██║███████╗
██╔═██╗ ██╔══██║██╔══██╗██╔══██║██║╚██╗██║██║   ██║╚════██║
██║  ██╗██║  ██║██║  ██║██║  ██║██║ ╚████║╚██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
`;

const bootSequence = [
    { text: "KaranOS v2026.1.0 - Personal Portfolio System", delay: 300 },
    { text: "Initializing kernel...", delay: 250 },
    { text: "Loading creativity drivers...", delay: 200 },
    { text: "Mounting /dev/portfolio...", delay: 200 },
    { text: "Starting experience engine...", delay: 200 },
    { text: "Loading projects database...", delay: 150 },
    { text: "Preparing interactive environment...", delay: 200 },
    { text: "✓ System ready", delay: 300 },
    { text: "", delay: 100 },
    { text: "Made with ❤️ by Karan", delay: 500 },
];

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [showLogo, setShowLogo] = useState(false);
    const currentLineRef = useRef(0);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const onCompleteRef = useRef(onComplete);

    // Keep onComplete ref updated
    onCompleteRef.current = onComplete;

    const runNextLine = useCallback(() => {
        const lineIndex = currentLineRef.current;
        if (lineIndex < bootSequence.length) {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, bootSequence[lineIndex].text]);
                setProgress(((lineIndex + 1) / bootSequence.length) * 100);
                currentLineRef.current = lineIndex + 1;
                runNextLine();
            }, bootSequence[lineIndex].delay);
            timeoutsRef.current.push(timeout);
        } else {
            const finalTimeout = setTimeout(() => {
                onCompleteRef.current();
            }, 600);
            timeoutsRef.current.push(finalTimeout);
        }
    }, []);

    useEffect(() => {
        // Show logo first
        const logoTimeout = setTimeout(() => setShowLogo(true), 200);
        timeoutsRef.current.push(logoTimeout);

        // Start boot sequence after logo appears
        const startTimeout = setTimeout(runNextLine, 800);
        timeoutsRef.current.push(startTimeout);

        return () => {
            timeoutsRef.current.forEach(t => clearTimeout(t));
        };
    }, [runNextLine]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-cyan-400 font-mono p-6 md:p-10 z-[10000] flex flex-col justify-center items-center overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <div className="relative z-10 w-full max-w-3xl">
                {/* ASCII Logo */}
                <motion.pre
                    initial={{ opacity: 0, y: -20 }}
                    animate={showLogo ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-[0.4rem] sm:text-[0.5rem] md:text-xs text-cyan-400 mb-8 leading-tight text-center overflow-x-auto"
                    style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}
                >
                    {ASCII_LOGO}
                </motion.pre>

                {/* Boot lines */}
                <div className="space-y-1 mb-8 min-h-[200px]">
                    {lines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-slate-500 text-xs">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                            <span className={`${line.includes('❤️') ? 'text-pink-400' : line.includes('✓') ? 'text-green-400' : ''}`}>
                                {line}
                            </span>
                        </motion.div>
                    ))}
                    {/* Blinking cursor */}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-cyan-400 ml-1"
                    />
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Version info */}
                <div className="flex justify-between mt-4 text-xs text-slate-500">
                    <span>Karan Khanna © 2026</span>
                    <span>Interactive Portfolio</span>
                </div>
            </div>
        </div>
    );
};
