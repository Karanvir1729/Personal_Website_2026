import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Package, Layers } from 'lucide-react';

// Simple "Fit items into slots" or "Match items" logic.
// Let's do a "Swap to match 3" but themed as "Optimizing Pallets".
// Grid 5x5.

const ITEMS = [
    { id: 1, color: 'bg-red-500', icon: Box },
    { id: 2, color: 'bg-blue-500', icon: Package },
    { id: 3, color: 'bg-yellow-500', icon: Layers },
    // { id: 4, color: 'bg-purple-500', icon: Grid },
];

const GRID_SIZE = 6;

export const InventoryPuzzle: React.FC = () => {
    const [grid, setGrid] = useState<number[]>(generateGrid());
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);

    function generateGrid() {
        return Array.from({ length: GRID_SIZE * GRID_SIZE }, () => Math.floor(Math.random() * ITEMS.length));
    }

    const checkMatches = (currentGrid: number[]) => {
        // Simple match 3 horiz/vert
        // Simplified: just give points for every click for now? No, need logic.
        // Let's implement valid horizontal match check.
        const matches = new Set<number>();

        // Horizontal
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                const i = r * GRID_SIZE + c;
                if (currentGrid[i] === currentGrid[i + 1] && currentGrid[i] === currentGrid[i + 2]) {
                    matches.add(i); matches.add(i + 1); matches.add(i + 2);
                }
            }
        }

        // Vertical
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                const i = r * GRID_SIZE + c;
                const i2 = (r + 1) * GRID_SIZE + c;
                const i3 = (r + 2) * GRID_SIZE + c;
                if (currentGrid[i] === currentGrid[i2] && currentGrid[i] === currentGrid[i3]) {
                    matches.add(i); matches.add(i2); matches.add(i3);
                }
            }
        }

        return matches;
    };

    const handleCellClick = (index: number) => {
        if (selected === null) {
            setSelected(index);
        } else {
            // Swap
            if (selected === index) {
                setSelected(null);
                return;
            }

            // Check adjacency
            const r1 = Math.floor(selected / GRID_SIZE);
            const c1 = selected % GRID_SIZE;
            const r2 = Math.floor(index / GRID_SIZE);
            const c2 = index % GRID_SIZE;

            if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
                // Swap
                const newGrid = [...grid];
                [newGrid[selected], newGrid[index]] = [newGrid[index], newGrid[selected]];

                // Check matches
                const matches = checkMatches(newGrid);
                if (matches.size > 0) {
                    setGrid(newGrid); // Commit swap
                    // Remove matches and fill
                    // Simplified: just randomize matched?
                    matches.forEach(m => {
                        newGrid[m] = Math.floor(Math.random() * ITEMS.length); // eslint-disable-line react-hooks/immutability
                    });
                    setGrid([...newGrid]);
                    setScore(s => s + matches.size * 10);
                    setSelected(null);
                } else {
                    // Invalid swap, revert (handled by not setting state, but visual feedback would be nice)
                    // For now just deselect
                    setSelected(null);
                }
            } else {
                setSelected(index);
            }
        }
    };

    return (
        <div className="h-full bg-slate-800 text-white p-4 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="text-yellow-400" />
                Inventory Optimizer
            </h1>
            <div className="mb-4 text-sm opacity-70">Move pallets to organize inventory (Match 3)</div>
            <div className="mb-4 text-2xl font-mono text-green-400">Efficiency: {score}%</div>

            <div className="grid grid-cols-6 gap-1 bg-slate-700 p-2 rounded-lg ml-auto mr-auto">
                {grid.map((val, i) => {
                    const item = ITEMS[val];
                    const isSelected = selected === i;
                    return (
                        <motion.button
                            key={i}
                            layout
                            onClick={() => handleCellClick(i)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded transition-colors ${item.color} ${isSelected ? 'ring-4 ring-white z-10' : 'opacity-90'}`}
                        >
                            <item.icon className="text-white/80" size={20} />
                        </motion.button>
                    )
                })}
            </div>
        </div>
    );
};
