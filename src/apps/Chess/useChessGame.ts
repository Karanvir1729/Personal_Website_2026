import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, type Square, type Move } from 'chess.js';

interface GameState {
    fen: string;
    turn: 'w' | 'b';
    status: 'playing' | 'checkmate' | 'stalemate' | 'draw';
    lastMove: { from: string; to: string } | null;
    gameOver: boolean;
    winner: 'white' | 'black' | 'draw' | null;
    moveHistory: string[];
    inCheck: boolean;
}

interface AnalysisResult {
    score: number;
    bestMove: string;
    depth: number;
}

// Piece values
const pieceValues: Record<string, number> = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
};

// Position tables for piece placement evaluation
const pawnTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, -5, -10, 0, 0, -10, -5, 5,
    5, 10, 10, -20, -20, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0
];

const knightTable = [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50
];

const bishopTable = [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -20, -10, -10, -10, -10, -10, -10, -20
];

// Evaluate board position
const evaluateBoard = (game: Chess): number => {
    if (game.isCheckmate()) {
        return game.turn() === 'w' ? -Infinity : Infinity;
    }
    if (game.isDraw() || game.isStalemate()) return 0;

    let score = 0;
    const board = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue;

            const pieceValue = pieceValues[piece.type] || 0;
            const isWhite = piece.color === 'w';
            const idx = isWhite ? row * 8 + col : (7 - row) * 8 + col;

            let positionBonus = 0;
            if (piece.type === 'p') positionBonus = pawnTable[idx];
            else if (piece.type === 'n') positionBonus = knightTable[idx];
            else if (piece.type === 'b') positionBonus = bishopTable[idx];

            const totalValue = pieceValue + positionBonus;
            score += isWhite ? totalValue : -totalValue;
        }
    }

    // Mobility bonus
    const mobility = game.moves().length;
    score += game.turn() === 'w' ? mobility * 2 : -mobility * 2;

    return score;
};

// Minimax with alpha-beta pruning
const minimax = (
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
): number => {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves({ verbose: true });

    // Move ordering: captures first
    moves.sort((a, b) => {
        const aCapture = a.captured ? 1 : 0;
        const bCapture = b.captured ? 1 : 0;
        return bCapture - aCapture;
    });

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

// Get best move
const getBestMove = (game: Chess, depth: number): { move: Move | null; score: number } => {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return { move: null, score: 0 };

    let bestMove = moves[0];
    const isMaximizing = game.turn() === 'w';
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
        game.move(move);
        const value = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
        game.undo();

        if (isMaximizing) {
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        } else {
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
    }

    return { move: bestMove, score: bestValue / 100 };
};

export const useChessGame = () => {
    const gameRef = useRef(new Chess());
    const [gameState, setGameState] = useState<GameState>(() => ({
        fen: gameRef.current.fen(),
        turn: 'w',
        status: 'playing',
        lastMove: null,
        gameOver: false,
        winner: null,
        moveHistory: [],
        inCheck: false
    }));
    const [isThinking, setIsThinking] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [difficulty, setDifficulty] = useState(3); // 1-5 depth
    const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');

    const updateGameState = useCallback(() => {
        const game = gameRef.current;
        const isCheckmate = game.isCheckmate();
        const isStalemate = game.isStalemate();
        const isDraw = game.isDraw();
        const history = game.history({ verbose: true });
        const lastMoveData = history[history.length - 1];

        setGameState({
            fen: game.fen(),
            turn: game.turn() as 'w' | 'b',
            lastMove: lastMoveData ? { from: lastMoveData.from, to: lastMoveData.to } : null,
            status: isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : isDraw ? 'draw' : 'playing',
            gameOver: isCheckmate || isStalemate || isDraw,
            winner: isCheckmate
                ? (game.turn() === 'w' ? 'black' : 'white')
                : (isDraw || isStalemate ? 'draw' : null),
            moveHistory: game.history(),
            inCheck: game.inCheck()
        });
    }, []);

    const makeBotMove = useCallback(() => {
        setIsThinking(true);

        // Use setTimeout to avoid blocking UI
        setTimeout(() => {
            const depth = Math.min(difficulty + 1, 4); // Max depth 4 for performance
            const { move, score } = getBestMove(gameRef.current, depth);

            if (move) {
                gameRef.current.move(move);
                setAnalysis({ score, bestMove: move.san, depth });
                updateGameState();
            }

            setIsThinking(false);
        }, 100);
    }, [difficulty, updateGameState]);

    // Trigger bot move when it's bot's turn
    useEffect(() => {
        if (gameState.gameOver || isThinking) return;

        const isBotTurn = gameState.turn !== playerColor;
        if (isBotTurn) {
            const timer = setTimeout(makeBotMove, 300);
            return () => clearTimeout(timer);
        }
    }, [gameState.turn, gameState.gameOver, playerColor, isThinking, makeBotMove]);

    const makeMove = useCallback((from: Square, to: Square): boolean => {
        if (gameState.turn !== playerColor || isThinking) return false;

        try {
            const move = gameRef.current.move({ from, to, promotion: 'q' });
            if (!move) return false;
            updateGameState();
            return true;
        } catch {
            return false;
        }
    }, [gameState.turn, playerColor, isThinking, updateGameState]);

    const resetGame = useCallback(() => {
        gameRef.current.reset();
        setAnalysis(null);
        updateGameState();
    }, [updateGameState]);

    const flipBoard = useCallback(() => {
        setPlayerColor(prev => prev === 'w' ? 'b' : 'w');
    }, []);

    const analyzePosition = useCallback(() => {
        try {
            // Clone the game for analysis to avoid state issues
            const analysisGame = new Chess(gameRef.current.fen());
            const depth = 4;
            const { score, move } = getBestMove(analysisGame, depth);
            const adjustedScore = gameRef.current.turn() === 'b' ? -score : score;
            setAnalysis({
                score: isFinite(adjustedScore) ? adjustedScore : 0,
                bestMove: move?.san || '',
                depth
            });
        } catch (e) {
            console.error('Analysis error:', e);
            setAnalysis({ score: 0, bestMove: '', depth: 0 });
        }
    }, []);

    const undoMove = useCallback(() => {
        // Undo both player and bot move
        if (gameRef.current.history().length >= 2) {
            gameRef.current.undo();
            gameRef.current.undo();
            setAnalysis(null);
            updateGameState();
        }
    }, [updateGameState]);

    return {
        gameState,
        playerColor,
        isEngineReady: true,
        isThinking,
        analysis,
        difficulty,
        setDifficulty,
        makeMove,
        resetGame,
        flipBoard,
        analyzePosition,
        undoMove,
        game: gameRef.current
    };
};
