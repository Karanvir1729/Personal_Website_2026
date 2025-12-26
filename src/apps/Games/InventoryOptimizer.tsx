import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Box, Grid as GridIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for classes
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Types
type Block = { id: string; shape: number[][]; color: string };
type Cell = { filled: boolean; color?: string };

// Game Constants
const GRID_SIZE = 8;
const SHAPES = [
    { shape: [[1]], color: 'bg-blue-500' }, // 1x1
    { shape: [[1, 1]], color: 'bg-green-500' }, // 2x1
    { shape: [[1], [1]], color: 'bg-green-500' }, // 1x2 vertical
    { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' }, // 2x2
    { shape: [[1, 1, 1]], color: 'bg-purple-500' }, // 3x1
    { shape: [[1], [1], [1]], color: 'bg-purple-500' }, // 1x3 vertical
    { shape: [[1, 0], [1, 1]], color: 'bg-red-500' }, // L shape
    { shape: [[0, 1], [1, 1]], color: 'bg-red-500' }, // Mirrored L
];

export const InventoryOptimizer = () => {
    const [grid, setGrid] = useState<Cell[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ filled: false })));
    const [score, setScore] = useState(0);
    const [queue, setQueue] = useState<Block[]>([]);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);
    const [gameOver, setGameOver] = useState(false);

    // Initial load
    useEffect(() => {
        refillQueue();
    }, []);

    const refillQueue = () => {
        setQueue(prev => {
            if (prev.length > 0) return prev;
            return Array(3).fill(null).map(() => {
                const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
                return {
                    id: Math.random().toString(36),
                    shape: template.shape,
                    color: template.color
                };
            });
        });
    };

    const checkPlacement = (r: number, c: number, shape: number[][]): boolean => {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const nr = r + i;
                    const nc = c + j;
                    if (nr >= GRID_SIZE || nc >= GRID_SIZE || grid[nr][nc].filled) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const placeBlock = (r: number, c: number) => {
        if (selectedBlockIndex === null) return;

        const block = queue[selectedBlockIndex];
        if (!checkPlacement(r, c, block.shape)) return;

        // Place it
        const newGrid = [...grid.map(row => [...row])];
        let points = 0;

        for (let i = 0; i < block.shape.length; i++) {
            for (let j = 0; j < block.shape[i].length; j++) {
                if (block.shape[i][j]) {
                    newGrid[r + i][c + j] = { filled: true, color: block.color };
                    points++;
                }
            }
        }

        // Remove from queue
        const newQueue = queue.filter((_, i) => i !== selectedBlockIndex);
        setQueue(newQueue);
        if (newQueue.length === 0) {
            // Refill triggers in effect or we call it directly. Effect easier but async.
            // Let's call a helper or setTimeout.
            setTimeout(() => {
                const nextQueue = Array(3).fill(null).map(() => {
                    const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
                    return {
                        id: Math.random().toString(36),
                        shape: template.shape,
                        color: template.color
                    };
                });
                setQueue(nextQueue);
                checkGameOver(newGrid, nextQueue);
            }, 500);
        } else {
            checkGameOver(newGrid, newQueue);
        }

        setGrid(newGrid);
        setSelectedBlockIndex(null);
        setScore(s => s + points * 10);
    };

    const checkGameOver = (currentGrid: Cell[][], currentQueue: Block[]) => {
        // Naive check: does ANY block in queue fit ANYWHERE?
        // This can be expensive, but grid is 8x8 and queue is max 3. 64 * 3 checks is trivial.
        const canMove = currentQueue.some(block => {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (checkPlacement(r, c, block.shape)) return true; // Found a spot using captured checkPlacement logic? 
                    // Wait, checkPlacement uses 'grid' state which might be stale if we passed newGrid.
                    // Need to implement standalone check.

                    // Standalone logic:
                    let fits = true;
                    loopShape:
                    for (let i = 0; i < block.shape.length; i++) {
                        for (let j = 0; j < block.shape[i].length; j++) {
                            if (block.shape[i][j]) {
                                const nr = r + i;
                                const nc = c + j;
                                if (nr >= GRID_SIZE || nc >= GRID_SIZE || currentGrid[nr][nc].filled) {
                                    fits = false;
                                    break loopShape;
                                }
                            }
                        }
                    }
                    if (fits) return true;
                }
            }
            return false;
        });

        if (!canMove) {
            setGameOver(true);
        }
    };

    const restartGame = () => {
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ filled: false })));
        setScore(0);
        setGameOver(false);
        setQueue([]);
        setTimeout(refillQueue, 100);
    };

    return (
        <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col items-center p-4 select-none relative overflow-hidden">
            {/* HUD */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <Box className="w-6 h-6 text-blue-400" />
                    <div>
                        <h1 className="font-bold text-lg leading-none">INVENTORY</h1>
                        <span className="text-xs text-slate-400">OPTIMIZER</span>
                    </div>
                </div>
                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-slate-400 text-xs uppercase mr-2">Score</span>
                    <span className="font-mono text-xl font-bold text-blue-400">{score}</span>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex gap-8 items-start">
                {/* Grid */}
                <div
                    className="grid gap-1 bg-slate-950 p-2 rounded-lg border border-slate-700 shadow-xl"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                    onMouseLeave={() => setHoveredCell(null)}
                >
                    {grid.map((row, r) => (
                        row.map((cell, c) => {
                            // Determine visual state
                            let isPreview = false;
                            let isValidPreview = false;

                            if (selectedBlockIndex !== null && hoveredCell) {
                                const block = queue[selectedBlockIndex];
                                const inShape =
                                    r >= hoveredCell.r &&
                                    r < hoveredCell.r + block.shape.length &&
                                    c >= hoveredCell.c &&
                                    c < hoveredCell.c + block.shape[r - hoveredCell.r]?.length &&
                                    block.shape[r - hoveredCell.r][c - hoveredCell.c] === 1;

                                if (inShape) {
                                    isPreview = true;
                                    isValidPreview = checkPlacement(hoveredCell.r, hoveredCell.c, block.shape);
                                }
                            }

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={cn(
                                        "w-10 h-10 rounded-sm transition-all duration-200",
                                        cell.filled ? cell.color : "bg-slate-800/50",
                                        isPreview && isValidPreview && "opacity-50 " + queue[selectedBlockIndex!].color,
                                        isPreview && !isValidPreview && "bg-red-500/50"
                                    )}
                                    onMouseEnter={() => setHoveredCell({ r, c })}
                                    onClick={() => placeBlock(r, c)}
                                />
                            );
                        })
                    ))}
                </div>

                {/* Queue */}
                <div className="flex flex-col gap-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Incoming</span>
                    {queue.map((block, idx) => (
                        <motion.button
                            key={block.id}
                            layout
                            onClick={() => setSelectedBlockIndex(idx === selectedBlockIndex ? null : idx)}
                            className={cn(
                                "p-4 rounded-xl border transition-all relative group",
                                selectedBlockIndex === idx
                                    ? "bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
                                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                            )}
                        >
                            <div
                                className="grid gap-1"
                                style={{ gridTemplateColumns: `repeat(${block.shape[0].length}, 10px)` }}
                            >
                                {block.shape.map((row, i) => (
                                    row.map((filled, j) => (
                                        <div
                                            key={`${i}-${j}`}
                                            className={cn(
                                                "w-2.5 h-2.5 rounded-[2px]",
                                                filled ? block.color : "bg-transparent"
                                            )}
                                        />
                                    ))
                                ))}
                            </div>
                        </motion.button>
                    ))}
                    {queue.length === 0 && (
                        <div className="w-24 h-24 flex items-center justify-center text-slate-600 italic">
                            Refilling...
                        </div>
                    )}
                </div>
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center max-w-sm w-full mx-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <GridIcon className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Out of Space!</h2>
                        <p className="text-slate-400 mb-6">Your inventory is overflowing.</p>

                        <div className="bg-slate-950 rounded-lg p-4 mb-6 border border-slate-800">
                            <div className="text-slate-500 text-xs uppercase mb-1">Final Efficiency</div>
                            <div className="text-4xl font-bold text-blue-400">{score}</div>
                        </div>

                        <button
                            onClick={restartGame}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Analyze Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
