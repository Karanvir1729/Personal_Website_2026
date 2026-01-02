import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Trophy, Keyboard } from 'lucide-react';

const WORDS = [
    'react', 'typescript', 'component', 'hook', 'state', 'effect',
    'context', 'reducer', 'memo', 'callback', 'ref', 'router',
    'interface', 'type', 'generics', 'promise', 'async', 'await',
    'import', 'export', 'default', 'const', 'let', 'var',
    'function', 'class', 'extends', 'implements', 'public', 'private',
    'node', 'npm', 'yarn', 'pnpm', 'build', 'deploy',
    'matrix', 'cyber', 'hack', 'code', 'debug', 'compile',
    'terminal', 'shell', 'bash', 'zsh', 'git', 'commit',
    'push', 'pull', 'merge', 'branch', 'checkout', 'clone'
];

interface FallingWord {
    id: string;
    text: string;
    x: number;
    y: number;
    speed: number;
}

export const TypingRush = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [words, setWords] = useState<FallingWord[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [difficulty, setDifficulty] = useState(1);

    // Ref for accessing the dimensions of the game area.
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const requestRef = useRef<number>(0);
    const lastSpawnTime = useRef<number>(0);

    const spawnWord = useCallback(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth - 100; // Keep away from edges
        const text = WORDS[Math.floor(Math.random() * WORDS.length)];

        const newWord: FallingWord = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            x: Math.random() * width + 20,
            y: -30,
            speed: (Math.random() * 0.5 + 0.5) * difficulty
        };

        setWords(prev => [...prev, newWord]);
    }, [difficulty]);

    const gameLoop = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        // Spawn logic
        if (time - lastSpawnTime.current > 2000 / difficulty) {
            spawnWord();
            lastSpawnTime.current = time;
        }

        setWords(prev => {
            const nextWords: FallingWord[] = [];
            let livesLost = 0;

            prev.forEach(word => {
                const nextY = word.y + word.speed;
                // Check if hit bottom
                if (nextY > (containerRef.current?.clientHeight || 600) - 40) {
                    livesLost++;
                } else {
                    nextWords.push({ ...word, y: nextY });
                }
            });

            if (livesLost > 0) {
                setLives(l => {
                    const newLives = l - livesLost;
                    if (newLives <= 0) {
                        setGameState('gameover');
                    }
                    return newLives;
                });
            }

            return nextWords;
        });

        requestRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, difficulty, spawnWord]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(gameLoop);
            // Focus input
            inputRef.current?.focus();
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, gameLoop]);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setWords([]);
        setDifficulty(1);
        setGameState('playing');
        lastSpawnTime.current = performance.now();
        setInputValue('');
        // Focus will happen in useEffect
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        // Check for match
        const matchIndex = words.findIndex(w => w.text === val.trim());
        if (matchIndex !== -1) {
            // Matched!
            setWords(prev => prev.filter((_, i) => i !== matchIndex));
            setScore(s => s + 10 * difficulty);
            setInputValue('');

            // Increase difficulty every 100 points
            if ((score + 10) % 100 === 0) {
                setDifficulty(d => Math.min(d + 0.2, 5));
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black text-green-500 font-mono relative overflow-hidden select-none"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-20" />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 border-b border-green-900 bg-black/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5" />
                    <span className="font-bold">TYPING RUSH_</span>
                </div>
                <div className="flex items-center gap-6">
                    <div>SCORE: <span className="text-white">{score.toString().padStart(6, '0')}</span></div>
                    <div>LIVES: <span className="text-red-500">{'♥'.repeat(Math.max(0, lives))}</span></div>
                    <div>LEVEL: <span className="text-yellow-500">{Math.floor(difficulty)}</span></div>
                </div>
            </div>

            {/* Hidden Input for Gameplay */}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInput}
                className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
                autoFocus
                disabled={gameState !== 'playing'}
            />

            {/* Game Area */}
            <div className="relative w-full h-full pt-16 pb-12">
                {/* Words */}
                <AnimatePresence>
                    {words.map(word => (
                        <motion.div
                            key={word.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.5, color: '#fff' }}
                            className="absolute text-lg font-bold shadow-black drop-shadow-md"
                            style={{
                                left: word.x,
                                top: word.y,
                                textShadow: '0 0 5px rgba(34, 197, 94, 0.5)'
                            }}
                        >
                            {word.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Current Input Visual feedback */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-green-900/30 border border-green-500/50 px-6 py-2 rounded text-white text-xl min-w-[200px] text-center">
                            {inputValue}<span className="animate-pulse">_</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Overlays */}
            {gameState === 'menu' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
                    <div className="text-center space-y-6 max-w-md p-8 border border-green-500/50 rounded-lg bg-black box-border shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                            <Keyboard className="w-10 h-10" />
                            TYPING RUSH
                        </h1>
                        <p className="text-green-300">
                            Defend the system! Type falling words before they breach the firewall.
                        </p>
                        <button
                            onClick={startGame}
                            className="group relative px-8 py-3 bg-green-900/20 text-green-400 font-bold text-lg rounded border border-green-500/50 hover:bg-green-500 hover:text-black transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Play size={20} /> INITIALIZE
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-50 backdrop-blur-sm">
                    <div className="text-center space-y-6 max-w-md p-8 border border-red-500/50 rounded-lg bg-black shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                        <div className="text-red-500 mb-2 flex flex-col items-center">
                            <Trophy className="w-16 h-16 mb-2" />
                            <h2 className="text-3xl font-bold">SYSTEM BREACHED</h2>
                        </div>

                        <div className="py-4 border-y border-gray-800">
                            <p className="text-gray-400">FINAL SCORE</p>
                            <p className="text-4xl font-bold text-white mt-1">{score}</p>
                        </div>

                        <button
                            onClick={startGame}
                            className="w-full px-8 py-3 bg-white/5 text-white font-bold text-lg rounded border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} /> REBOOT SYSTEM
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
