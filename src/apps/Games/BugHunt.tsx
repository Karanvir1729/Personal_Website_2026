import React, { useState, useEffect, useRef } from 'react';
import { Bug } from 'lucide-react';
import { motion } from 'framer-motion';

interface BugEntity {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
}

export const BugHunt: React.FC = () => {
    const [bugs, setBugs] = useState<BugEntity[]>([]);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];

    const startGame = () => {
        const newBugs: BugEntity[] = [];
        for (let i = 0; i < 15; i++) {
            newBugs.push({
                id: i,
                x: Math.random() * (containerRef.current?.offsetWidth || 500),
                y: Math.random() * (containerRef.current?.offsetHeight || 300),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        setBugs(newBugs);
        setScore(0);
        setGameActive(true);
    };

    useEffect(() => {
        if (!gameActive) return;

        const loop = setInterval(() => {
            setBugs(prevBugs => prevBugs.map(bug => {
                const nextX = bug.x + bug.vx;
                const nextY = bug.y + bug.vy;
                let nextVx = bug.vx;
                let nextVy = bug.vy;

                const w = containerRef.current?.offsetWidth || 500;
                const h = containerRef.current?.offsetHeight || 300;

                if (nextX <= 0 || nextX >= w - 30) nextVx = -nextVx;
                if (nextY <= 0 || nextY >= h - 30) nextVy = -nextVy;

                if (Math.random() < 0.02) {
                    nextVx = (Math.random() - 0.5) * 4;
                    nextVy = (Math.random() - 0.5) * 4;
                }

                return {
                    ...bug,
                    x: nextX,
                    y: nextY,
                    vx: nextVx,
                    vy: nextVy
                };
            }));
        }, 16); // ~60fps

        return () => clearInterval(loop);
    }, [gameActive]);

    const squashBug = (id: number) => {
        setBugs(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 100);

        if (bugs.length <= 1) {
            // All caught (state update is async so length is effectively 0 after this?)
            // actually prev.length would check current state, bugs.length is slightly stale or synchronous enough?
            // Let's just win if < 1
            setTimeout(() => setGameActive(false), 500);
        }
    };

    return (
        <div ref={containerRef} className="h-full bg-gray-900 border-2 border-gray-700 relative overflow-hidden select-none cursor-crosshair">
            <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-white flex gap-4 backdrop-blur-md">
                <span className="font-bold text-yellow-400">Score: {score}</span>
                <span className="text-white/70">Bugs: {bugs.length}</span>
            </div>

            {!gameActive && bugs.length === 0 && score === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                    <button
                        onClick={startGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        <Bug /> Start Bug Hunt
                    </button>
                </div>
            )}

            {!gameActive && bugs.length === 0 && score > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 gap-4">
                    <h2 className="text-4xl font-bold text-green-400">CLEAN CODE!</h2>
                    <p className="text-white">Score: {score}</p>
                    <button
                        onClick={startGame}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Play Again
                    </button>
                </div>
            )}

            {bugs.map(bug => (
                <motion.div
                    key={bug.id}
                    className="absolute w-8 h-8 flex items-center justify-center cursor-pointer"
                    style={{
                        x: bug.x,
                        y: bug.y,
                    }}
                    // Use framer motion layout or absolute positioning
                    // We are updating state rapidly, so layout animation might be heavy.
                    // Using style is better.
                    onMouseDown={(e) => { e.stopPropagation(); squashBug(bug.id); }}
                >
                    <Bug color={bug.color} size={24} className="drop-shadow-lg" />
                </motion.div>
            ))}
        </div>
    );
};
