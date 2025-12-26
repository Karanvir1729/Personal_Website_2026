import { useGitHubStats } from '../../hooks/useGitHubStats';
import { Github, Book, Users, ExternalLink } from 'lucide-react';

export const GitHubWidget = () => {
    const { user, loading, error } = useGitHubStats('Karanvir1729');

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
            </div>
        );
    }

    if (error || !user) return null;

    return (
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 shadow-2xl transition-all hover:bg-black/50 group">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-black">
                        <Github className="w-3 h-3 text-black fill-black" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-lg leading-tight truncate">
                        {user.name || user.login}
                    </h3>
                    <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
                    >
                        @{user.login} <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Bio */}
            {user.bio && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {user.bio}
                </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Book className="w-4 h-4 text-purple-400" />
                    <div>
                        <div className="text-white font-medium">{user.public_repos}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Repos</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                        <div className="text-white font-medium">{user.followers}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Followers</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
