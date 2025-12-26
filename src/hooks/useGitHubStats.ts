import { useState, useEffect } from 'react';

export interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
    bio: string;
    name: string;
}

interface UseGitHubStatsReturn {
    user: GitHubUser | null;
    loading: boolean;
    error: string | null;
}

export function useGitHubStats(username: string): UseGitHubStatsReturn {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch data from GitHub');
                }

                const data = await response.json();
                setUser(data);
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

    return { user, loading, error };
}
