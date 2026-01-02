import { useState, useEffect } from 'react';

export interface ChessStats {
    best: { rating: number; date: number; game: string };
    last: { rating: number; date: number; rd: number };
    record: { win: number; loss: number; draw: number };
}

export interface PlayerStats {
    chess_daily?: ChessStats;
    chess960_daily?: ChessStats;
    chess_rapid?: ChessStats;
    chess_bullet?: ChessStats;
    chess_blitz?: ChessStats;
    fide?: number;
    tactics?: { highest: { rating: number; date: number }; lowest: { rating: number; date: number } };
    puzzle_rush?: { best: { total_attempts: number; score: number } };
}

export interface PlayerProfile {
    avatar?: string;
    player_id: number;
    id: string;
    url: string;
    name?: string;
    username: string;
    followers: number;
    country: string;
    location?: string;
    last_online: number;
    joined: number;
    status: string;
    is_streamer: boolean;
    verified: boolean;
    league?: string;
}

export interface ChessGame {
    url: string;
    pgn: string;
    end_time: number;
    white: { username: string; result: string };
    black: { username: string; result: string };
    time_class: string;
}

export interface WinLossStats {
    wins: number;
    losses: number;
    draws: number;
    total: number;
    winRate: number;
}

export interface GameHistoryStats {
    totalGames: number;
    lifetimeGames: number;
    lastGameDate: number | null;
    last7Days: WinLossStats;
    last30Days: WinLossStats;
    last90Days: WinLossStats;
    isOnline: boolean;
}

interface UseChessStatsReturn {
    stats: PlayerStats | null;
    profile: PlayerProfile | null;
    gameHistory: GameHistoryStats | null;
    loading: boolean;
    error: string | null;
}

function calculateWinLoss(games: ChessGame[], username: string, daysAgo: number): WinLossStats {
    const now = Date.now() / 1000;
    const cutoff = now - (daysAgo * 24 * 60 * 60);

    const filteredGames = games.filter(g => g.end_time >= cutoff);
    let wins = 0, losses = 0, draws = 0;

    filteredGames.forEach(game => {
        const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
        const result = isWhite ? game.white.result : game.black.result;

        if (result === 'win') wins++;
        else if (result === 'resigned' || result === 'timeout' || result === 'checkmated' || result === 'abandoned') losses++;
        else if (result === 'agreed' || result === 'stalemate' || result === 'repetition' || result === 'insufficient' || result === '50move' || result === 'timevsinsufficient') draws++;
        else if (result === 'lose') losses++;
    });

    const total = wins + losses + draws;
    return {
        wins,
        losses,
        draws,
        total,
        winRate: total > 0 ? Math.round((wins / total) * 100) : 0
    };
}

export function useChessStats(username: string): UseChessStatsReturn {
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [gameHistory, setGameHistory] = useState<GameHistoryStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch basic stats and profile
                const [statsRes, profileRes, archivesRes] = await Promise.all([
                    fetch(`https://api.chess.com/pub/player/${username}/stats`),
                    fetch(`https://api.chess.com/pub/player/${username}`),
                    fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
                ]);

                if (!statsRes.ok || !profileRes.ok) {
                    throw new Error('Failed to fetch data from Chess.com');
                }

                const statsData = await statsRes.json();
                const profileData = await profileRes.json();

                setStats(statsData);
                setProfile(profileData);

                // Fetch recent game archives (last 3 months)
                if (archivesRes.ok) {
                    const archivesData = await archivesRes.json();
                    const archives: string[] = archivesData.archives || [];

                    // Get the last 3 months of archives
                    const recentArchives = archives.slice(-3);

                    const allGames: ChessGame[] = [];

                    for (const archiveUrl of recentArchives) {
                        try {
                            const gamesRes = await fetch(archiveUrl);
                            if (gamesRes.ok) {
                                const gamesData = await gamesRes.json();
                                allGames.push(...(gamesData.games || []));
                            }
                        } catch {
                            // Continue if one archive fails
                        }
                    }

                    // Calculate stats
                    const lastGame = allGames.length > 0
                        ? Math.max(...allGames.map(g => g.end_time))
                        : null;

                    // Calculate lifetime games from all modes
                    const modes = ['chess_daily', 'chess_rapid', 'chess_bullet', 'chess_blitz'] as const;
                    let lifetimeTotal = 0;
                    modes.forEach(mode => {
                        const modeStats = statsData[mode as keyof typeof statsData] as ChessStats | undefined;
                        if (modeStats?.record) {
                            lifetimeTotal += (modeStats.record.win || 0) + (modeStats.record.loss || 0) + (modeStats.record.draw || 0);
                        }
                    });

                    // Check if online (within last 5 minutes)
                    const isOnline = profileData.last_online
                        ? (Date.now() / 1000 - profileData.last_online) < 300
                        : false;

                    setGameHistory({
                        totalGames: allGames.length,
                        lifetimeGames: lifetimeTotal,
                        lastGameDate: lastGame,
                        last7Days: calculateWinLoss(allGames, username, 7),
                        last30Days: calculateWinLoss(allGames, username, 30),
                        last90Days: calculateWinLoss(allGames, username, 90),
                        isOnline
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    return { stats, profile, gameHistory, loading, error };
}
