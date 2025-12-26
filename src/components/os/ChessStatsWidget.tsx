import { useChessStats } from '../../hooks/useChessStats';
import { Trophy, Zap, Target, Timer, ExternalLink, User } from 'lucide-react';

export const ChessStatsWidget = () => {
    const { stats, profile, loading, error } = useChessStats('kvsk');

    if (loading) {
        return (
            <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 animate-pulse">
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
                    <div className="w-full h-8 bg-white/10 rounded" />
                </div>
            </div>
        );
    }

    if (error || !profile) return null;

    return (
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 shadow-2xl transition-all hover:bg-black/50 group">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={profile.username}
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                            <User className="w-6 h-6 text-white/50" />
                        </div>
                    )}
                    {(profile.status === 'premium' || profile.is_streamer) && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-black">
                            <Trophy className="w-3 h-3 text-black fill-black" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-lg leading-tight truncate">
                        {profile.username}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{profile.country?.split('/').pop() || 'International'}</span>
                        <span>•</span>
                        <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                        >
                            Profile <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white/70">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Bullet</span>
                    </div>
                    <span className="text-white font-mono font-medium">
                        {stats?.chess_bullet?.last?.rating || '-'}
                    </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white/70">
                        <Timer className="w-4 h-4 text-orange-400" />
                        <span className="text-sm">Blitz</span>
                    </div>
                    <span className="text-white font-mono font-medium">
                        {stats?.chess_blitz?.last?.rating || '-'}
                    </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white/70">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Rapid</span>
                    </div>
                    <span className="text-white font-mono font-medium">
                        {stats?.chess_rapid?.last?.rating || '-'}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                <span>League: {profile.league || 'None'}</span>
                <span>Followers: {profile.followers}</span>
            </div>
        </div>
    );
};
