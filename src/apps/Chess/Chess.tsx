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
        <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Crown className="text-yellow-400" size={24} />
                            Chess vs Stockfish
                        </h1>
                        <p className="text-white/50 text-sm mt-1">
                            {isEngineReady ? `Difficulty: ${getDifficultyLabel()}` : 'Initializing...'}
                        </p>
                    </div>

                    {/* Difficulty Slider */}
                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg">
                        <Zap size={16} className="text-yellow-400" />
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            className="w-24 accent-yellow-400"
                        />
                        <span className="text-white/70 text-sm w-8">Lv.{difficulty}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Chessboard */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                            {/* Status Bar */}
                            <div className={`mb-3 px-4 py-2 rounded-lg text-center font-medium text-sm ${!isEngineReady ? 'bg-slate-700/50 text-white/70' :
                                gameState.gameOver ? 'bg-yellow-500/20 text-yellow-400' :
                                    isThinking ? 'bg-cyan-500/20 text-cyan-400' :
                                        isPlayerTurn ? 'bg-green-500/20 text-green-400' :
                                            'bg-slate-700/50 text-white/70'
                                }`}>
                                {isThinking && <Loader2 size={14} className="inline mr-2 animate-spin" />}
                                {getStatusMessage()}
                            </div>

                            {/* Board */}
                            <div className={`relative ${isThinking ? 'pointer-events-none opacity-90' : ''}`}>
                                <Chessboard
                                    position={gameState.fen}
                                    onPieceDrop={onDrop}
                                    onSquareClick={onSquareClick}
                                    boardOrientation={playerColor === 'b' ? 'black' : 'white'}
                                    arePiecesDraggable={isPlayerTurn}
                                    customBoardStyle={{
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                                    }}
                                    customDarkSquareStyle={{ backgroundColor: '#4a5568' }}
                                    customLightSquareStyle={{ backgroundColor: '#718096' }}
                                    customSquareStyles={{
                                        ...(selectedSquare ? { [selectedSquare]: { backgroundColor: 'rgba(34, 211, 238, 0.4)' } } : {}),
                                        ...(gameState.lastMove ? {
                                            [gameState.lastMove.from]: { backgroundColor: 'rgba(250, 204, 21, 0.3)' },
                                            [gameState.lastMove.to]: { backgroundColor: 'rgba(250, 204, 21, 0.3)' }
                                        } : {})
                                    }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="mt-3 flex justify-center gap-2 flex-wrap">
                                <button
                                    onClick={resetGame}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                                >
                                    <RotateCcw size={14} />
                                    New Game
                                </button>
                                <button
                                    onClick={undoMove}
                                    disabled={gameState.moveHistory.length < 2}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                                >
                                    <Undo2 size={14} />
                                    Undo
                                </button>
                                <button
                                    onClick={flipBoard}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                                >
                                    <FlipVertical size={14} />
                                    Flip
                                </button>
                                <button
                                    onClick={analyzePosition}
                                    disabled={!isEngineReady}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
                                >
                                    <Search size={14} />
                                    Analyze
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Analysis Panel */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Search size={16} className="text-cyan-400" />
                                Analysis
                            </h3>
                            {analysis ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-white/70">
                                        <span>Evaluation:</span>
                                        <span className={`font-mono ${analysis.score > 0 ? 'text-green-400' :
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
                                            <span>Best Move:</span>
                                            <span className="font-mono text-yellow-400">{analysis.bestMove}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white/40 text-sm">Click "Analyze" to evaluate position</p>
                            )}
                        </div>

                        {/* Move History */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                            <h3 className="text-white font-medium mb-3">Move History</h3>
                            <div className="max-h-48 overflow-y-auto">
                                {gameState.moveHistory.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm font-mono">
                                        {gameState.moveHistory.map((move, i) => (
                                            <span key={i} className={`${i % 2 === 0 ? 'text-white' : 'text-white/60'}`}>
                                                {i % 2 === 0 && <span className="text-white/40 mr-1">{Math.floor(i / 2) + 1}.</span>}
                                                {move}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-sm">No moves yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
