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
    id: string; // url
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

interface UseChessStatsReturn {
    stats: PlayerStats | null;
    profile: PlayerProfile | null;
    loading: boolean;
    error: string | null;
}

export function useChessStats(username: string): UseChessStatsReturn {
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [statsRes, profileRes] = await Promise.all([
                    fetch(`https://api.chess.com/pub/player/${username}/stats`),
                    fetch(`https://api.chess.com/pub/player/${username}`)
                ]);

                if (!statsRes.ok || !profileRes.ok) {
                    throw new Error('Failed to fetch data from Chess.com');
                }

                const statsData = await statsRes.json();
                const profileData = await profileRes.json();

                setStats(statsData);
                setProfile(profileData);
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

    return { stats, profile, loading, error };
}
