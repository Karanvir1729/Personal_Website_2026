import { Trophy, Calendar, TrendingUp, ExternalLink, User, Gamepad2, Activity } from 'lucide-react';
import { useChessStats } from '../../hooks/useChessStats';
import { formatDistanceToNow } from 'date-fns';

export const ChessStatsWidget = () => {
    const { profile, gameHistory, loading, error } = useChessStats('kvsk');

    if (loading) {
        return (
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full h-full animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full" />
                    <div className="space-y-2">
                        <div className="w-24 h-4 bg-white/10 rounded" />
                        <div className="w-16 h-3 bg-white/10 rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="w-full h-8 bg-white/10 rounded" />
                    <div className="w-full h-8 bg-white/10 rounded" />
                </div>
            </div>
        );
    }

    if (error || !profile) return null;

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return 'N/A';
        return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
    };

    const renderWinLoss = (label: string, stats: { wins: number; losses: number; draws: number; winRate: number } | undefined) => {
        if (!stats) return null;
        return (
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs">
                <span className="text-white/70">{label}</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-green-400">{stats.wins}W</span>
                    <span className="text-red-400">{stats.losses}L</span>
                    <span className="text-gray-400">{stats.draws}D</span>
                    <span className="text-white font-mono ml-1">({stats.winRate}%)</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 w-full h-full shadow-2xl transition-all hover:bg-black/50 group flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={profile.username}
                            className="w-10 h-10 rounded-full border-2 border-white/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                            <User className="w-5 h-5 text-white/50" />
                        </div>
                    )}
                    {gameHistory?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" title="Currently Online" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium text-sm leading-tight truncate">
                            Chess.com
                        </h3>
                        {gameHistory?.isOnline && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <Activity className="w-2.5 h-2.5" /> Live
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                        <span>{profile.username}</span>
                        <span>•</span>
                        <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-0.5 hover:text-blue-400 transition-colors"
                        >
                            Profile <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
                <div className="p-1.5 rounded-lg bg-white/5 text-center">
                    <Gamepad2 className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
                    <p className="text-white font-mono text-sm">{gameHistory?.lifetimeGames?.toLocaleString() || 0}</p>
                    <p className="text-white/50 text-[9px]">Lifetime</p>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 text-center">
                    <Trophy className="w-3 h-3 text-yellow-400 mx-auto mb-0.5" />
                    <p className="text-white font-mono text-sm">{gameHistory?.totalGames || 0}</p>
                    <p className="text-white/50 text-[9px]">Last 90d</p>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 text-center">
                    <Calendar className="w-3 h-3 text-purple-400 mx-auto mb-0.5" />
                    <p className="text-white text-[10px] leading-tight">{formatDate(gameHistory?.lastGameDate || null)}</p>
                    <p className="text-white/50 text-[9px]">Last Game</p>
                </div>
            </div>

            {/* Win/Loss Ratios */}
            <div className="space-y-1 flex-1">
                <div className="flex items-center gap-1.5 text-white/70 text-[10px] mb-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>Win/Loss Ratio</span>
                </div>
                {renderWinLoss('7 Days', gameHistory?.last7Days)}
                {renderWinLoss('30 Days', gameHistory?.last30Days)}
                {renderWinLoss('90 Days', gameHistory?.last90Days)}
            </div>
        </div>
    );
};
