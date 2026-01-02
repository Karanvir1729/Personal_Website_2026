import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessGame } from './useChessGame';
import { Crown, RotateCcw, FlipVertical, Undo2, Search, Loader2, Zap } from 'lucide-react';
import type { Square } from 'chess.js';

export const Chess: React.FC = () => {
    const {
        gameState,
        playerColor,
        isEngineReady,
        isThinking,
        analysis,
        difficulty,
        setDifficulty,
        makeMove,
        resetGame,
        flipBoard,
        analyzePosition,
        undoMove
    } = useChessGame();

    // Workaround for type mismatch in react-chessboard
    const ChessBoardAny = Chessboard as any;

    // Expose game control for programmatic testing (avoiding UI flakiness)
    React.useEffect(() => {
        // @ts-ignore - Adding to window for testing
        window.chessDebug = {
            makeMove,
            resetGame,
            analyzePosition,
            getGameState: () => gameState,
            getAnalysis: () => analysis,
            setDifficulty
        };
        return () => {
            // @ts-ignore
            delete window.chessDebug;
        };
    }, [gameState, analysis, makeMove, resetGame, analyzePosition, setDifficulty]);

    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

    const onSquareClick = (square: Square) => {
        console.log(`onSquareClick: ${square}`, { isThinking, turn: gameState.turn, playerColor });
        if (isThinking || gameState.turn !== playerColor) return;

        if (selectedSquare) {
            const success = makeMove(selectedSquare, square);
            setSelectedSquare(null);
            if (!success && square !== selectedSquare) {
                setSelectedSquare(square);
            }
        } else {
            setSelectedSquare(square);
        }
    };

    const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
        console.log(`onDrop: ${sourceSquare} -> ${targetSquare}`, { isThinking, turn: gameState.turn, playerColor });
        if (isThinking || gameState.turn !== playerColor) return false;
        const success = makeMove(sourceSquare, targetSquare);
        setSelectedSquare(null);
        return success;
    };

    const getStatusMessage = () => {
        if (!isEngineReady) return "Loading Stockfish...";
        if (gameState.gameOver) {
            if (gameState.winner === 'draw') return "🤝 Game Over - Draw!";
            const playerWon = (gameState.winner === 'white' && playerColor === 'w') ||
                (gameState.winner === 'black' && playerColor === 'b');
            return playerWon ? "🎉 Congratulations! You Win!" : "💪 Stockfish Wins! Try Again!";
        }
        if (isThinking) return "🤔 Stockfish is thinking...";
        return gameState.turn === playerColor ? "Your turn" : "Stockfish's turn";
    };

    const isPlayerTurn = gameState.turn === playerColor && !isThinking && !gameState.gameOver;

    const getDifficultyLabel = () => {
        const labels = ['', 'Easy', 'Medium', 'Hard', 'Expert', 'Master'];
        return labels[difficulty] || 'Medium';
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Header */}
            <div className="flex-none p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 bg-slate-900/50 backdrop-blur">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Crown className="text-yellow-400" size={20} />
                        Chess vs Stockfish
                    </h1>
                    <p className="text-white/50 text-xs mt-0.5">
                        {isEngineReady ? `Difficulty: ${getDifficultyLabel()}` : 'Initializing...'}
                    </p>
                </div>

                {/* Controls & Difficulty */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5">
                        <Zap size={14} className="text-yellow-400" />
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            className="w-20 accent-yellow-400 cursor-pointer"
                        />
                        <span className="text-white/70 text-xs w-6">Lv.{difficulty}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Board Area */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden relative items-center justify-center bg-slate-950/30">
                    {/* Status Bar Floating or above board */}
                    <div className={`mb-2 px-4 py-1.5 rounded-full text-center font-medium text-sm backdrop-blur-md border border-white/5 ${!isEngineReady ? 'bg-slate-700/50 text-white/70' :
                        gameState.gameOver ? 'bg-yellow-500/20 text-yellow-400' :
                            isThinking ? 'bg-cyan-500/20 text-cyan-400' :
                                isPlayerTurn ? 'bg-green-500/20 text-green-400' :
                                    'bg-slate-700/50 text-white/70'
                        }`}>
                        {isThinking && <Loader2 size={12} className="inline mr-2 animate-spin" />}
                        {getStatusMessage()}
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center min-h-0">
                        <div className="aspect-square h-full max-h-full max-w-full shadow-2xl rounded-sm overflow-hidden border-8 border-slate-800">
                            <div className={`w-full h-full ${isThinking ? 'opacity-90' : ''}`}>
                                <ChessBoardAny
                                    position={gameState.fen}
                                    onPieceDrop={(source: Square, target: Square) => {
                                        console.log('Drop callback triggered:', source, target);
                                        return onDrop(source, target);
                                    }}
                                    onSquareClick={(square: Square) => {
                                        console.log('Click callback triggered:', square);
                                        onSquareClick(square);
                                    }}
                                    boardOrientation={playerColor === 'b' ? 'black' : 'white'}
                                    arePiecesDraggable={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full lg:w-80 flex-none bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-white/10 p-4 space-y-4 overflow-y-auto">
                    {/* Game Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={resetGame}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <RotateCcw size={14} />
                            New Game
                        </button>
                        <button
                            onClick={undoMove}
                            disabled={gameState.moveHistory.length < 2}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Undo2 size={14} />
                            Undo
                        </button>
                        <button
                            onClick={flipBoard}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <FlipVertical size={14} />
                            Flip
                        </button>
                        <button
                            onClick={analyzePosition}
                            disabled={!isEngineReady}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Search size={14} />
                            Analyze
                        </button>
                    </div>

                    {/* Analysis Panel */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                        <h3 className="text-white/90 font-medium mb-3 flex items-center gap-2 text-sm">
                            <Search size={14} className="text-cyan-400" />
                            Engine Analysis
                        </h3>
                        {analysis ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-white/70">
                                    <span>Eval:</span>
                                    <span className={`font-mono font-bold ${analysis.score > 0 ? 'text-green-400' :
                                        analysis.score < 0 ? 'text-red-400' : 'text-white'
                                        }`}>
                                        {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Depth:</span>
                                    <span className="font-mono">{analysis.depth}</span>
                                </div>
                                {analysis.bestMove && (
                                    <div className="flex justify-between text-white/70">
                                        <span>Best:</span>
                                        <span className="font-mono text-yellow-400">{analysis.bestMove}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-white/40 text-xs text-center py-2">Click "Analyze" to see evaluation</p>
                        )}
                    </div>

                    {/* Move History */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10 flex-1 min-h-[150px]">
                        <h3 className="text-white/90 font-medium mb-3 text-sm">Move History</h3>
                        <div className="h-[200px] lg:h-auto overflow-y-auto pr-1 custom-scrollbar">
                            {gameState.moveHistory.length > 0 ? (
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono">
                                    {gameState.moveHistory.map((move, i) => (
                                        <div key={i} className={`px-2 py-0.5 rounded ${i % 2 === 0 ? 'text-white bg-white/5' : 'text-white/60'}`}>
                                            <span className="text-white/30 mr-2 w-4 inline-block text-right">{Math.floor(i / 2) + 1}.</span>
                                            {move}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/40 text-xs text-center py-8">Game started</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
